import { slackConfig } from '@common/config/BaseConfig';
import { ALL_POCS } from '@common/constants/PathConstants';
import type { POCType } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import { NotificationHandler } from '@common/notifications/notificationHandler';
import { WebClient } from '@slack/web-api';
import fs from 'fs';
import pRetry from 'p-retry';
import path from 'path';

// Slack WebClient 인스턴스 생성
const slackClient = new WebClient(slackConfig.SLACK_TOKEN);

/**
 * Slack 메시지 전송 및 파일 업로드를 처리하는 SlackHandler 클래스
 * NotificationHandler 클래스를 상속받아 기본 메시지 전송 및 파일 업로드 로직을 확장합니다.
 */
export class SlackHandler extends NotificationHandler {
  /**
   * 단일 POC에 Slack 메시지를 전송
   * @param poc - POC 타입 (예: 'pc-web', 'mobile-web', 'ios' 등)
   * @param message - 전송할 메시지 내용
   * @param isSuccess - 성공 여부 (true: 성공, false: 실패)
   */
  public static async sendSlackMessage(poc: POCType, message: string, isSuccess: boolean = true) {
    const logger = Logger.getLogger(poc);

    if (!slackConfig.SLACK_TOKEN || !slackConfig.SLACK_CHANNEL) {
      logger.warn('Slack 토큰 또는 채널 ID가 설정되지 않았습니다.');
      return;
    }

    try {
      const formattedMessage = isSuccess ? `[${poc}] ${message} 성공` : `[${poc}] ${message} 실패`;

      await slackClient.chat.postMessage({
        channel: slackConfig.SLACK_CHANNEL,
        text: formattedMessage,
      });

      logger.info(`Slack 메시지 전송 완료: ${formattedMessage}`);
    } catch (error) {
      logger.error('Slack 메시지 전송 실패:', error);
    }
  }

  /**
   * 단일 POC에 Slack 메시지를 재시도 전송
   * @param poc - POC 타입
   * @param message - 전송할 메시지
   * @param isSuccess - 성공 여부 (true: 성공, false: 실패)
   */
  public static async sendSlackMessageWithRetry(
    poc: POCType,
    message: string,
    isSuccess: boolean = true,
  ) {
    await pRetry(() => SlackHandler.sendSlackMessage(poc, message, isSuccess), {
      retries: 3,
      factor: 2,
      minTimeout: 1000,
    });
  }

  /**
   * Slack 에러 메시지 전송 (Stack Trace 포함)
   * @param poc - POC 타입
   * @param message - 에러 메시지 내용
   * @param error - 에러 객체
   */
  public static async sendSlackErrorMessage(poc: POCType, message: string, error: Error) {
    const logger = Logger.getLogger(poc);

    if (!slackConfig.SLACK_TOKEN || !slackConfig.SLACK_CHANNEL) {
      logger.warn('Slack 토큰 또는 채널 ID가 설정되지 않았습니다.');
      return;
    }

    try {
      const stackTrace = error.stack ? `\n\`\`\`${error.stack}\`\`\`` : '';

      await slackClient.chat.postMessage({
        channel: slackConfig.SLACK_CHANNEL,
        text: `*에러 발생 [${poc}]*: ${message}${stackTrace}`,
      });

      logger.info('Slack 에러 메시지 전송 완료');
    } catch (err) {
      logger.error('Slack 에러 메시지 전송 실패:', err);
    }
  }

  /**
   * Slack에 파일 업로드
   * @param poc - POC 타입
   * @param filePath - 업로드할 파일 경로
   * @param title - 파일 제목
   */
  public static async uploadSlackFile(poc: POCType, filePath: string, title: string = '첨부 파일') {
    const logger = Logger.getLogger(poc);

    if (!slackConfig.SLACK_TOKEN || !slackConfig.SLACK_CHANNEL) {
      logger.warn('Slack 토큰 또는 채널 ID가 설정되지 않았습니다.');
      return;
    }

    if (!fs.existsSync(filePath)) {
      logger.warn(`파일이 존재하지 않습니다: ${filePath}`);
      return;
    }

    try {
      await slackClient.files.upload({
        channels: slackConfig.SLACK_CHANNEL,
        file: fs.createReadStream(filePath),
        title: title || path.basename(filePath),
      });

      logger.info(`Slack 파일 업로드 완료: ${filePath}`);
    } catch (error) {
      logger.error('Slack 파일 업로드 실패:', error);
    }
  }

  /**
   * 전체 POC에 대해 파일 업로드 (병렬 처리)
   * @param filePath - 업로드할 파일 경로
   * @param title - 파일 제목
   */
  public static async uploadSlackFileForAllPOCs(
    filePath: string,
    title: string = '공통 첨부 파일',
  ) {
    for (const poc of ALL_POCS) {
      await SlackHandler.uploadSlackFile(poc, filePath, title);
    }
  }

  /**
   * 전체 POC에 대해 Slack 메시지 전송 (병렬 처리)
   * @param message - 전송할 메시지
   * @param isSuccess - 성공 여부 (true: 성공, false: 실패)
   */
  public static async sendSlackMessageForAllPOCs(message: string, isSuccess: boolean = true) {
    const sendMessages = ALL_POCS.map(poc =>
      SlackHandler.sendSlackMessage(poc, message, isSuccess),
    );
    await Promise.all(sendMessages);
  }
}
