import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CreateIntegrationAccountDto,
  IntegrationAccount,
  IntegrationAccountIdDto,
  UpdateIntegrationAccountDto,
} from '@tegonhq/types';

import { AuthGuard } from 'modules/auth/auth.guard';

import { IntegrationAccountsRequestBody } from './integration-account.interface';
import { IntegrationAccountService } from './integration-account.service';

@Controller({
  version: '1',
  path: 'integration_account',
})
@ApiTags('Integration Account')
@ApiBadRequestResponse({
  status: 400,
  type: 'string',
  description: 'Bad Request',
})
@ApiUnauthorizedResponse({
  status: 401,
  type: 'string',
  description: 'Not authorised',
})
export class IntegrationAccountController {
  constructor(private integrationAccountService: IntegrationAccountService) {}

  /**
   * Get all integration accounts in a workspace
   */
  @Get()
  @UseGuards(new AuthGuard())
  async getIntegrationAccounts(
    @Query()
    integrationAccountsRequestBody: IntegrationAccountsRequestBody,
  ): Promise<IntegrationAccount[]> {
    return await this.integrationAccountService.getIntegrationAccountsForWorkspace(
      integrationAccountsRequestBody.workspaceId,
    );
  }

  @Get('accountId')
  @UseGuards(new AuthGuard())
  async getIntegrationAccountByAccountId(
    @Query('accountId') accountId: string,
  ): Promise<IntegrationAccount> {
    return await this.integrationAccountService.getIntegrationAccountByAccountId(
      accountId,
    );
  }

  /**
   * Get a integration accounts in a workspace
   */
  @Get(':integrationAccountId')
  @UseGuards(new AuthGuard())
  async getIntegrationAccount(
    @Param()
    integrationAccountIdRequestIdBody: IntegrationAccountIdDto,
  ): Promise<IntegrationAccount> {
    return await this.integrationAccountService.getIntegrationAccountWithId(
      integrationAccountIdRequestIdBody,
    );
  }

  /**
   * Delete a Integration account
   */
  @Delete(':integrationAccountId')
  @UseGuards(new AuthGuard())
  async deleteIntegrationAccount(
    @Param()
    integrationAccountIdRequestIdBody: IntegrationAccountIdDto,
  ) {
    return await this.integrationAccountService.deleteIntegrationAccount(
      integrationAccountIdRequestIdBody,
    );
  }

  /**
   * Update a integration account in workspace
   */
  @Post(':integrationAccountId')
  @UseGuards(new AuthGuard())
  async updateIntegrationAccount(
    @Param()
    integrationAccountIdRequestIdBody: IntegrationAccountIdDto,
    @Body()
    updateIntegrationAccountBody: UpdateIntegrationAccountDto,
  ): Promise<IntegrationAccount> {
    return await this.integrationAccountService.updateIntegrationAccount(
      integrationAccountIdRequestIdBody.integrationAccountId,
      updateIntegrationAccountBody,
    );
  }

  /**
   * Create integration account in a workspace
   */
  @Post()
  @UseGuards(new AuthGuard())
  async createIntegrationAccount(
    @Body()
    createIntegrationAccountBody: CreateIntegrationAccountDto,
  ): Promise<IntegrationAccount> {
    return await this.integrationAccountService.createIntegrationAccount(
      createIntegrationAccountBody,
    );
  }
}
