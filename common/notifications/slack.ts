import { slackConfig } from '@common/config/onfig';
import { ALL_POCS, POCType } from '@common/constants/PathConstants';
import { slackForm } from '@common/formatters/slackForm';
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
   * 파일 경로 설정
   */
  public static setFilePath(poc: POCType, filePath: string) {
    if (!filePath) throw new Error('filePath is null');
    Slack.filePathMap.set(poc, filePath);
  }

  /**
   * 파일 경로 가져오기
   */
  public static getFilePath(poc: POCType): string {
    const filePath = Slack.filePathMap.get(poc);
    if (!filePath) throw new Error('filePath is null');
    return filePath;
  }

  /**
   * 테스트 시작 메시지 전송
   */
  public static async sendSlackServerTitle(poc: POCType) {
    const logger = Logger.getLogger(poc);
    const now = new Date();

    const blocks = Slack.formatBlocks(
      slackForm(poc).serverTitle,
      now.getMonth() + 1,
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
    );

    try {
      const response = await slackClient.chat.postMessage({
        channel: slackConfig.SLACK_CHANNEL,
        blocks,
        text: '테스트 시작',
      });

      Slack.setServerThreadTS(poc, response.ts || '');
    } catch (error) {
      logger.error('Slack 실행 로그 메시지 전송 실패:', error);
    }
  }

  /**
   * 테스트 결과 전송
   */
  public static async sendSlackServerResult(poc: POCType, testResult: boolean) {
    const logger = Logger.getLogger(poc);
    const result = testResult ? 'PASS' : 'FAIL';
    const blocks = Slack.formatBlocks(slackForm(poc).serverResult, result);

    try {
      await slackClient.chat.postMessage({
        channel: slackConfig.SLACK_CHANNEL,
        blocks,
        text: '테스트 결과',
      });

      if (slackConfig.SLACK_CHANNEL === slackConfig.SLACK_MENTION_CHANNEL && result === 'FAIL') {
        await Slack.sendSlackMention(poc);
      }
    } catch (error) {
      logger.error(`Slack 테스트 결과 전송 실패: ${error}`);
    }
  }

  /**
   * 텍스트 로그 메시지 전송 (Thread)
   */
  public static async sendSlackText(poc: POCType, log: string, isSuccess = true) {
    const logger = Logger.getLogger(poc);
    const prefix = isSuccess ? `[${poc} - PASS]` : `[${poc} - FAIL]`;

    try {
      await slackClient.chat.postMessage({
        channel: slackConfig.SLACK_CHANNEL,
        thread_ts: Slack.getServerThreadTS(poc),
        text: `${prefix} - ${log}`,
      });
    } catch (error) {
      logger.error('Slack 로그 메시지 전송 실패:', error);
    }
  }

  /**
   * 이미지 업로드
   */
  public static async sendSlackImage(poc: POCType, comment = '이슈') {
    const logger = Logger.getLogger(poc);
    const filePath = Slack.getFilePath(poc);

    try {
      await slackClient.files.upload({
        channels: slackConfig.SLACK_CHANNEL,
        thread_ts: Slack.getServerThreadTS(poc),
        file: fs.createReadStream(filePath),
        title: '이슈 이미지',
        initial_comment: comment,
      });
    } catch (error) {
      logger.error('Slack 스크린샷 업로드 실패:', error);
    }
  }

  /**
   * 멘션 전송
   */
  public static async sendSlackMention(poc: POCType) {
    const logger = Logger.getLogger(poc);

    try {
      await slackClient.chat.postMessage({
        channel: slackConfig.SLACK_CHANNEL,
        thread_ts: Slack.getServerThreadTS(poc),
        text: slackConfig.SLACK_MENTION_ID,
      });
    } catch (error) {
      logger.error('Slack 멘션 전송 실패:', error);
    }
  }

  /**
   * 로그 파일 업로드
   */
  public static async sendSlackLogFile(poc: POCType) {
    const logger = Logger.getLogger(poc);
    const logFilePath = path.join(
      'result/debug/',
      `${new Date().toISOString().slice(0, 10)}_info.log`,
    );

    try {
      await slackClient.files.upload({
        channels: slackConfig.SLACK_CHANNEL,
        file: fs.createReadStream(logFilePath),
        title: `${poc}_log_file`,
      });
    } catch (error) {
      logger.error('Slack 로그 파일 업로드 실패:', error);
    }
  }

  /**
   * 블록 템플릿에서 {} 자리에 값 채워넣기
   */
  private static formatBlocks(template: any, ...args: any[]): any {
    return JSON.parse(JSON.stringify(template).replace(/{}/g, () => args.shift()));
  }

  /**
   * 전체 POC에 대해 테스트 시작 메시지 전송
   */
  public static async batchSendSlackServerTitle() {
    for (const poc of ALL_POCS) {
      await Slack.sendSlackServerTitle(poc);
    }
  }

  /**
   * 전체 POC에 대해 테스트 결과 메시지 전송
   */
  public static async batchSendSlackServerResult(testResult: boolean) {
    for (const poc of ALL_POCS) {
      await Slack.sendSlackServerResult(poc, testResult);
    }
  }

  /**
   * 전체 POC에 대해 로그 메시지 전송
   */
  public static async batchSendSlackText(message: string, isSuccess: boolean = true) {
    for (const poc of ALL_POCS) {
      await Slack.sendSlackText(poc, message, isSuccess);
    }
  }
}
