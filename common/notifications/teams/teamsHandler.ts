import { teamsConfig } from '@common/config/BaseConfig';
import { ALL_POCS, POCType } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import { NotificationHandler } from '@common/notifications/notificationHandler';
import axios from 'axios';

/**
 * Microsoft Teams 메시지 전송을 처리하는 TeamsHandler 클래스
 */
export class TeamsHandler extends NotificationHandler {
  /**
   * Microsoft Teams 메시지 전송
   */
  public static async sendTeamsMessage(poc: POCType, message: string, isSuccess: boolean = true) {
    const logger = Logger.getLogger(poc);

    if (!teamsConfig.TEAMS_WEBHOOK_URL) {
      logger.warn('Microsoft Teams Webhook URL이 설정되지 않았습니다.');
      return;
    }

    const formattedMessage = isSuccess ? `[${poc}] ${message} 성공` : `[${poc}] ${message} 실패`;

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

    try {
      await axios.post(teamsConfig.TEAMS_WEBHOOK_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      logger.info(`Teams 메시지 전송 완료: ${formattedMessage}`);
    } catch (error) {
      logger.error('Teams 메시지 전송 실패:', error);
    }
  }

  /**
   * 전체 POC에 대해 Teams 메시지 전송 (병렬 처리)
   */
  public static async batchSendTeamsMessage(message: string, isSuccess: boolean = true) {
    const sendMessages = ALL_POCS.map(poc =>
      TeamsHandler.sendTeamsMessage(poc, message, isSuccess),
    );
    await Promise.all(sendMessages);
  }
}
