import { IntegrationAccount, WebhookData } from '@tegonhq/types';
import { logger } from 'utils';

import { slackThread } from './thread';
import { slackTriage } from './triage';
import { SlackIntegrationSettings } from '../types';

export const webhookHandler = async ({
  integrationAccount,
  data,
  userId,
}: {
  integrationAccount: IntegrationAccount;
  data: WebhookData;
  userId: string;
}) => {
  const { eventBody, eventHeaders } = data;

  // Check if the event is a URL verification challenge
  if (eventBody.type === 'url_verification') {
    logger.log('Responding to Slack URL verification challenge');
    return { challenge: eventBody.challenge };
  }

  const { event, team_id: teamId } = eventBody;

  // If no integration account is found, log and return undefined
  if (!integrationAccount) {
    logger.debug('No integration account found for team:', teamId);
    return undefined;
  }

  const slackSettings =
    integrationAccount.settings as unknown as SlackIntegrationSettings;
  // Check if the message is from the bot user
  const isBotMessage = slackSettings.botUserId === event.user;

  // If the message is from the bot, ignore it
  if (isBotMessage) {
    logger.debug('Ignoring bot message');
    return undefined;
  }

  logger.log('Processing Slack event:', event.type);

  const webhookPayload = {
    eventBody,
    eventHeaders,
  };

  // Handle different event types
  switch (event.type) {
    case 'message':
      // Handle thread messages
      await slackThread(integrationAccount, webhookPayload);
      break;
    case 'reaction_added':
      // Handle message reactions)
      await slackTriage(integrationAccount, userId, webhookPayload);
      break;
    default:
      logger.debug('Unhandled Slack event type:', event.type);
      return undefined;
  }

  return { status: 200 };
};
