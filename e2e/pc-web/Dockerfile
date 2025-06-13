# Playwright 공식 Docker 이미지 사용 (Node + Playwright + Browsers 포함)
FROM mcr.microsoft.com/playwright:v1.53.0-noble

# 컨테이너 내 작업 디렉토리 설정
WORKDIR /app

# 테스트 중 TLS 인증 오류 무시 (개발/테스트 환경에서만 사용)
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Node 환경을 테스트로 지정
ENV NODE_ENV=test

# 의존성 설치를 위한 패키지 메타 정보 복사
COPY package.json package-lock.json ./

# 패키지 설치 (peerDependencies 충돌 허용)
RUN npm install --legacy-peer-deps

# PC 웹용 E2E 테스트 코드 복사
COPY e2e/pc-web ./e2e/pc-web

# Playwright 테스트 실행 (pc-web 전용 설정 파일 사용)
CMD ["npx", "playwright", "test", "--config=e2e/pc-web/playwright.config.ts"]
