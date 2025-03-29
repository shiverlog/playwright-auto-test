/**
 * 타입 정의: pubsub-config.ts
 * 설명: Pub/Sub 관련 설정 타입 정의
 */

/**
 * GCP Pub/Sub 구성 정보를 담는 인터페이스
 */
export interface PubSubConfig {
  // GCP 프로젝트 ID
  PROJECT_ID: string;
  // Pub/Sub 토픽 ID
  TOPIC_ID: string;
  // 인증 audience 정보
  PUBLISHER_AUDIENCE: string;
}
