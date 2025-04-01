import { ALL_POCS } from '@common/constants/PathConstants';
import type { POCType } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';

/**
 * 공통 NotificationHandler 클래스
 */
export class NotificationHandler {
  /**
   * 플랫폼에 맞는 메시지 전송 메서드
   * @param poc - POC 타입
   * @param message - 전송할 메시지 내용
   * @param isSuccess - 성공 여부
   */
  protected static async sendMessage(poc: POCType, message: string, isSuccess: boolean = true) {
    const logger = Logger.getLogger(poc);
    const formattedMessage = isSuccess ? `[${poc}] ${message} 성공` : `[${poc}] ${message} 실패`;

    // 기본적으로 플랫폼별 전송 로직을 구체화해야 합니다 (각 하위 클래스에서 구현)
    logger.info(`메시지 전송 완료: ${formattedMessage}`);
  }

  /**
   * 전체 POC에 대해 메시지 전송 (병렬 처리)
   * @param message - 전송할 메시지
   * @param isSuccess - 성공 여부
   */
  public static async batchSendMessage(message: string, isSuccess: boolean = true) {
    const sendMessages = ALL_POCS.map(poc =>
      NotificationHandler.sendMessage(poc, message, isSuccess),
    );
    await Promise.all(sendMessages);
  }
}
