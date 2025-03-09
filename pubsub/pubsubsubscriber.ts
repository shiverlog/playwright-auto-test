import { PubSub, Message } from "@google-cloud/pubsub";
import * as path from "path";
import * as subprocess from "child_process";

// ✅ 프로젝트 및 구독 정보 설정
const PROJECT_ID = "gc-automation-test"; // GCP 프로젝트 ID
const SUBSCRIPTION_ID = "my-sub"; // Pub/Sub 구독 ID
const TIMEOUT = 0; // 0이면 무한 실행

// ✅ Google Cloud Pub/Sub 클라이언트 생성
const pubsub = new PubSub({ projectId: PROJECT_ID });
const subscription = pubsub.subscription(SUBSCRIPTION_ID);

/**
 * 📌 실행할 배치 파일 경로 매핑
 */
const batchFilePaths: Record<string, string> = {
  "windows-selenium-mw": "C:/dev/remotePC_batchfiles/selenium_mw_batchfiles/main.bat",
  "windows-selenium-pc": "C:/dev/remotePC_batchfiles/selenium_pc_batchfiles/main.bat",
  "windows-appium-aos": "C:/dev/remotePC_batchfiles/appium_aos_batchfiles/main.bat",
  "windows-selenium-stg-mw": "C:/dev/remotePC_batchfiles/selenium_stg_mw_batchfiles/main.bat",
  "windows-selenium-stg-pc": "C:/dev/remotePC_batchfiles/selenium_stg_pc_batchfiles/main.bat",
  "windows-appium-stg-aos": "C:/dev/remotePC_batchfiles/appium_stg_aos_batchfiles/main.bat",
  "slack-windows-selenium-mw": "C:/dev/remotePC_batchfiles/slack_selenium_mw_batchfiles/main.bat",
  "slack-windows-selenium-pc": "C:/dev/remotePC_batchfiles/slack_selenium_pc_batchfiles/main.bat",
  "slack-windows-appium-aos": "C:/dev/remotePC_batchfiles/slack_appium_aos_batchfiles/main.bat",
};

/**
 * 특정 배치 파일 실행
 */
function executeBatchFile(batchFilePath: string) {
  console.log(`실행 중: ${batchFilePath}`);
  const workingDirectory = path.dirname(batchFilePath);
  const result = subprocess.spawn(batchFilePath, { cwd: workingDirectory, shell: true });

  result.stdout?.on("data", (data) => console.log(`📄 ${data.toString()}`));
  result.stderr?.on("data", (error) => console.error(`❌ ${error.toString()}`));

  result.on("close", (code) => console.log(`✅ 프로세스 종료 (코드: ${code})`));
}

/**
 * 메시지를 수신하면 실행할 콜백 함수
 * @param message Pub/Sub 메시지 객체
 */
const messageHandler = (message: Message): void => {
  const msg = message.data.toString();
  const osType = message.attributes?.os || "unknown";

  console.log(`📩 메시지 수신: ${msg} (OS: ${osType})`);
  message.ack();

  // 특정 배치 파일 실행
  if (batchFilePaths[msg]) {
    executeBatchFile(batchFilePaths[msg]);
  } else {
    console.log(`실행할 배치 파일 없음: ${msg}`);
  }
};

// 메시지 수신 시작
console.log(`Listening for messages on '${SUBSCRIPTION_ID}'...\n`);
subscription.on("message", messageHandler);

/**
 * 오류 처리
 */
subscription.on("error", (error) => {
  console.error(`Subscription error: ${error}`);
});

/**
 * 특정 시간 후 구독 종료 (TIMEOUT이 0이면 계속 실행)
 */
if (TIMEOUT > 0) {
  setTimeout(() => {
    subscription.removeListener("message", messageHandler);
    console.log("Subscription closed.");
  }, TIMEOUT * 1000);
}
