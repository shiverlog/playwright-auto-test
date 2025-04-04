/**
 * Description : Slack.ts - 📌 Slack WebClient 인스턴스 생성
 * Author : Shiwoo Min
 * Date : 2025-04-04
 */
import { slackConfig } from '@common/config/BaseConfig';
import { Logger } from '@common/logger/customLogger';
import type { POCKey, POCType } from '@common/types/platform-types';
import { ALL_POCS } from '@common/types/platform-types';
import { WebClient } from '@slack/web-api';
import fs from 'fs';
import path from 'path';
import type winston from 'winston';

// Slack WebClient 인스턴스 생성
const slackClient = new WebClient(slackConfig.SLACK_TOKEN);

export class Slack {
  private static serverThreadTsMap: Map<POCKey, string> = new Map();
  private static filePathMap: Map<POCKey, string> = new Map();

  /**
   * 서버 Thread TS 설정
   */
  public static setServerThreadTS(poc: POCType, ts: string): void {
    if (!ts) throw new Error('serverThreadTs is null');
    if (poc === 'ALL') return;
    Slack.serverThreadTsMap.set(poc as POCKey, ts);
  }

  /**
   * 서버 Thread TS 가져오기
   */
  public static getServerThreadTS(poc: POCType): string {
    if (poc === 'ALL') throw new Error('serverThreadTs는 단일 POC에서만 사용 가능합니다.');
    const ts = Slack.serverThreadTsMap.get(poc as POCKey);
    if (!ts) throw new Error('serverThreadTs is null');
    return ts;
  }

  /**
   * Slack 메시지 전송
   */
  public static async sendSlackMessage(
    poc: POCType,
    message: string,
    isSuccess: boolean = true,
  ): Promise<void> {
    if (poc === 'ALL') return;

    const pocKey = poc as POCKey;
    const logger = Logger.getLogger(pocKey) as winston.Logger;
    const formattedMessage = isSuccess
      ? `[${pocKey}] ${message} 성공`
      : `[${pocKey}] ${message} 실패`;

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
  public static async sendSlackErrorMessage(
    poc: POCType,
    message: string,
    error: Error,
  ): Promise<void> {
    if (poc === 'ALL') return;

    const pocKey = poc as POCKey;
    const logger = Logger.getLogger(pocKey) as winston.Logger;
    const stackTrace = error.stack ? `\n\`\`\`${error.stack}\`\`\`` : '';

    try {
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
   * Slack에서 파일 업로드
   */
  public static async uploadSlackFile(
    poc: POCType,
    filePath: string,
    title: string = '첨부 파일',
  ): Promise<void> {
    if (poc === 'ALL') return;

    const pocKey = poc as POCKey;
    const logger = Logger.getLogger(pocKey) as winston.Logger;

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
    const sendTasks = ALL_POCS.map(poc => Slack.sendSlackMessage(poc, message, isSuccess));
    await Promise.all(sendTasks);
  }
}
