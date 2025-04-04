# Playwright가 사전 설치된 공식 베이스 이미지 사용 (Node.js, 브라우저 포함)
FROM mcr.microsoft.com/playwright:v1.51.0-noble

# 컨테이너 내 작업 디렉토리 설정
WORKDIR /app

# TLS 인증 무시 설정 (로컬 테스트 시 필요할 수 있음)
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Node.js 환경을 테스트 모드로 지정
ENV NODE_ENV=test

# 패키지 메타 정보 복사 (pnpm 기반인 경우에는 pnpm-lock.yaml 사용 필요)
COPY package.json package-lock.json ./

# 의존성 설치 (호환성 이슈 방지를 위해 legacy-peer-deps 사용)
RUN npm install --legacy-peer-deps

# PC + 모바일 웹 테스트 코드 복사
COPY e2e/pc-mobile-web ./e2e/pc-mobile-web

# Playwright 테스트 실행 (테스트 config 경로 확인 필요)
CMD ["npx", "playwright", "test", "--config=e2e/pc-mobile-web/playwright.config.ts"]
