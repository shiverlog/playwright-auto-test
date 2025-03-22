import { teamsConfig } from '@common/config/config';
import { ALL_POCS, POCType } from '@common/constants/PathConstants';
import { teamsForm } from '@common/formatters/teamsForm';
import { Logger } from '@common/logger/customLogger';
import axios from 'axios';

export class Teams {
  /**
   * Microsoft Teams 메시지 전송
   */
  public static async sendTeamsMessage(poc: POCType, message: string, isSuccess: boolean = true) {
    const logger = Logger.getLogger(poc);

    if (!teamsConfig.TEAMS_WEBHOOK_URL) {
      logger.warn('⚠ Microsoft Teams Webhook URL이 설정되지 않았습니다.');
      return;
    }

    try {
      const formattedMessage = isSuccess ? `*성공:* ${message}` : `*실패:* ${message}`;

      const payload = {
        '@type': 'MessageCard',
        '@context': 'http://schema.org/extensions',
        themeColor: isSuccess ? '0078D7' : 'FF0000',
        summary: 'Playwright 테스트 결과',
        sections: [
          {
            activityTitle: `[${poc}] Playwright 테스트 결과`,
            activitySubtitle: new Date().toISOString(),
            text: formattedMessage,
          },
        ],
      };

      await axios.post(teamsConfig.TEAMS_WEBHOOK_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      logger.info(`Teams 메시지 전송 완료: ${message}`);
    } catch (error) {
      logger.error('Teams 메시지 전송 실패:', error);
    }
  }

  /**
   * 실행 로그 메시지 전송
   */
  public static async sendTeamsServerTitle(poc: POCType) {
    const logger = Logger.getLogger(poc);

    if (!teamsConfig.TEAMS_WEBHOOK_URL) {
      logger.warn('⚠ Microsoft Teams Webhook URL이 설정되지 않았습니다.');
      return;
    }

    try {
      const now = new Date().toISOString();
      const payload = teamsForm(poc, now);

      await axios.post(teamsConfig.TEAMS_WEBHOOK_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      logger.info('Teams 실행 로그 메시지 전송 완료');
    } catch (error) {
      logger.error('Teams 실행 로그 메시지 전송 실패:', error);
    }
  }

  /**
   * 테스트 결과 전송 (PASS / FAIL)
   */
  public static async sendTeamsServerResult(poc: POCType, testResult: boolean) {
    const logger = Logger.getLogger(poc);

    if (!teamsConfig.TEAMS_WEBHOOK_URL) {
      logger.warn('⚠ Microsoft Teams Webhook URL이 설정되지 않았습니다.');
      return;
    }

    try {
      const now = new Date().toISOString();
      const payload = teamsForm(poc, now, testResult);

      await axios.post(teamsConfig.TEAMS_WEBHOOK_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      logger.info(`Teams 테스트 결과 (${testResult ? 'PASS' : 'FAIL'}) 전송 완료`);
    } catch (error) {
      logger.error(`Teams 테스트 결과 전송 실패:`, error);
    }
  }

  /**
   * 전체 POC에 대해 시작 메시지 전송
   */
  public static async batchSendTeamsServerTitle() {
    for (const poc of ALL_POCS) {
      await Teams.sendTeamsServerTitle(poc);
    }
  }

  /**
   * 전체 POC에 대해 결과 메시지 전송
   */
  public static async batchSendTeamsServerResult(testResult: boolean) {
    for (const poc of ALL_POCS) {
      await Teams.sendTeamsServerResult(poc, testResult);
    }
  }

  /**
   * 전체 POC에 대해 공통 메시지 전송
   */
  public static async batchSendTeamsMessage(message: string, isSuccess: boolean = true) {
    for (const poc of ALL_POCS) {
      await Teams.sendTeamsMessage(poc, message, isSuccess);
    }
  }
}
