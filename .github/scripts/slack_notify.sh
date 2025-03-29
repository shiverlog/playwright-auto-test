#!/bin/bash

POC=$1

# Slack Webhook URL (GitHub Secrets 또는 환경변수로 관리할 것)
SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL:-"https://hooks.slack.com/services/your/webhook/url"}

# POC 확인
if [[ -z "$POC" ]]; then
  echo "❗ POC 값을 입력해주세요 (예: pc | mw | aos | ios)"
  exit 1
fi

# Webhook URL 확인
if [[ -z "$SLACK_WEBHOOK_URL" ]]; then
  echo "❗ SLACK_WEBHOOK_URL 환경변수가 설정되지 않았습니다."
  exit 1
fi

# 메시지 전송
echo "Slack 메시지를 전송합니다: [$POC] 테스트 완료"

curl -X POST -H 'Content-type: application/json' \
  --data "{
    \"text\": \"[$POC] Playwright 테스트 완료되었습니다.\",
    \"username\": \"TestBot\",
    \"icon_emoji\": \":rocket:\"
  }" \
  $SLACK_WEBHOOK_URL
