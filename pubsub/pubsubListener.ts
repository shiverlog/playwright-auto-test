import { PubSub, Message } from "@google-cloud/pubsub";
import { exec } from "child_process";
import * as path from "path";

// Google Cloud Pub/Sub 설정
const PROJECT_ID = "gc-automation-test"; // GCP 프로젝트 ID
const SUBSCRIPTION_ID = "qa-test"; // Pub/Sub 구독 ID
const pubsub = new PubSub({ projectId: PROJECT_ID });
const subscription = pubsub.subscription(SUBSCRIPTION_ID);

// 실행할 스크립트 파일 경로 (Playwright & Appium 테스트 실행)
const scriptPaths: Record<string, string> = {
  "web-test": path.resolve(__dirname, "../tests/test_web.ts"),
  "webview-test": path.resolve(__dirname, "../tests/test_webview.ts"),
  "android-app-test": path.resolve(__dirname, "../tests/test_app_aos.ts"),
  "ios-app-test": path.resolve(__dirname, "../tests/test_app_ios.ts"),
};

/**
 * 특정 스크립트 실행 함수
 */
function runTestScript(scriptPath: string, isPlaywright: boolean) {
  const command = isPlaywright ? `npx playwright test ${scriptPath}` : `node ${scriptPath}`;
  console.log(`실행 중: ${command}`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ 오류 발생: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`⚠️ 경고: ${stderr}`);
    }
    console.log(`✅ 실행 완료:\n${stdout}`);
  });
}

/**
 * Pub/Sub 메시지 처리 함수
 */
const messageHandler = (message: Message): void => {
  const msg = message.data.toString().trim();
  console.log(`📩 수신된 메시지: ${msg}`);

  // 메시지에 따라 Playwright 또는 Appium 테스트 실행
  if (scriptPaths[msg]) {
    const isPlaywright = msg.includes("web"); // 웹/WebView 테스트는 Playwright 사용
    runTestScript(scriptPaths[msg], isPlaywright);
    message.ack();
  } else {
    console.log(`⚠️ 실행할 테스트 없음: ${msg}`);
    message.nack();
  }
};

// Pub/Sub 구독 시작
console.log(`🚀 Pub/Sub Listening on '${SUBSCRIPTION_ID}'...\n`);
subscription.on("message", messageHandler);
subscription.on("error", (error) => console.error(`❌ Subscription error: ${error}`));
