import { Message, PubSub } from '@google-cloud/pubsub';

// 프로젝트 및 구독 정보 설정
const PROJECT_ID = 'gc-automation-test'; // Google Cloud 프로젝트 ID
const SUBSCRIPTION_ID = 'my-sub'; // Pub/Sub 구독 ID
const NUM_MESSAGES = 3; // 최대 메시지 개수

// Google Cloud Pub/Sub 클라이언트 생성
const pubsub = new PubSub({ projectId: PROJECT_ID });
const subscription = pubsub.subscription(SUBSCRIPTION_ID);

/**
 * Google Cloud Pub/Sub에서 메시지를 Pull 방식으로 가져오는 함수
 */
async function pullMessages(): Promise<void> {
  try {
    console.log(`🚀 Listening for messages from '${SUBSCRIPTION_ID}'...`);

    let receivedCount = 0; // 받은 메시지 개수 카운트

    // 메시지 이벤트 리스너 설정
    const messageHandler = (message: Message) => {
      if (receivedCount < NUM_MESSAGES) {
        console.log(`📩 Received: ${message.data.toString()}`);
        message.ack();
        receivedCount++;
      }

      // 최대 메시지 개수 도달 시 구독 종료
      if (receivedCount >= NUM_MESSAGES) {
        console.log(`✅ Successfully acknowledged ${receivedCount} messages.`);
        subscription.removeListener('message', messageHandler);
      }
    };

    // 메시지 수신 시작
    subscription.on('message', messageHandler);

    // 오류 처리
    subscription.on('error', error => {
      console.error(`❌ Subscription error: ${error}`);
    });
  } catch (error) {
    console.error(`❌ Error pulling messages: ${error}`);
  }
}

// ✅ 실행
pullMessages();
