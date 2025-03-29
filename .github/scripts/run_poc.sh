#!/bin/bash

POC=$1

if [[ -z "$POC" ]]; then
  echo "POC 값을 입력해주세요 (예: pc | mw | aos | ios)"
  exit 1
fi

echo "[$POC] 테스트 시작..."

# 1. 의존성 설치
pnpm install

# 2. Playwright 브라우저 설치
npx playwright install --with-deps

# 3. POC별 테스트 실행
npx playwright test --project="$POC"

# 4. 결과 리포트 Slack 전송 (선택적으로 bash로 구성 가능)
# ./scripts/slack_notify.sh "$POC"

echo "[$POC] 테스트 완료!"
