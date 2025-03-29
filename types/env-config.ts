/**
 * 타입 정의: env-config.ts
 * 설명: 슬랙/이메일/Teams 환경 설정 타입 정의
 */

/**
 * Slack 관련 설정을 정의하는 인터페이스
 */
export interface SlackConfig {
  // 슬랙 봇 토큰
  SLACK_TOKEN: string;
  // 슬랙 채널 ID
  SLACK_CHANNEL: string;
  // 슬랙에서 멘션할 사용자 ID (옵션)
  SLACK_MENTION_ID?: string;
  // 슬랙에서 멘션할 채널 ID (옵션)
  SLACK_MENTION_CHANNEL?: string;
}

/**
 * Microsoft Teams 관련 설정
 */
export interface TeamsConfig {
  // Microsoft Teams Webhook URL
  TEAMS_WEBHOOK_URL: string;
}

/**
 * 이메일 발송 관련 설정
 */
export interface EmailConfig {
  // SMTP 서버 호스트 주소
  SMTP_HOST: string;
  // SMTP 포트 번호
  SMTP_PORT: number;
  // SMTP 사용자 계정
  SMTP_USER: string;
  // SMTP 비밀번호
  SMTP_PASS: string;
  // 발신자 이메일 주소
  EMAIL_FROM: string;
  // 수신자 이메일 주소
  EMAIL_TO: string;
}
