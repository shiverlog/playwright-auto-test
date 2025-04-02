#!/bin/bash

set -e

POC=$1

# POC 유효성 검사
case "$POC" in
  pc|mw|aos|ios) echo "[$POC] 테스트 실행 시작" ;;
  *) echo "[ERROR] 잘못된 POC입니다. 사용 가능한 값: pc, mw, aos, ios"; exit 1 ;;
esac

# ADB 초기화 (AOS 전용)
if [[ "$POC" == "aos" ]]; then
  echo "[INFO] ADB 초기화 중..."
  devices=$(adb devices | grep -v "List" | awk '{print $1}')
  for device in $devices; do
    adb -s "$device" shell pm clear com.android.chrome
  done
fi

# Slack Webhook 설정 (옵션)
if [[ "$SEND_SLACK" == "true" && -n "$SLACK_WEBHOOK_URL" ]]; then
  curl -s -X POST -H "Content-type: application/json" \
    --data "{\"text\": \"[$POC] 테스트 시작 또는 강제 초기화됨.\"}" \
    "$SLACK_WEBHOOK_URL" > /dev/null
fi

# 프로세스 종료
pkill -f chrome || true
pkill -f node || true
pkill -f playwright || true
pkill -f adb || true

# 테스트 실행
echo "[INFO] [$POC] 테스트를 실행합니다..."
pnpm install
npx playwright install --with-deps
npx playwright test --project="$POC"

# Slack 성공 메시지
if [[ -n "$SLACK_WEBHOOK_URL" ]]; then
  curl -s -X POST -H "Content-type: application/json" \
    --data "{\"text\": \"[$POC] Playwright 테스트가 성공적으로 완료되었습니다.\"}" \
    "$SLACK_WEBHOOK_URL" > /dev/null
fi

echo "[SUCCESS] [$POC] 테스트 완료"
exit 0
