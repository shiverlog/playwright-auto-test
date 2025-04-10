import { Logger } from '@common/logger/customLogger';
import type { POCKey } from '@common/types/platform-types';
import { POCEnv } from '@common/utils/env/POCEnv';
// POCKey 타입 import
import type winston from 'winston';

export class NotificationHandler {
  // 현재 POC 키
  private static readonly poc: POCKey = POCEnv.getType() as POCKey;

  // 로깅 인스턴스
  private static readonly logger: winston.Logger = Logger.getLogger(
    NotificationHandler.poc,
  ) as winston.Logger;

  /**
   * 플랫폼에 맞는 메시지 전송 메서드
   */
  protected static async sendMessage(poc: POCKey, message: string, isSuccess: boolean = true) {
    const logger = Logger.getLogger(poc) as winston.Logger;

    const formattedMessage = isSuccess ? `[${poc}] ${message} 성공` : `[${poc}] ${message} 실패`;

    logger.info(`메시지 전송 완료: ${formattedMessage}`);
  }

  /**
   * 전체 POC에 대해 메시지 전송 (병렬 처리)
   */
  public static async batchSendMessage(message: string, isSuccess: boolean = true) {
    const pocList = POCEnv.getList() as POCKey[];

    const sendMessages = pocList.map(async poc => {
      await NotificationHandler.sendMessage(poc, message, isSuccess);
    });
    await Promise.all(sendMessages);
  }
}
