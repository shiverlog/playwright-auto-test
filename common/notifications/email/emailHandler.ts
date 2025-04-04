/**
 * Description : EmailHandler.ts - 📌 NotificationHandler 클래스를 상속받아 기본 메시지 전송 로직을 확장
 * Author : Shiwoo Min
 * Date : 2025-04-04
 */
import { emailConfig } from '@common/config/BaseConfig';
import { NotificationHandler } from '@common/handlers/notificationHandler';
import { Logger } from '@common/logger/customLogger';
import type { POCKey, POCType } from '@common/types/platform-types';
import { ALL_POCS } from '@common/types/platform-types';
import nodemailer from 'nodemailer';
import type winston from 'winston';

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
   * 이메일 메시지 전송
   */
  public static async sendEmailMessage(
    poc: POCType,
    message: string,
    isSuccess: boolean = true,
  ): Promise<void> {
    // 전체 전송은 별도 함수에서 처리
    if (poc === 'ALL') return;

    const pocKey = poc as POCKey;
    const logger = Logger.getLogger(pocKey) as winston.Logger;

    if (!emailConfig.SMTP_USER || !emailConfig.SMTP_PASS) {
      logger.warn('이메일 사용자 또는 비밀번호가 설정되지 않았습니다.');
      return;
    }

    const transporter = EmailHandler.createTransporter();
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
    const sendTasks = ALL_POCS.map(async (poc: POCKey) => {
      await EmailHandler.sendEmailMessage(poc, message, isSuccess);
    });
    await Promise.all(sendTasks);
  }
}
