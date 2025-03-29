#!/bin/bash

POC=$1

# 경로 설정 (TypeScript 기준이라면 의미 줄어듬)
case "$POC" in
  pc|mw|aos|ios) echo "[$POC] 실행 시작" ;;
  *) echo "❌ 잘못된 POC입니다. 사용 가능한 값: pc, mw, aos, ios"; exit 1 ;;
esac

# 안드로이드 초기화 (AOS만)
if [[ "$POC" == "aos" ]]; then
  echo "📱 ADB 초기화 중..."
  devices=$(adb devices | grep -v "List" | awk '{print $1}')
  for device in $devices; do
    adb -s "$device" shell pm clear com.android.chrome
  done
fi

# 강제 종료 Slack 메시지 (원한다면 조건부로)
if [[ "$SEND_SLACK" == "true" ]]; then
  curl -X POST -H "Content-type: application/json" \
    --data "{\"text\": \"[$POC] 강제 종료\", \"icon_emoji\": \":warning:\"}" \
    "$SLACK_WEBHOOK_URL"
fi

# 프로세스 종료 (Linux 기준)
pkill -f chrome
pkill -f mintty
pkill -f node
pkill -f playwright
pkill -f adb

# 테스트 실행 (Playwright 기준)
echo "Playwright 테스트 실행 중..."
pnpm install
npx playwright install --with-deps
npx playwright test --project="$POC"

# Slack 알림 전송 (성공 메시지)
curl -X POST -H "Content-type: application/json" \
  --data "{\"text\": \"[$POC] 테스트 완료되었습니다.\", \"icon_emoji\": \":rocket:\"}" \
  "$SLACK_WEBHOOK_URL"

echo "테스트 완료"
exit 0
