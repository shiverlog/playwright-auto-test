import { slackConfig } from '@common/config/BaseConfig';
import { ALL_POCS } from '@common/constants/PathConstants';
import type { POCType } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import { WebClient } from '@slack/web-api';
import fs from 'fs';
import path from 'path';

// Slack WebClient 인스턴스 생성
const slackClient = new WebClient(slackConfig.SLACK_TOKEN);

export class Slack {
  private static serverThreadTsMap: Map<POCType, string> = new Map();
  private static filePathMap: Map<POCType, string> = new Map();

  /**
   * 서버 Thread TS 설정
   */
  public static setServerThreadTS(poc: POCType, ts: string) {
    if (!ts) throw new Error('serverThreadTs is null');
    Slack.serverThreadTsMap.set(poc, ts);
  }

  /**
   * 서버 Thread TS 가져오기
   */
  public static getServerThreadTS(poc: POCType): string {
    const ts = Slack.serverThreadTsMap.get(poc);
    if (!ts) throw new Error('serverThreadTs is null');
    return ts;
  }

  /**
   * Slack 메시지 전송
   */
  public static async sendSlackMessage(poc: POCType, message: string, isSuccess: boolean = true) {
    const logger = Logger.getLogger(poc);
    const formattedMessage = isSuccess ? `[${poc}] ${message} 성공` : `[${poc}] ${message} 실패`;

    try {
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
   * Slack 에러 메시지 전송 (Stack Trace 포함)
   */
  public static async sendSlackErrorMessage(poc: POCType, message: string, error: Error) {
    const logger = Logger.getLogger(poc);
    const stackTrace = error.stack ? `\n\`\`\`${error.stack}\`\`\`` : '';

    try {
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
   * Slack에서 파일 업로드
   */
  public static async uploadSlackFile(poc: POCType, filePath: string, title: string = '첨부 파일') {
    const logger = Logger.getLogger(poc);

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
   * 전체 POC에 대해 Slack 메시지 전송 (병렬 처리)
   */
  public static async sendSlackMessageForAllPOCs(message: string, isSuccess: boolean = true) {
    const sendMessages = ALL_POCS.map(poc => Slack.sendSlackMessage(poc, message, isSuccess));
    await Promise.all(sendMessages);
  }
}
