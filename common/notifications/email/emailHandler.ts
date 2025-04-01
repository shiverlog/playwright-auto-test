import { emailConfig } from '@common/config/BaseConfig';
import { ALL_POCS } from '@common/constants/PathConstants';
import type { POCType } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import { NotificationHandler } from '@common/notifications/notificationHandler';
import nodemailer from 'nodemailer';

/**
 * 이메일 전송을 처리하는 EmailHandler 클래스
 * NotificationHandler 클래스를 상속받아 기본 메시지 전송 로직을 확장합니다.
 */
export class EmailHandler extends NotificationHandler {
  private static transporter: nodemailer.Transporter;

  // 이메일 전송을 위한 트랜스포터 생성
  private static createTransporter() {
    if (!EmailHandler.transporter) {
      EmailHandler.transporter = nodemailer.createTransport({
        host: emailConfig.SMTP_HOST,
        port: emailConfig.SMTP_PORT,
        auth: {
          user: emailConfig.SMTP_USER,
          pass: emailConfig.SMTP_PASS,
        },
      });
    }
    return EmailHandler.transporter;
  }

  /**
   * 이메일 메시지 전송
   */
  public static async sendEmailMessage(poc: POCType, message: string, isSuccess: boolean = true) {
    const logger = Logger.getLogger(poc);

    if (!emailConfig.SMTP_USER || !emailConfig.SMTP_PASS) {
      logger.warn('이메일 사용자 또는 비밀번호가 설정되지 않았습니다.');
      return;
    }

    const transporter = EmailHandler.createTransporter();

    // 이메일 내용 포맷
    const formattedMessage = isSuccess ? `[${poc}] ${message} 성공` : `[${poc}] ${message} 실패`;

    const mailOptions = {
      from: emailConfig.EMAIL_FROM, // 보내는 이메일
      to: emailConfig.EMAIL_TO, // 받는 이메일
      subject: `[POC] ${poc} - 테스트 결과`,
      text: formattedMessage, // 이메일 내용
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info(`이메일 전송 완료: ${formattedMessage}`);
    } catch (error) {
      logger.error('이메일 전송 실패:', error);
    }
  }

  /**
   * 전체 POC에 대해 이메일 전송 (병렬 처리)
   */
  public static async batchSendEmailMessage(message: string, isSuccess: boolean = true) {
    const sendMessages = ALL_POCS.map(poc =>
      EmailHandler.sendEmailMessage(poc, message, isSuccess),
    );
    await Promise.all(sendMessages);
  }
}
