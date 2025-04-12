/**
 * Description : NotificationHandler.ts - 📌 POC 기반 테스트 메시지 전송 핸들러
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import type winston from 'winston';

export class NotificationHandler {
  protected static readonly logger: winston.Logger = Logger.getLogger(
    POCEnv.getType().toUpperCase(),
  ) as winston.Logger;

  /**
   * 공통 메시지 포맷 처리
   */
  protected static formatMessage(poc: string, message: string, isSuccess: boolean): string {
    return isSuccess ? `[${poc}] ${message} 성공` : `[${poc}] ${message} 실패`;
  }

  /**
   * 단일 POC에 메시지 전송
   */
  protected static async sendMessage(poc: string, message: string, isSuccess: boolean = true) {
    const resultMessage = this.formatMessage(poc, message, isSuccess);
    this.logger.info(resultMessage);
  }

  /**
   * 전체 POC에 대해 메시지 전송 (병렬 처리)
   */
  public static async batchSendMessage(message: string, isSuccess: boolean = true) {
    const pocList = POCEnv.getPOCKeyList();

    await Promise.all(
      pocList.map(async poc => {
        await NotificationHandler.sendMessage(poc, message, isSuccess);
      }),
    );
  }
}
