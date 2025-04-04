# Playwright 공식 이미지 기반 (v1.51.0 + Ubuntu Noble)
FROM mcr.microsoft.com/playwright:v1.51.0-noble

# 컨테이너 작업 디렉토리 지정
WORKDIR /app

# TLS 인증서 오류 무시 (로컬 테스트 환경에서 사용)
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# NODE_ENV 설정
ENV NODE_ENV=test

# pnpm 설치 (전역 설치)
RUN npm install -g pnpm

# 종속성 설치에 필요한 파일만 먼저 복사 (캐시 최적화)
COPY package.json pnpm-lock.yaml ./

# 의존성 설치
RUN pnpm install --frozen-lockfile

# Android E2E 테스트 코드 복사
COPY e2e/android-app ./e2e/android-app

# 테스트 결과 디렉토리 생성 (필요시)
RUN mkdir -p ./e2e/android-app/test-results

# Playwright 테스트 실행 (기본 명령어)
CMD ["npx", "playwright", "test", "--config=e2e/android-app/playwright.config.ts"]
