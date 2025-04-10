/**
 * Description : teams.ts - 📌 Microsoft Teams 메시지 전송을 처리하는 TeamsHandler 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-10
 */
import { teamsConfig } from '@common/config/notificationConfig';
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import axios from 'axios';
import type winston from 'winston';

export class Teams {
  // 현재 POC 키
  private static readonly poc = POCEnv.getType();
  // 전체 POC 목록
  private static readonly pocList = POCEnv.getList();
  // 로깅 인스턴스
  private static readonly logger: winston.Logger = Logger.getLogger(this.poc) as winston.Logger;

  /**
   * Microsoft Teams 메시지 전송 (단일 POC)
   */
  public static async sendTeamsMessage(message: string, isSuccess: boolean = true): Promise<void> {
    const poc = this.poc;
    const logger = this.logger;

    if (poc === 'ALL') return;

    if (!teamsConfig.TEAMS_WEBHOOK_URL) {
      logger.warn('Microsoft Teams Webhook URL이 설정되지 않았습니다.');
      return;
    }

    const formattedMessage = isSuccess ? `성공: ${message}` : `실패: ${message}`;

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
    const tasks = this.pocList.map(async poc => {
      const logger = Logger.getLogger(poc) as winston.Logger;

      if (!teamsConfig.TEAMS_WEBHOOK_URL) {
        logger.warn('Microsoft Teams Webhook URL이 설정되지 않았습니다.');
        return;
      }

      const formattedMessage = isSuccess ? `성공: ${message}` : `실패: ${message}`;

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
        logger.error(`Teams 메시지 전송 실패: ${(error as Error).message}`);
      }
    });

    await Promise.all(tasks);
  }
}
