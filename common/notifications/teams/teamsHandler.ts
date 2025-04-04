/**
 * Description :  teamsHandler.ts - 📌 Microsoft Teams 메시지 전송을 처리하는 TeamsHandler 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-04
 */
import { teamsConfig } from '@common/config/BaseConfig';
import { NotificationHandler } from '@common/handlers/notificationHandler';
import { Logger } from '@common/logger/customLogger';
import type { POCKey, POCType } from '@common/types/platform-types';
import { ALL_POCS } from '@common/types/platform-types';
import axios from 'axios';
import type winston from 'winston';

/**
 * Microsoft Teams 메시지 전송을 처리하는 TeamsHandler 클래스
 */
export class TeamsHandler extends NotificationHandler {
  /**
   * Microsoft Teams 메시지 전송 (단일 POC)
   */
  public static async sendTeamsMessage(
    poc: POCType,
    message: string,
    isSuccess: boolean = true,
  ): Promise<void> {
    // ALL 또는 빈 값은 무시
    if (poc === 'ALL') return;

    const pocKey = poc as POCKey;
    const logger = Logger.getLogger(pocKey) as winston.Logger;

    if (!teamsConfig.TEAMS_WEBHOOK_URL) {
      logger.warn('Microsoft Teams Webhook URL이 설정되지 않았습니다.');
      return;
    }

    const formattedMessage = isSuccess
      ? `[${pocKey}] ${message} 성공`
      : `[${pocKey}] ${message} 실패`;

    const payload = {
      '@type': 'MessageCard',
      '@context': 'http://schema.org/extensions',
      themeColor: isSuccess ? '0078D7' : 'FF0000',
      summary: 'Playwright 테스트 결과',
      sections: [
        {
          activityTitle: `[${pocKey}] Playwright 테스트 결과`,
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
      logger.error(`Teams 메시지 전송 실패: ${(error as Error).message}`);
    }
  }

  /**
   * 전체 POC에 대해 Teams 메시지 전송 (병렬 처리)
   */
  public static async batchSendTeamsMessage(
    message: string,
    isSuccess: boolean = true,
  ): Promise<void> {
    const sendMessages = ALL_POCS.map((pocKey: POCKey) =>
      TeamsHandler.sendTeamsMessage(pocKey, message, isSuccess),
    );
    await Promise.all(sendMessages);
  }
}
