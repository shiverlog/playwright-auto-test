/**
 * Description : notificationConfig.ts - 📌 Slack, Teams, Email 등 알림 관련 설정 분리 파일
 * Author : Shiwoo Min
 * Date : 2025-04-07
 */
import type { EmailConfig, SlackConfig, TeamsConfig } from '@common/types/notification-config.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Slack 설정
 */
export const slackConfig: SlackConfig = {
  SLACK_TOKEN: process.env.SLACK_BOT_TOKEN || '',
  SLACK_CHANNEL: process.env.SLACK_CHANNEL_ID || '',
  SLACK_MENTION_ID: process.env.SLACK_MENTION_ID || '',
  SLACK_MENTION_CHANNEL: process.env.SLACK_MENTION_CHANNEL || '',
  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL || '',
  SLACK_FILES_UPLOAD_URL: 'https://lgdigitalcommerce.slack.com/api/files.upload',
};

/**
 * Microsoft Teams 설정
 */
export const teamsConfig: TeamsConfig = {
  TEAMS_WEBHOOK_URL: process.env.TEAMS_WEBHOOK_URL || '',
};

/**
 * Email 설정
 */
export const emailConfig: EmailConfig = {
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || process.env.SMTP_USER || '',
  EMAIL_TO: process.env.EMAIL_TO || '',
};

/**
 * PubSub 설정
 */
export const PUBSUB = {
  PROJECT_ID: process.env.PUBSUB_PROJECT_ID || 'gcp-dev-uhdc-id',
  TOPIC_ID: process.env.PUBSUB_TOPIC_ID || 'qa-test',
  PUBLISHER_AUDIENCE:
    process.env.PUBSUB_PUBLISHER_AUDIENCE ||
    'https://pubsub.googleapis.com/google.pubsub.v1.Publisher',
};
