/**
 * Description : notificationConfig.ts - 📌 Slack, Teams, Email 등 알림 관련 설정 분리 파일
 * Author : Shiwoo Min
 * Date : 2025-04-11
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

/**
 * 알림 활성화 여부 (환경변수 기반)
 */
export const NOTIFY_SLACK = process.env.NOTIFY_SLACK === 'true';
export const NOTIFY_TEAMS = process.env.NOTIFY_TEAMS === 'true';
export const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL === 'true';

/**
 * 통합 알림 설정
 */
export const notificationConfig = {
  slack: slackConfig,
  teams: teamsConfig,
  email: emailConfig,
  pubsub: PUBSUB,
  enabled: {
    slack: NOTIFY_SLACK,
    teams: NOTIFY_TEAMS,
    email: NOTIFY_EMAIL,
  },
};

/**
 * 알림 설정 유효성 검증 함수
 */
export function validateNotificationConfig(): void {
  if (NOTIFY_SLACK && (!slackConfig.SLACK_TOKEN || !slackConfig.SLACK_CHANNEL)) {
    console.warn('[SlackConfig] Slack Token 또는 Channel ID가 누락되었습니다.');
  }
  if (NOTIFY_TEAMS && !teamsConfig.TEAMS_WEBHOOK_URL) {
    console.warn('[TeamsConfig] Microsoft Teams Webhook URL이 누락되었습니다.');
  }
  if (
    NOTIFY_EMAIL &&
    (!emailConfig.SMTP_HOST || !emailConfig.SMTP_USER || !emailConfig.SMTP_PASS)
  ) {
    console.warn('[EmailConfig] SMTP 설정이 불완전합니다.');
  }
  if (!PUBSUB.PROJECT_ID || !PUBSUB.TOPIC_ID) {
    console.warn('[PubSubConfig] PubSub 설정이 불완전합니다.');
  }
}
