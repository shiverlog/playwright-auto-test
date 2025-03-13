import { teamsForm } from '@common/formatters/teamsForm';
import { logger } from '@common/logger/customLogger';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Teams Webhook URL (환경 변수에서 가져옴)
const TEAMS_WEBHOOK_URL = process.env.TEAMS_WEBHOOK_URL || '';

// Teams 클래스 정의
export class Teams {
  private static webhookUrl: string = TEAMS_WEBHOOK_URL;
  private static poc: string = 'PC';

  /**
   * Microsoft Teams 메시지 전송
   */
  public static async sendTeamsMessage(message: string, isSuccess: boolean = true) {
    if (!Teams.webhookUrl) {
      console.warn('⚠ Microsoft Teams Webhook URL이 설정되지 않았습니다.');
      return;
    }

    try {
      const formattedMessage = isSuccess ? `✅ *성공:* ${message}` : `❌ *실패:* ${message}`;

      const payload = {
        '@type': 'MessageCard',
        '@context': 'http://schema.org/extensions',
        themeColor: isSuccess ? '0078D7' : 'FF0000',
        summary: '자동화 테스트 알림',
        sections: [
          {
            activityTitle: 'Playwright 테스트 결과',
            activitySubtitle: new Date().toISOString(),
            text: formattedMessage,
          },
        ],
      };

      await axios.post(Teams.webhookUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      logger.info(`Teams 메시지 전송 완료: ${message}`);
    } catch (error) {
      logger.error('Teams 메시지 전송 실패:', error);
    }
  }

  /**
   * Microsoft Teams 실행 로그 메시지 전송
   */
  public static async sendTeamsServerTitle() {
    const now = new Date();
    const formattedMessage = teamsForm(Teams.poc, now.toISOString());

    try {
      await axios.post(Teams.webhookUrl, formattedMessage, {
        headers: { 'Content-Type': 'application/json' },
      });

      logger.info('Teams 실행 로그 메시지 전송 완료');
    } catch (error) {
      logger.error('Teams 실행 로그 메시지 전송 실패:', error);
    }
  }

  /**
   * Microsoft Teams 테스트 결과 전송
   */
  public static async sendTeamsServerResult(testResult: boolean) {
    const now = new Date();
    const resultText = testResult ? 'PASS' : 'FAIL';
    const formattedMessage = teamsForm(Teams.poc, now.toISOString());

    try {
      await axios.post(Teams.webhookUrl, formattedMessage, {
        headers: { 'Content-Type': 'application/json' },
      });

      logger.info(`Teams 테스트 결과 (${resultText}) 전송 완료`);
    } catch (error) {
      logger.error(`Teams 테스트 결과 (${resultText}) 전송 실패:`, error);
    }
  }
}
