import { Message, PubSub } from '@google-cloud/pubsub';
import { exec } from 'child_process';
import * as os from 'os';
import * as path from 'path';

// Google Cloud Pub/Sub 설정
const PROJECT_ID = 'gc-automation-test'; // GCP 프로젝트 ID
const SUBSCRIPTION_ID = 'qa-test-os-windows'; // Pub/Sub 구독 ID
const pubsub = new PubSub({ projectId: PROJECT_ID });
const subscription = pubsub.subscription(SUBSCRIPTION_ID);

/**
 * 실행할 테스트 파일 경로 (Playwright & Appium 테스트 실행)
 */
const testScripts: Record<string, { path: string; isPlaywright: boolean }> = {
  'web-test': { path: path.resolve(__dirname, '../tests/test_web.ts'), isPlaywright: true },
  'webview-test': { path: path.resolve(__dirname, '../tests/test_webview.ts'), isPlaywright: true },
  'android-app-test': {
    path: path.resolve(__dirname, '../tests/test_app_android.ts'),
    isPlaywright: false,
  },
  'ios-app-test': {
    path: path.resolve(__dirname, '../tests/test_app_ios.ts'),
    isPlaywright: false,
  },
};

/**
 * 실행할 배치 파일 경로 매핑
 */
const batchFilePaths: Record<string, string> = {
  'windows-selenium-mw': 'C:/dev/remotePC_batchfiles/selenium_mw_batchfiles/main.bat',
  'windows-selenium-pc': 'C:/dev/remotePC_batchfiles/selenium_pc_batchfiles/main.bat',
  'windows-appium-aos': 'C:/dev/remotePC_batchfiles/appium_aos_batchfiles/main.bat',
  'windows-selenium-stg-mw': 'C:/dev/remotePC_batchfiles/selenium_stg_mw_batchfiles/main.bat',
  'windows-selenium-stg-pc': 'C:/dev/remotePC_batchfiles/selenium_stg_pc_batchfiles/main.bat',
  'windows-appium-stg-aos': 'C:/dev/remotePC_batchfiles/appium_stg_aos_batchfiles/main.bat',
};

/**
 * 특정 테스트 실행 함수
 */
function runTestScript(scriptPath: string, isPlaywright: boolean) {
  const command = isPlaywright ? `npx playwright test ${scriptPath}` : `node ${scriptPath}`;
  console.log(`🚀 실행 중: ${command}`);

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
 * 특정 배치 파일 실행
 */
function executeBatchFile(batchFilePath: string) {
  console.log(`실행 중: ${batchFilePath}`);
  const result = exec(batchFilePath);

  result.stdout?.on('data', data => console.log(`📄 ${data.toString()}`));
  result.stderr?.on('data', error => console.error(`❌ ${error.toString()}`));

  result.on('close', code => console.log(`✅ 프로세스 종료 (코드: ${code})`));
}

/**
 * 특정 포트를 확인하여 실행 중인지 체크하고 종료
 */
function checkAndKillPort(startPort: number) {
  const endPort = startPort + 10;
  console.log(`🔍 ${startPort}~${endPort} 포트 검사 중...`);

  for (let port = startPort; port <= endPort; port++) {
    exec(`netstat -ano | findstr ${port}`, (error, stdout) => {
      if (stdout.includes(port.toString())) {
        console.log(`🚨 실행 중인 포트 발견: ${port}, 종료 중...`);
        exec(
          `for /f "tokens=5" %t in ('netstat -ano ^| findstr ${port}') do (taskkill /f /pid %t)`,
        );
      }
    });
  }
}

/**
 * Pub/Sub 메시지 처리 함수
 */
const messageHandler = (message: Message): void => {
  const msg = message.data.toString().trim();
  const osType = message.attributes?.os || 'unknown';

  console.log(`📩 수신된 메시지: ${msg} (OS: ${osType})`);
  message.ack();

  if (batchFilePaths[msg]) {
    executeBatchFile(batchFilePaths[msg]);
  } else if (testScripts[msg]) {
    const { path, isPlaywright } = testScripts[msg];
    runTestScript(path, isPlaywright);
  } else if (msg.includes('kill-port')) {
    const port = parseInt(msg.split('-').pop() || '4723');
    checkAndKillPort(port);
  } else {
    console.log(`⚠️ 실행할 작업 없음: ${msg}`);
  }
};

// Pub/Sub 구독 시작
console.log(`🚀 Pub/Sub Listening on '${SUBSCRIPTION_ID}'...\n`);
subscription.on('message', messageHandler);
subscription.on('error', error => console.error(`❌ Subscription error: ${error}`));
