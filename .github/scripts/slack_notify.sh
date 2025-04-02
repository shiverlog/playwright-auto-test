#!/bin/bash

set -e  # 실패 시 즉시 종료

POC=$1

# Slack Webhook URL - 환경변수로 설정 필요 (Secrets 등으로 관리)
SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL:-""}

# Webhook 설정 확인
if [[ -z "$SLACK_WEBHOOK_URL" ]]; then
  echo "[ERROR] SLACK_WEBHOOK_URL 환경변수가 설정되지 않았습니다."
  exit 1
fi

# 메시지 전송
echo "[INFO] Slack 메시지를 전송합니다: [$POC] 테스트 완료"

curl -s -X POST -H 'Content-type: application/json' \
  --data "{
    \"text\": \"[$POC] Playwright 테스트가 완료되었습니다.\",
    \"username\": \"PlaywrightBot\"
  }" \
  "$SLACK_WEBHOOK_URL" > /dev/null

echo "[INFO] Slack 전송 완료"
