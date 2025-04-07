/**
 * Description : SlackHandler.ts - 📌 Slack 메시지 전송 및 파일 업로드를 처리
 * Author : Shiwoo Min
 * Date : 2025-04-04
 */
import { slackConfig } from '@common/config/notificationConfig';
import { NotificationHandler } from '@common/handlers/notificationHandler';
import { Logger } from '@common/logger/customLogger';
import type { POCKey, POCType } from '@common/types/platform-types';
import { ALL_POCS } from '@common/types/platform-types';
import { WebClient } from '@slack/web-api';
import fs from 'fs';
import pRetry from 'p-retry';
import path from 'path';
import type winston from 'winston';

// Slack WebClient 인스턴스 생성
const slackClient = new WebClient(slackConfig.SLACK_TOKEN);

/**
 * Slack 메시지 전송 및 파일 업로드를 처리하는 SlackHandler 클래스
 * NotificationHandler 클래스를 상속받아 기본 메시지 전송 및 파일 업로드 로직을 확장합니다.
 */
export class SlackHandler extends NotificationHandler {
  /**
   * 단일 POC에 Slack 메시지를 전송
   */
  public static async sendSlackMessage(
    poc: POCType,
    message: string,
    isSuccess: boolean = true,
  ): Promise<void> {
    if (poc === 'ALL') return;

    const pocKey = poc as POCKey;
    const logger = Logger.getLogger(pocKey) as winston.Logger;

    if (!slackConfig.SLACK_TOKEN || !slackConfig.SLACK_CHANNEL) {
      logger.warn('Slack 토큰 또는 채널 ID가 설정되지 않았습니다.');
      return;
    }

    try {
      const formattedMessage = isSuccess
        ? `[${pocKey}] ${message} 성공`
        : `[${pocKey}] ${message} 실패`;

      await slackClient.chat.postMessage({
        channel: slackConfig.SLACK_CHANNEL,
        text: formattedMessage,
      });

      logger.info(`Slack 메시지 전송 완료: ${formattedMessage}`);
    } catch (error) {
      logger.error(`Slack 메시지 전송 실패: ${(error as Error).message}`);
    }
  }

  /**
   * 단일 POC에 Slack 메시지를 재시도 전송
   */
  public static async sendSlackMessageWithRetry(
    poc: POCType,
    message: string,
    isSuccess: boolean = true,
  ): Promise<void> {
    if (poc === 'ALL') return;
    await pRetry(() => SlackHandler.sendSlackMessage(poc, message, isSuccess), {
      retries: 3,
      factor: 2,
      minTimeout: 1000,
    });
  }

  /**
   * Slack 에러 메시지 전송 (Stack Trace 포함)
   */
  public static async sendSlackErrorMessage(
    poc: POCType,
    message: string,
    error: Error,
  ): Promise<void> {
    if (poc === 'ALL') return;

    const pocKey = poc as POCKey;
    const logger = Logger.getLogger(pocKey) as winston.Logger;

    if (!slackConfig.SLACK_TOKEN || !slackConfig.SLACK_CHANNEL) {
      logger.warn('Slack 토큰 또는 채널 ID가 설정되지 않았습니다.');
      return;
    }

    try {
      const stackTrace = error.stack ? `\n\`\`\`${error.stack}\`\`\`` : '';
      await slackClient.chat.postMessage({
        channel: slackConfig.SLACK_CHANNEL,
        text: `*에러 발생 [${pocKey}]*: ${message}${stackTrace}`,
      });

      logger.info('Slack 에러 메시지 전송 완료');
    } catch (err) {
      logger.error(`Slack 에러 메시지 전송 실패: ${(err as Error).message}`);
    }
  }

  /**
   * Slack에 파일 업로드
   */
  public static async uploadSlackFile(
    poc: POCType,
    filePath: string,
    title: string = '첨부 파일',
  ): Promise<void> {
    if (poc === 'ALL') return;

    const pocKey = poc as POCKey;
    const logger = Logger.getLogger(pocKey) as winston.Logger;

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
      logger.error(`Slack 파일 업로드 실패: ${(error as Error).message}`);
    }
  }

  /**
   * 전체 POC에 대해 Slack 파일 업로드
   */
  public static async uploadSlackFileForAllPOCs(
    filePath: string,
    title: string = '공통 첨부 파일',
  ): Promise<void> {
    const uploadTasks = ALL_POCS.map(poc => SlackHandler.uploadSlackFile(poc, filePath, title));
    await Promise.all(uploadTasks);
  }

  /**
   * 전체 POC에 대해 Slack 메시지 전송
   */
  public static async sendSlackMessageForAllPOCs(
    message: string,
    isSuccess: boolean = true,
  ): Promise<void> {
    const sendTasks = ALL_POCS.map(poc => SlackHandler.sendSlackMessage(poc, message, isSuccess));
    await Promise.all(sendTasks);
  }
}
