import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { logger } from "../logger/customLogger";

dotenv.config();

// 환경 변수에서 이메일 설정 가져오기
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const EMAIL_FROM = process.env.EMAIL_FROM || SMTP_USER;
const EMAIL_TO = process.env.EMAIL_TO || ""; // 기본 수신자 설정

// Nodemailer Transporter 설정
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // 465 사용 시 SSL 적용
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

/**
 * 이메일을 전송하는 함수
 * @param subject - 이메일 제목
 * @param text - 이메일 본문 (텍스트)
 * @param html - 이메일 본문 (HTML, 선택 사항)
 * @param to - 수신자 이메일 (기본값: EMAIL_TO)
 */
export const sendEmail = async (
  subject: string,
  text: string,
  html?: string,
  to: string = EMAIL_TO
) => {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !to) {
    logger.warn("이메일 환경 변수가 설정되지 않았습니다.");
    return;
  }

  try {
    const mailOptions = {
      from: EMAIL_FROM,
      to,
      subject,
      text,
      html: html || text, // HTML이 없으면 텍스트 본문 사용
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`이메일 전송 완료: ${info.messageId} (To: ${to})`);
  } catch (error) {
    logger.error("이메일 전송 실패:", error);
  }
};
