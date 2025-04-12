/**
 * Description : SlackHandler.ts - 📌 Slack 메시지 전송, 에러, 파일 업로드, Thread 관리 통합 핸들러
 * Author : Shiwoo Min
 * Date : 2025-04-12
 */
import { slackConfig } from '@common/config/notificationConfig';
import { NotificationHandler } from '@common/notifications/NotificationHandler';
import { POCEnv } from '@common/utils/env/POCEnv';
import { WebClient } from '@slack/web-api';
import fs from 'fs';
import pRetry from 'p-retry';
import path from 'path';

// Slack WebClient 인스턴스 생성
const slackClient = new WebClient(slackConfig.SLACK_TOKEN);

export class SlackHandler extends NotificationHandler {
  private static readonly poc = POCEnv.getKey();
  private static readonly pocList = POCEnv.getPOCKeyList();

  // 서버 Thread TS 저장소
  private static serverThreadTsMap: Map<string, string> = new Map();

  /**
   * 단일 Slack 메시지를 전송
   */
  public static async sendSlackMessage(message: string, isSuccess: boolean = true): Promise<void> {
    if (POCEnv.isAll()) return;

    const formattedMessage = this.formatMessage(this.poc, message, isSuccess);

    try {
      await slackClient.chat.postMessage({
        channel: slackConfig.SLACK_CHANNEL,
        text: formattedMessage,
      });

      this.logger.info(`Slack 메시지 전송 완료: ${formattedMessage}`);
    } catch (error) {
      this.logger.error(`Slack 메시지 전송 실패: ${(error as Error).message}`);
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
    if (POCEnv.isAll()) return;

    const stackTrace = error.stack ? `\n\`\`\`${error.stack}\`\`\`` : '';
    const formatted = `*에러 발생 [${this.poc}]*: ${message}${stackTrace}`;

    try {
      await slackClient.chat.postMessage({
        channel: slackConfig.SLACK_CHANNEL,
        text: formatted,
      });

      this.logger.info('Slack 에러 메시지 전송 완료');
    } catch (err) {
      this.logger.error(`Slack 에러 메시지 전송 실패: ${(err as Error).message}`);
    }
  }

  /**
   * Slack에 파일 업로드
   */
  public static async uploadSlackFile(
    filePath: string,
    title: string = '첨부 파일',
  ): Promise<void> {
    if (POCEnv.isAll()) return;

    if (!fs.existsSync(filePath)) {
      this.logger.warn(`파일이 존재하지 않습니다: ${filePath}`);
      return;
    }

    try {
      await slackClient.files.upload({
        channels: slackConfig.SLACK_CHANNEL,
        file: fs.createReadStream(filePath),
        title: title || path.basename(filePath),
      });

      this.logger.info(`Slack 파일 업로드 완료: ${filePath}`);
    } catch (error) {
      this.logger.error(`Slack 파일 업로드 실패: ${(error as Error).message}`);
    }
  }

  /**
   * 전체 POC에 대해 Slack 메시지 전송
   */
  public static async sendSlackMessageForAllPOCs(
    message: string,
    isSuccess: boolean = true,
  ): Promise<void> {
    const tasks = this.pocList.map(async poc => {
      const formattedMessage = this.formatMessage(poc, message, isSuccess);

      try {
        await slackClient.chat.postMessage({
          channel: slackConfig.SLACK_CHANNEL,
          text: formattedMessage,
        });
        this.logger.info(`[${poc}] Slack 메시지 전송 완료`);
      } catch (error) {
        this.logger.error(`[${poc}] Slack 메시지 전송 실패: ${(error as Error).message}`);
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
    if (!fs.existsSync(filePath)) {
      this.logger.warn(`파일이 존재하지 않습니다: ${filePath}`);
      return;
    }

    const tasks = this.pocList.map(async poc => {
      try {
        await slackClient.files.upload({
          channels: slackConfig.SLACK_CHANNEL,
          file: fs.createReadStream(filePath),
          title: title || path.basename(filePath),
        });

        this.logger.info(`[${poc}] Slack 파일 업로드 완료`);
      } catch (error) {
        this.logger.error(`[${poc}] Slack 파일 업로드 실패: ${(error as Error).message}`);
      }
    });

    await Promise.all(tasks);
  }

  /**
   * 서버 Thread TS 설정
   */
  public static setServerThreadTS(poc: string, ts: string): void {
    if (!ts) throw new Error('serverThreadTs is null');
    if (POCEnv.isAll()) return;
    this.serverThreadTsMap.set(poc, ts);
  }

  /**
   * 서버 Thread TS 가져오기
   */
  public static getServerThreadTS(poc: string): string {
    if (POCEnv.isAll()) throw new Error('serverThreadTs는 단일 POC에서만 사용 가능합니다.');
    const ts = this.serverThreadTsMap.get(poc);
    if (!ts) throw new Error('serverThreadTs is null');
    return ts;
  }
}
