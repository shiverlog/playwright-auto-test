/**
 * Description : SlackHandler.ts - 📌 Slack 메시지 전송 및 파일 업로드를 처리
 * Author : Shiwoo Min
 * Date : 2025-04-10
 */
import { slackConfig } from '@common/config/notificationConfig';
import { Logger } from '@common/logger/customLogger';
import { NotificationHandler } from '@common/notifications/notificationHandler';
import { POCEnv } from '@common/utils/env/POCEnv';
import { WebClient } from '@slack/web-api';
import fs from 'fs';
import pRetry from 'p-retry';
import path from 'path';
import type winston from 'winston';

// Slack WebClient 인스턴스 생성
const slackClient = new WebClient(slackConfig.SLACK_TOKEN);

/**
 * Slack 메시지 전송 및 파일 업로드를 처리하는 SlackHandler 클래스
 */
export class SlackHandler extends NotificationHandler {
  /**
   * 단일 Slack 메시지를 전송
   */
  public static async sendSlackMessage(message: string, isSuccess: boolean = true): Promise<void> {
    const pocKey = POCEnv.getType();
    const logger = Logger.getLogger(pocKey) as winston.Logger;

    if (pocKey === 'ALL') return;

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
   * Slack 메시지를 재시도 전송
   */
  public static async sendSlackMessageWithRetry(
    message: string,
    isSuccess: boolean = true,
  ): Promise<void> {
    await pRetry(() => SlackHandler.sendSlackMessage(message, isSuccess), {
      retries: 3,
      factor: 2,
      minTimeout: 1000,
    });
  }

  /**
   * Slack 에러 메시지 전송 (Stack Trace 포함)
   */
  public static async sendSlackErrorMessage(message: string, error: Error): Promise<void> {
    const pocKey = POCEnv.getType();
    const logger = Logger.getLogger(pocKey) as winston.Logger;

    if (pocKey === 'ALL') return;

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
    filePath: string,
    title: string = '첨부 파일',
  ): Promise<void> {
    const pocKey = POCEnv.getType();
    const logger = Logger.getLogger(pocKey) as winston.Logger;

    if (pocKey === 'ALL') return;

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
   * 전체 POC에 대해 Slack 메시지 전송
   */
  public static async sendSlackMessageForAllPOCs(
    message: string,
    isSuccess: boolean = true,
  ): Promise<void> {
    const pocList = POCEnv.getList();

    const tasks = pocList.map(async poc => {
      const logger = Logger.getLogger(poc) as winston.Logger;
      const formattedMessage = isSuccess ? `[${poc}] ${message} 성공` : `[${poc}] ${message} 실패`;

      try {
        await slackClient.chat.postMessage({
          channel: slackConfig.SLACK_CHANNEL,
          text: formattedMessage,
        });
        logger.info(`Slack 메시지 전송 완료: ${formattedMessage}`);
      } catch (error) {
        logger.error(`Slack 메시지 전송 실패: ${(error as Error).message}`);
      }
    });

    await Promise.all(tasks);
  }

  /**
   * 전체 POC에 대해 Slack 파일 업로드
   */
  public static async uploadSlackFileForAllPOCs(
    filePath: string,
    title: string = '공통 첨부 파일',
  ): Promise<void> {
    const pocList = POCEnv.getList();

    const tasks = pocList.map(async poc => {
      const logger = Logger.getLogger(poc) as winston.Logger;

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
    });

    await Promise.all(tasks);
  }
}
