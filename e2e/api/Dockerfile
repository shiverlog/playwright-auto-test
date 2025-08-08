# Playwright 공식 이미지 (v1.51.0 기반, Ubuntu Noble)
FROM mcr.microsoft.com/playwright:v1.54.2-noble

# 컨테이너 내 작업 디렉토리 설정
WORKDIR /app

# 개발 환경 세팅 (인증 무시 + NODE_ENV)
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV NODE_ENV=test

# pnpm 전역 설치
RUN npm install -g pnpm

# 종속성 설치를 위한 파일 복사 (캐시 최적화를 위해)
COPY package.json pnpm-lock.yaml ./

# 종속성 설치 (pnpm 기반)
RUN pnpm install --frozen-lockfile

# Playwright API 테스트 디렉토리 복사
COPY e2e/api ./e2e/api

# 결과 디렉토리(옵션) 생성
RUN mkdir -p ./e2e/api/test-results

# Playwright 테스트 실행 (기본 명령어)
CMD ["npx", "playwright", "test", "--config=e2e/api/playwright.config.ts"]
