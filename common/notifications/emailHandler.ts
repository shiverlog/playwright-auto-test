/**
 * Description : emailHandler.ts - 📌 E-mail 전송 핸들러
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import { emailConfig } from '@common/config/onfig';
import { ALL_POCS, POCType } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import nodemailer from 'nodemailer';

/**
 * Nodemailer Transporter 설정
 */
const transporter = nodemailer.createTransport({
  host: emailConfig.SMTP_HOST,
  port: emailConfig.SMTP_PORT,
  secure: emailConfig.SMTP_PORT === 465, // 465 포트 사용 시 SSL 적용
  auth: {
    user: emailConfig.SMTP_USER,
    pass: emailConfig.SMTP_PASS,
  },
});

/**
 * 특정 POC 또는 전체 POC에 대해 이메일을 전송하는 함수
 * @param poc - POC 타입 (''일 경우 전체 POC 대상)
 * @param subject - 이메일 제목
 * @param text - 이메일 본문 (텍스트)
 * @param html - 이메일 본문 (HTML, 선택 사항)
 * @param to - 수신자 이메일 (기본값: emailConfig.EMAIL_TO)
 */
export const sendEmailForPOC = async (
  poc: POCType,
  subject: string,
  text: string,
  html?: string,
  to: string = emailConfig.EMAIL_TO,
): Promise<void> => {
  const pocList = poc === '' ? ALL_POCS : [poc];

  for (const singlePOC of pocList) {
    const logger = Logger.getLogger(singlePOC);

    // 이메일 설정 필수 값 확인
    if (!emailConfig.SMTP_HOST || !emailConfig.SMTP_USER || !emailConfig.SMTP_PASS || !to) {
      logger.warn('이메일 환경 변수가 설정되지 않았습니다.');
      continue;
    }

    try {
      const mailOptions = {
        from: emailConfig.EMAIL_FROM,
        to,
        subject,
        text,
        html: html || text,
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info(`이메일 전송 완료: ${info.messageId} (To: ${to})`);
    } catch (error) {
      logger.error(`이메일 전송 실패 (POC: ${singlePOC}): ${error}`);
    }
  }
};
