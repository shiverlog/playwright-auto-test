# Playwright가 미리 설치된 공식 베이스 이미지 사용 (v1.51.0 + Ubuntu Noble)
FROM mcr.microsoft.com/playwright:v1.51.0-noble

# 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app

# TLS 인증 무시 (HTTPS 테스트 중 자체 인증서 사용하는 경우 필요할 수 있음)
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# 테스트 환경 지정
ENV NODE_ENV=test

# 패키지 설치용 메타 정보 복사
COPY package.json package-lock.json ./

# 의존성 설치 (peerDeps 충돌 방지용 옵션 포함)
RUN npm install --legacy-peer-deps

# 테스트 코드 복사 (실제 모바일 웹 디바이스용 코드)
COPY e2e/device-mobile-web ./e2e/device-mobile-web

# Playwright 테스트 실행 (설정 파일 경로 기준)
CMD ["npx", "playwright", "test", "--config=e2e/device-mobile-web/playwright.config.ts"]
