/**
 * Description : EmailHandler.ts - 📌 NotificationHandler 클래스를 사용하여 기본 메시지 전송 로직을 확장
 * Author : Shiwoo Min
 * Date : 2025-04-10
 */
import { emailConfig } from '@common/config/notificationConfig';
import { Logger } from '@common/logger/customLogger';
import { NotificationHandler } from '@common/notifications/notificationHandler';
import { POCEnv } from '@common/utils/env/POCEnv';
import nodemailer from 'nodemailer';
import type winston from 'winston';

export class EmailHandler extends NotificationHandler {
  // nodemailer 트랜스포터 싱글턴 인스턴스
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
    const logger = Logger.getLogger(pocKey) as winston.Logger;

    if (pocKey === 'ALL') return;

    if (!emailConfig.SMTP_USER || !emailConfig.SMTP_PASS) {
      logger.warn('이메일 사용자 또는 비밀번호가 설정되지 않았습니다.');
      return;
    }

    const transporter = this.createTransporter();
    const formattedMessage = isSuccess
      ? `[${pocKey}] ${message} 성공`
      : `[${pocKey}] ${message} 실패`;

    const mailOptions = {
      from: emailConfig.EMAIL_FROM,
      to: emailConfig.EMAIL_TO,
      subject: `[POC] ${pocKey} - 테스트 결과`,
      text: formattedMessage,
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info(`이메일 전송 완료: ${formattedMessage}`);
    } catch (error) {
      logger.error(`이메일 전송 실패: ${(error as Error).message}`);
    }
  }

  /**
   * 전체 POC에 대해 이메일 전송 (병렬 처리)
   */
  public static async batchSendEmailMessage(
    message: string,
    isSuccess: boolean = true,
  ): Promise<void> {
    const pocList = POCEnv.getList();

    const sendTasks = pocList.map(async poc => {
      const logger = Logger.getLogger(poc) as winston.Logger;

      if (!emailConfig.SMTP_USER || !emailConfig.SMTP_PASS) {
        logger.warn(`[${poc}] 이메일 사용자 또는 비밀번호가 설정되지 않음`);
        return;
      }

      const transporter = this.createTransporter();
      const formattedMessage = isSuccess ? `[${poc}] ${message} 성공` : `[${poc}] ${message} 실패`;

      const mailOptions = {
        from: emailConfig.EMAIL_FROM,
        to: emailConfig.EMAIL_TO,
        subject: `[POC] ${poc} - 테스트 결과`,
        text: formattedMessage,
      };

      try {
        await transporter.sendMail(mailOptions);
        logger.info(`[${poc}] 이메일 전송 완료`);
      } catch (error) {
        logger.error(`[${poc}] 이메일 전송 실패: ${(error as Error).message}`);
      }
    });

    await Promise.all(sendTasks);
  }
}
