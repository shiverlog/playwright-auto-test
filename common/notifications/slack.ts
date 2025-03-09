import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import pRetry from "p-retry";
import { slackForm } from "../formatters/slackForm";

dotenv.config();

// Slack 설정
const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN || "";
const SLACK_CHANNEL = process.env.SLACK_CHANNEL_ID || "";
const SLACK_MENTION_ID = process.env.SLACK_MENTION_ID || ""; // Mentions (@user)
const SLACK_MENTION_CHANNEL = process.env.SLACK_MENTION_CHANNEL || "";

// Slack WebClient 생성
const slackClient = new WebClient(SLACK_TOKEN);

// Slack 클래스 정의
export class Slack {
  private static channel: string = SLACK_CHANNEL;
  private static serverThreadTs: string | null = null;
  private static filePath: string | null = null;
  private static poc: string = "PC";

  // Slack 메시지 포맷
  private static textFormat = {
    pass: `[${Slack.poc} - PASS]`,
    fail: `[${Slack.poc} - FAIL]`,
    log: `[${Slack.poc} - LOG]`,
  };

  /**
   * 서버 Thread TS 설정
   */
  public static setServerThreadTS(serverThreadTs: string) {
    if (!serverThreadTs) throw new Error("serverThreadTs is null");
    Slack.serverThreadTs = serverThreadTs;
  }

  /**
   * 서버 Thread TS 가져오기
   */
  public static getServerThreadTS(): string {
    if (!Slack.serverThreadTs) throw new Error("serverThreadTs is null");
    return Slack.serverThreadTs;
  }

  /**
   * 파일 경로 설정
   */
  public static setFilePath(filePath: string) {
    if (!filePath) throw new Error("filePath is null");
    Slack.filePath = filePath;
  }

  /**
   * 파일 경로 가져오기
   */
  public static getFilePath(): string {
    if (!Slack.filePath) throw new Error("filePath is null");
    return Slack.filePath;
  }

  /**
   * Slack 메시지 전송
   */
  public static async sendSlackMessage(message: string, isSuccess: boolean = true) {
    try {
      const formattedMessage = isSuccess
        ? `✅ ${message} 성공`
        : `❌ ${message} 실패`;

      await slackClient.chat.postMessage({
        channel: Slack.channel,
        text: formattedMessage,
      });
    } catch (error) {
      console.error("❌ Slack 메시지 전송 실패:", error);
    }
  }

  /**
   * Slack 실행 로그 메시지 전송
   */
  public static async sendSlackServerTitle() {
    const now = new Date();
    const formattedBlocks = Slack.formatBlocks(slackForm(Slack.poc).serverTitle, now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes());

    try {
      const response = await slackClient.chat.postMessage({
        channel: Slack.channel,
        blocks: formattedBlocks,
        text: "테스트 시작",
      });

      Slack.setServerThreadTS(response.ts || "");
    } catch (error) {
      console.error("❌ Slack 실행 로그 메시지 전송 실패:", error);
    }
  }

  /**
   * Slack 테스트 결과 전송
   */
  public static async sendSlackServerResult(testResult: boolean) {
    const result = testResult ? "PASS" : "FAIL";
    const formattedBlocks = Slack.formatBlocks(slackForm(Slack.poc).serverResult, result);

    try {
      await slackClient.chat.postMessage({
        channel: Slack.channel,
        blocks: formattedBlocks,
        text: "테스트 결과",
      });

      if (Slack.channel === SLACK_MENTION_CHANNEL && result === "FAIL") {
        Slack.sendSlackMention();
      }
    } catch (error) {
      console.error("❌ Slack 테스트 결과 전송 실패:", error);
    }
  }

  /**
   * Slack 메시지 전송 (로그)
   */
  public static async sendSlackText(log: string, testResult: boolean = true) {
    const result = testResult ? Slack.textFormat.pass : Slack.textFormat.fail;

    try {
      await slackClient.chat.postMessage({
        channel: Slack.channel,
        thread_ts: Slack.getServerThreadTS(),
        text: `${result} - ${log}`,
      });
    } catch (error) {
      console.error("❌ Slack 로그 메시지 전송 실패:", error);
    }
  }

  /**
   * Slack 스크린샷 업로드
   */
  public static async sendSlackImage(imgComment: string = "이슈") {
    if (!Slack.getFilePath()) throw new Error("❌ 파일 경로가 올바르지 않습니다.");

    try {
      await slackClient.files.upload({
        channels: Slack.channel,
        thread_ts: Slack.getServerThreadTS(),
        file: fs.createReadStream(Slack.getFilePath()),
        title: "이슈 이미지",
        initial_comment: imgComment,
      });
    } catch (error) {
      console.error("❌ Slack 스크린샷 업로드 실패:", error);
    }
  }

  /**
   * Slack 멘션 전송 (테스트 실패 시)
   */
  public static async sendSlackMention() {
    try {
      await slackClient.chat.postMessage({
        channel: Slack.channel,
        thread_ts: Slack.getServerThreadTS(),
        text: SLACK_MENTION_ID,
      });
    } catch (error) {
      console.error("❌ Slack 멘션 전송 실패:", error);
    }
  }

  /**
   * Slack 로그 파일 업로드
   */
  public static async sendSlackLogFile() {
    const logFilePath = path.join("result/debug/", `${new Date().toISOString().slice(0, 10)}_info.log`);

    try {
      await slackClient.files.upload({
        channels: Slack.channel,
        file: fs.createReadStream(logFilePath),
        title: `${Slack.poc}_log_file`,
      });
    } catch (error) {
      console.error("❌ Slack 로그 파일 업로드 실패:", error);
    }
  }

  /**
   * 블록 템플릿에 데이터 적용하는 함수
   */
  private static formatBlocks(template: any, ...args: any[]): any {
    return JSON.parse(JSON.stringify(template).replace(/{}/g, () => args.shift()));
  }
}
