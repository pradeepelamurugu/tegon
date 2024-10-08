import { Readable } from 'stream';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateIssueDto,
  CreateLinkedIssueDto,
  Issue,
  IssueRequestParamsDto,
  TeamRequestParamsDto,
  UpdateIssueDto,
  WorkspaceRequestParamsDto,
} from '@tegonhq/types';
import { Response } from 'express';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';
import LinkedIssueService from 'modules/linked-issue/linked-issue.service';

import { ApiResponse, SubscribeIssueInput } from './issues.interface';
import IssuesService from './issues.service';

@Controller({
  version: '1',
  path: 'issues',
})
@ApiTags('Issues')
export class IssuesController {
  constructor(
    private issuesService: IssuesService,
    private linkedIssueService: LinkedIssueService,
  ) {}

  @Post()
  @UseGuards(new AuthGuard())
  async createIssue(
    @SessionDecorator() session: SessionContainer,
    @Body() issueData: CreateIssueDto,
  ) {
    const userId = session.getUserId();
    return await this.issuesService.createIssueAPI(issueData, userId);
  }

  @Post(':issueId')
  @UseGuards(new AuthGuard())
  async updateIssue(
    @SessionDecorator() session: SessionContainer,
    @Param() issueParams: IssueRequestParamsDto,
    @Query() teamParams: TeamRequestParamsDto,
    @Body() issueData: UpdateIssueDto,
  ): Promise<Issue | ApiResponse> {
    const userId = session.getUserId();
    return await this.issuesService.updateIssueApi(
      teamParams,
      issueData,
      issueParams,
      userId,
    );
  }

  @Delete(':issueId')
  @UseGuards(new AuthGuard())
  async deleteIssue(
    @Param() issueParams: IssueRequestParamsDto,
    @Query() teamParams: TeamRequestParamsDto,
  ): Promise<Issue> {
    return await this.issuesService.deleteIssue(teamParams, issueParams);
  }

  @Post(':issueId/link')
  @UseGuards(new AuthGuard())
  async linkIssue(
    @SessionDecorator() session: SessionContainer,
    @Param() issueParams: IssueRequestParamsDto,
    @Body() linkData: CreateLinkedIssueDto,
  ) {
    const userId = session.getUserId();
    return await this.linkedIssueService.createLinkIssue(
      linkData,
      issueParams,
      userId,
    );
  }

  @Post(':issueId/subscribe')
  @UseGuards(new AuthGuard())
  async subscribeIssue(
    @SessionDecorator() session: SessionContainer,
    @Param() issueParams: IssueRequestParamsDto,
    @Body() subscriberData: SubscribeIssueInput,
  ) {
    const userId = session.getUserId();
    return await this.issuesService.handleSubscription(
      userId,
      issueParams.issueId,
      subscriberData.type,
    );
  }

  @Get('export')
  @UseGuards(new AuthGuard())
  async exportIssues(
    @Query() workspaceParams: WorkspaceRequestParamsDto,
    @Res() res: Response,
  ): Promise<void> {
    const csvString = await this.issuesService.exportIssues(workspaceParams);

    const csvBuffer = Buffer.from(csvString, 'utf-8');
    const csvStream = new Readable();

    csvStream._read = () => {
      csvStream.push(csvBuffer);
      csvStream.push(null);
    };

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="issues.csv"',
    });

    csvStream.pipe(res);
  }

  @Post(':issueId/move')
  @UseGuards(new AuthGuard())
  async moveIssue(
    @SessionDecorator() session: SessionContainer,
    @Param() issueParams: IssueRequestParamsDto,
    @Body() moveData: TeamRequestParamsDto,
  ) {
    const userId = session.getUserId();
    return await this.issuesService.moveIssue(
      userId,
      issueParams.issueId,
      moveData.teamId,
    );
  }
}
