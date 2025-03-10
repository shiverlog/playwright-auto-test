import { WebClient } from "@slack/web-api";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import pRetry from "p-retry";
import { logger } from "../logger/customLogger";

dotenv.config();

// Slack 설정
const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN || "";
const SLACK_CHANNEL = process.env.SLACK_CHANNEL_ID || "";

// WebClient 인스턴스 생성
const slackClient = new WebClient(SLACK_TOKEN);

/**
 * Slack에 메시지를 전송하는 함수
 * @param message - 전송할 메시지
 * @param isSuccess - 성공 여부 (true: 성공, false: 실패)
 */
export const sendSlackMessage = async (
  message: string,
  isSuccess: boolean = true
) => {
  if (!SLACK_TOKEN || !SLACK_CHANNEL) {
    logger.warn("Slack 토큰 또는 채널 ID가 설정되지 않았습니다.");
    return;
  }

  try {
    const formattedMessage = isSuccess
      ? `✅ ${message} 성공`
      : `❌ ${message} 실패`;
    await slackClient.chat.postMessage({
      channel: SLACK_CHANNEL,
      text: formattedMessage,
    });
  } catch (error) {
    logger.error("Slack 메시지 전송 실패:", error);
  }
};

/**
 * Slack 메시지를 재시도하여 전송하는 함수
 */
export const sendSlackMessageWithRetry = async (
  message: string,
  isSuccess: boolean = true
) => {
  await pRetry(() => sendSlackMessage(message, isSuccess), {
    retries: 3,
    factor: 2,
    minTimeout: 1000,
  });
};

/**
 * Slack에 에러 메시지를 전송하는 함수 (Stack Trace 포함)
 * @param message - 전송할 메시지
 * @param error - 에러 객체
 */
export const sendSlackErrorMessage = async (message: string, error: Error) => {
  if (!SLACK_TOKEN || !SLACK_CHANNEL) {
    logger.warn("Slack 토큰 또는 채널 ID가 설정되지 않았습니다.");
    return;
  }

  try {
    const stackTrace = error.stack ? `\n\`\`\`${error.stack}\`\`\`` : "";

    await slackClient.chat.postMessage({
      channel: SLACK_CHANNEL,
      text: `*에러 발생:* ${message}${stackTrace}`,
    });

    logger.info("Slack 에러 메시지 전송 완료");
  } catch (error) {
    logger.error("Slack 에러 메시지 전송 실패:", error);
  }
};

/**
 * Slack에 파일을 업로드하는 함수
 * @param filePath - 업로드할 파일 경로
 * @param title - 파일 제목
 */
export const uploadSlackFile = async (
  filePath: string,
  title: string = "첨부 파일"
) => {
  if (!SLACK_TOKEN || !SLACK_CHANNEL) {
    logger.warn("Slack 토큰 또는 채널 ID가 설정되지 않았습니다.");
    return;
  }

  if (!fs.existsSync(filePath)) {
    logger.warn(`파일이 존재하지 않습니다: ${filePath}`);
    return;
  }

  try {
    await slackClient.files.upload({
      channels: SLACK_CHANNEL,
      file: fs.createReadStream(filePath),
      title: title || path.basename(filePath),
    });
    logger.info(`Slack 파일 업로드 완료: ${filePath}`);
  } catch (error) {
    logger.error("Slack 파일 업로드 실패:", error);
  }
};
