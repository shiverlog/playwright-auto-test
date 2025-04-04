# Playwright가 미리 설치된 공식 베이스 이미지 사용 (v1.51.0 + Ubuntu Noble)
FROM mcr.microsoft.com/playwright:v1.51.0-noble

# 작업 디렉토리를 /app으로 설정
WORKDIR /app

# SSL 인증서 관련 오류 방지를 위한 설정 (테스트 환경용)
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# NODE_ENV를 test로 지정 (테스트 실행 목적)
ENV NODE_ENV=test

# 의존성 설치를 위한 패키지 파일 복사 (pnpm 사용 시 필요 파일 변경)
COPY package.json pnpm-lock.yaml ./

# pnpm 설치 및 의존성 설치
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# iOS 관련 테스트 코드만 복사
COPY e2e/ios-app ./e2e/ios-app

# Playwright iOS 테스트 실행 (실제 디바이스 제어는 macOS에서 수행됨)
CMD ["npx", "playwright", "test", "--config=e2e/ios-app/playwright.config.ts"]
