/**
 * Description : NotificationHandler.ts - 📌 POC 기반 테스트 메시지 전송 핸들러
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import type winston from 'winston';

export class NotificationHandler {
  // 현재 POC 키 ('ALL' 또는 각 POCKey)
  private static readonly pocType = POCEnv.getType();
  // 로깅 인스턴스
  private static readonly logger: winston.Logger = Logger.getLogger(
    NotificationHandler.pocType,
  ) as winston.Logger;

  /**
   * 단일 POC에 메시지 전송
   */
  protected static async sendMessage(poc: string, message: string, isSuccess: boolean = true) {
    const logger = Logger.getLogger(poc as 'ALL') as winston.Logger;
    const formattedMessage = isSuccess ? `[${poc}] ${message} 성공` : `[${poc}] ${message} 실패`;
    logger.info(`메시지 전송 완료: ${formattedMessage}`);
  }

  /**
   * 전체 POC에 대해 메시지 전송 (병렬 처리)
   */
  public static async batchSendMessage(message: string, isSuccess: boolean = true) {
    const pocList = POCEnv.getList();

    const sendMessages = pocList.map(async poc => {
      await NotificationHandler.sendMessage(poc, message, isSuccess);
    });
    await Promise.all(sendMessages);
  }
}
