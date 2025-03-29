#!/bin/bash

POC=$1

# Slack 설정 (필수: 환경변수 또는 CI 환경에 설정)
SLACK_URL="https://slack.com/api/files.upload"
SLACK_TOKEN="${SLACK_TOKEN:?❌ SLACK_TOKEN 환경변수가 없습니다.}"
SLACK_CHANNEL="${SLACK_CHANNEL_ID:?❌ SLACK_CHANNEL_ID 환경변수가 없습니다.}"

# 결과 파일 경로 (POC별)
RESULT_BASE="./results/$POC"
FILES_TO_UPLOAD=("step3_automation_test_result.log" "*.png" "*.mp4" "*.zip" "*.json")

# POC 유효성 검사
if [[ -z "$POC" ]]; then
  echo "❗ POC 값을 입력해주세요 (예: pc, mw, aos, ios)"
  exit 1
fi

echo "[$POC] Slack 결과 파일 업로드 시작..."

cd "$RESULT_BASE" || {
  echo "결과 경로가 존재하지 않습니다: $RESULT_BASE"
  exit 1
}

# 업로드 루프
for pattern in "${FILES_TO_UPLOAD[@]}"; do
  for file in $pattern; do
    if [[ -f "$file" ]]; then
      echo "파일 업로드 중: $file"
      curl -s -F token="$SLACK_TOKEN" \
            -F channels="$SLACK_CHANNEL" \
            -F title="[$POC] $file" \
            -F filename="$file" \
            -F file=@"$file" \
            "$SLACK_URL"
    fi
  done
done

# Slack 메시지 전송 (선택)
curl -s -X POST -H 'Content-type: application/json' \
  -H "Authorization: Bearer $SLACK_TOKEN" \
  --data "{\"channel\":\"$SLACK_CHANNEL\",\"text\":\"[$POC] 테스트 결과 업로드 완료!\"}" \
  https://slack.com/api/chat.postMessage

echo "[$POC] 모든 테스트 결과 업로드 완료"
