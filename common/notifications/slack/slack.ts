/**
 * Description : Slack.ts - 📌 Slack WebClient 인스턴스 생성
 * Author : Shiwoo Min
 * Date : 2025-04-10
 */
import { slackConfig } from '@common/config/notificationConfig';
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import { WebClient } from '@slack/web-api';
import fs from 'fs';
import path from 'path';
import type winston from 'winston';

// Slack WebClient 인스턴스 생성
const slackClient = new WebClient(slackConfig.SLACK_TOKEN);

export class Slack {
  // 현재 POC 키
  private static readonly poc = POCEnv.getType();
  // 현재 POC 목록
  private static readonly pocList = POCEnv.getList();
  // 로깅 인스턴스
  private static readonly logger: winston.Logger = Logger.getLogger(this.poc) as winston.Logger;

  // 서버 Thread TS 저장소
  private static serverThreadTsMap: Map<string, string> = new Map();
  private static filePathMap: Map<string, string> = new Map();

  /**
   * 서버 Thread TS 설정
   */
  public static setServerThreadTS(poc: string, ts: string): void {
    if (!ts) throw new Error('serverThreadTs is null');
    if (poc === 'ALL') return;
    Slack.serverThreadTsMap.set(poc, ts);
  }

  /**
   * 서버 Thread TS 가져오기
   */
  public static getServerThreadTS(poc: string): string {
    if (poc === 'ALL') throw new Error('serverThreadTs는 단일 POC에서만 사용 가능합니다.');
    const ts = Slack.serverThreadTsMap.get(poc);
    if (!ts) throw new Error('serverThreadTs is null');
    return ts;
  }

  /**
   * Slack 메시지 전송
   */
  public static async sendSlackMessage(message: string, isSuccess: boolean = true): Promise<void> {
    const poc = this.poc;
    const logger = this.logger;

    if (poc === 'ALL') return;

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
  }

  /**
   * Slack 에러 메시지 전송 (Stack Trace 포함)
   */
  public static async sendSlackErrorMessage(message: string, error: Error): Promise<void> {
    const poc = this.poc;
    const logger = this.logger;

    if (poc === 'ALL') return;

    const stackTrace = error.stack ? `\n\`\`\`${error.stack}\`\`\`` : '';

    try {
      await slackClient.chat.postMessage({
        channel: slackConfig.SLACK_CHANNEL,
        text: `*에러 발생 [${poc}]*: ${message}${stackTrace}`,
      });

      logger.info('Slack 에러 메시지 전송 완료');
    } catch (err) {
      logger.error(`Slack 에러 메시지 전송 실패: ${(err as Error).message}`);
    }
  }

  /**
   * Slack 파일 업로드
   */
  public static async uploadSlackFile(
    filePath: string,
    title: string = '첨부 파일',
  ): Promise<void> {
    const poc = this.poc;
    const logger = this.logger;

    if (poc === 'ALL') return;

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
   * 전체 POC에 대해 Slack 메시지 전송 (병렬 처리)
   */
  public static async sendSlackMessageForAllPOCs(
    message: string,
    isSuccess: boolean = true,
  ): Promise<void> {
    const tasks = this.pocList.map(async poc => {
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
}
