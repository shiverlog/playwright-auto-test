/**
 * Description: ActionConstants.ts - 📌 스와이프, 스크롤, 터치 동작 관련 상수 정의
 * Author: Shiwoo Min
 * Date: 2024-03-10
 */
export const ActionConstants = {
  // 최대 스크롤 시도 횟수
  maxScrollAttempts: 5,
  // 스와이프 대기 시간(ms)
  swipeWaitMs: 200,
  // 스크롤 시 Y축 오프셋
  scrollOffsetY: 300,
  // 터치 탭 X 좌표
  touchTapX: 300,

  // 터치 시작 Y 좌표
  touchStartY: {
    android: 800,
    ios: 600,
  },

  // 터치 종료 Y 좌표
  touchEndY: {
    android: 300,
    ios: 200,
  },
} as const;

// `touchStartY`와 `touchEndY`의 타입 설정
export type ActionConstantsType = typeof ActionConstants;
