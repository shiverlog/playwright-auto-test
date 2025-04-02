#!/bin/bash

set -e

POC=$1

# 슬랙 알림 활성화 여부 (true/false)
ENABLE_SLACK=false

# POC 유효성 검사
if [[ -z "$POC" ]]; then
  echo "[ERROR] POC 값을 입력해주세요 (예: pc | mw | aos | ios)"
  exit 1
fi

echo "[INFO] [$POC] 테스트 시작..."

# 의존성 설치
echo "[INFO] 의존성 설치 중..."
pnpm install

# Playwright 브라우저 설치
echo "[INFO] Playwright 브라우저 설치 중..."
npx playwright install --with-deps

# POC 값이 존재하는 project인지 사전 확인
VALID_PROJECTS=("pc" "mw" "aos" "ios" "api")
if [[ ! " ${VALID_PROJECTS[@]} " =~ " ${POC} " ]]; then
  echo "[ERROR] 지원하지 않는 POC 값입니다. (${POC})"
  exit 1
fi

# Playwright 테스트 실행
echo "[INFO] [$POC] 테스트 실행 중..."
npx playwright test --project="$POC"

# Slack 알림 전송 (조건부)
if [[ "$ENABLE_SLACK" == "true" ]]; then
  echo "[INFO] Slack 알림 전송..."
  ./scripts/slack_notify.sh "$POC"
fi

# 완료 메시지 및 리포트 경로 안내
echo "[SUCCESS] [$POC] 테스트 완료!"
echo "[INFO] 리포트 위치: ./playwright-report/index.html"
