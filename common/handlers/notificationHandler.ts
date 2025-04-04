/**
 * Description : notificationHandler.ts - 📌 공통 NotificationHandler 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-04
 */
import { Logger } from '@common/logger/customLogger';
import type { POCKey, POCType } from '@common/types/platform-types';
import { ALL_POCS } from '@common/types/platform-types';
import type winston from 'winston';

export class NotificationHandler {
  /**
   * 플랫폼에 맞는 메시지 전송 메서드
   * - 내부에서는 POCKey로 변환하여 로깅에 사용
   */
  protected static async sendMessage(poc: POCType, message: string, isSuccess: boolean = true) {
    if (poc === 'ALL') return;

    const pocKey = poc as POCKey;
    const logger = Logger.getLogger(pocKey) as winston.Logger;

    const formattedMessage = isSuccess
      ? `[${pocKey}] ${message} 성공`
      : `[${pocKey}] ${message} 실패`;

    // 실제 메시지 전송 로직은 하위 클래스에서 구현 가능
    logger.info(`메시지 전송 완료: ${formattedMessage}`);
  }

  /**
   * 전체 POC에 대해 메시지 전송 (병렬 처리)
   */
  public static async batchSendMessage(message: string, isSuccess: boolean = true) {
    const sendMessages = ALL_POCS.map(async (pocKey: POCKey) => {
      await NotificationHandler.sendMessage(pocKey, message, isSuccess);
    });
    await Promise.all(sendMessages);
  }
}
