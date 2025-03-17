# Description : Dockerfile - 📌 e2e api 테스트
# Author : Shiwoo Min
# Date : 2024-03-10

# Node.js 기반 Playwright 컨테이너 (E2E 테스트)
FROM mcr.microsoft.com/playwright:v1.51.0-noble

# 작업 디렉토리 설정
WORKDIR /app

#strict-ssl=false 설정, 사내망 SSL 우회 옵션
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# 환경 변수 설정
ENV NODE_ENV=test

# 종속성 복사 및 설치
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# 테스트 스크립트 복사
COPY e2e/pc-web ./e2e/pc-web

# 테스트 실행 명령어
CMD ["npx", "playwright", "test", "--config=e2e/pc-web/playwright.config.js"]
