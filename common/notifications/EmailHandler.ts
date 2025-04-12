/**
 * Description : EmailHandler.ts - 📌 NotificationHandler 클래스를 사용하여 기본 메시지 전송 로직을 확장
 * Author : Shiwoo Min
 * Date : 2025-04-10
 */
import { emailConfig } from '@common/config/notificationConfig';
import { NotificationHandler } from '@common/notifications/NotificationHandler';
import { POCEnv } from '@common/utils/env/POCEnv';
import nodemailer from 'nodemailer';

export class EmailHandler extends NotificationHandler {
  private static transporter: nodemailer.Transporter;

  /**
   * nodemailer 트랜스포터 싱글턴 생성
   */
  private static createTransporter(): nodemailer.Transporter {
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
   * 이메일 메시지 전송 (현재 POC 기준)
   */
  public static async sendEmailMessage(message: string, isSuccess: boolean = true): Promise<void> {
    const pocKey = POCEnv.getType();
    const formattedMessage = this.formatMessage(pocKey, message, isSuccess);

    if (!emailConfig.SMTP_USER || !emailConfig.SMTP_PASS) {
      this.logger.warn('이메일 사용자 또는 비밀번호가 설정되지 않았습니다.');
      return;
    }

    try {
      const transporter = this.createTransporter();
      await transporter.sendMail({
        from: emailConfig.EMAIL_FROM,
        to: emailConfig.EMAIL_TO,
        subject: `[POC] ${pocKey} - 테스트 결과`,
        text: formattedMessage,
      });
      this.logger.info(`이메일 전송 완료: ${formattedMessage}`);
    } catch (error) {
      this.logger.error(`이메일 전송 실패: ${(error as Error).message}`);
    }
  }

  /**
   * 전체 POC에 대해 이메일 전송 (병렬 처리)
   */
  public static async batchSendEmailMessage(
    message: string,
    isSuccess: boolean = true,
  ): Promise<void> {
    const pocList = POCEnv.getPOCKeyList();

    await Promise.all(
      pocList.map(async poc => {
        const formattedMessage = this.formatMessage(poc, message, isSuccess);

        if (!emailConfig.SMTP_USER || !emailConfig.SMTP_PASS) {
          this.logger.warn(`[${poc}] 이메일 사용자 또는 비밀번호가 설정되지 않았습니다.`);
          return;
        }

        try {
          const transporter = this.createTransporter();
          await transporter.sendMail({
            from: emailConfig.EMAIL_FROM,
            to: emailConfig.EMAIL_TO,
            subject: `[POC] ${poc} - 테스트 결과`,
            text: formattedMessage,
          });
          this.logger.info(`[${poc}] 이메일 전송 완료`);
        } catch (error) {
          this.logger.error(`[${poc}] 이메일 전송 실패: ${(error as Error).message}`);
        }
      }),
    );
  }
}
