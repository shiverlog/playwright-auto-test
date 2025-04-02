#!/bin/bash

set -euo pipefail

POC=$1

# Slack 설정 (환경 변수 필수)
SLACK_URL="https://slack.com/api/files.upload"
SLACK_TOKEN="${SLACK_TOKEN:?SLACK_TOKEN 환경변수가 없습니다.}"
SLACK_CHANNEL="${SLACK_CHANNEL_ID:?SLACK_CHANNEL_ID 환경변수가 없습니다.}"

# 업로드 대상 파일 목록 (POC별)
RESULT_BASE="./results/$POC"
FILES_TO_UPLOAD=("step3_automation_test_result.log" "*.png" "*.mp4" "*.zip" "*.json")

# POC 유효성 검사
if [[ -z "$POC" ]]; then
  echo "[ERROR] POC 값을 입력해주세요 (예: pc, mw, aos, ios)"
  exit 1
fi

echo "[INFO] [$POC] Slack 결과 파일 업로드 시작..."

# 결과 디렉토리 이동
if [[ ! -d "$RESULT_BASE" ]]; then
  echo "[ERROR] 결과 디렉토리가 존재하지 않습니다: $RESULT_BASE"
  exit 1
fi
cd "$RESULT_BASE"

# glob이 비어 있을 경우 반복 방지
shopt -s nullglob

UPLOAD_COUNT=0

# 업로드 루프
for pattern in "${FILES_TO_UPLOAD[@]}"; do
  for file in $pattern; do
    if [[ -f "$file" ]]; then
      echo "[INFO] 파일 업로드 중: $file"
      curl -s -F token="$SLACK_TOKEN" \
            -F channels="$SLACK_CHANNEL" \
            -F title="[$POC] $file" \
            -F filename="$file" \
            -F file=@"$file" \
            "$SLACK_URL"
      UPLOAD_COUNT=$((UPLOAD_COUNT + 1))
    fi
  done
done

# 파일이 하나도 없을 경우
if [[ $UPLOAD_COUNT -eq 0 ]]; then
  echo "[INFO] 업로드할 결과 파일이 없습니다."
fi

# Slack 메시지 전송
echo "[INFO] Slack 메시지 전송 중..."
curl -s -X POST -H 'Content-type: application/json' \
  -H "Authorization: Bearer $SLACK_TOKEN" \
  --data "{\"channel\":\"$SLACK_CHANNEL\",\"text\":\"[$POC] 테스트 결과 업로드가 완료되었습니다.\"}" \
  https://slack.com/api/chat.postMessage

echo "[SUCCESS] [$POC] 모든 테스트 결과 업로드 완료"
