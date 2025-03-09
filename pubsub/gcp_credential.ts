import * as fs from "fs";
import * as path from "path";
import { JWT } from "google-auth-library";

// 기본 서비스 계정 키 파일 경로 (환경 변수 사용 가능)
const DEFAULT_KEY_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  "C:/dev/remotePC_batchfiles/pubsub/google_pubsub_test/service-account-pubsub-key.json";

/**
 * Google Cloud Pub/Sub 서비스 계정 인증 함수
 * @param keyPath 서비스 계정 JSON 키 파일 경로 (기본값: 환경 변수 또는 DEFAULT_KEY_PATH)
 * @returns JWT 인증 객체 (JWT | null)
 */
export async function auth(keyPath: string = DEFAULT_KEY_PATH): Promise<JWT | null> {
  try {
    // JSON 키 파일 로드
    const filePath = path.resolve(keyPath);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ 오류: 서비스 계정 키 파일을 찾을 수 없습니다. 경로 확인 필요 → ${filePath}`);
      return null;
    }

    const serviceAccountInfo = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Pub/Sub 구독자 인증 (Subscriber)
    const audience = "https://pubsub.googleapis.com/google.pubsub.v1.Subscriber";

    // JWT 인증 객체 생성
    const credentials = new JWT({
      email: serviceAccountInfo.client_email,
      key: serviceAccountInfo.private_key,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    console.log(`✅ 인증 성공: ${filePath}`);
    return credentials;

  } catch (error) {
    console.error(`❌ 오류: 인증 과정에서 예기치 않은 오류 발생 → ${error}`);
    return null;
  }
}
