# Playwright 공식 이미지 사용 (Ubuntu 24.04 기반, Node.js 포함)
FROM mcr.microsoft.com/playwright:v1.51.0-noble

# 작업 디렉토리 설정
WORKDIR /app

# 사내망 SSL 인증 우회 (필요한 경우)
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Puppeteer 브라우저 다운로드 방지 (Playwright만 사용)
ENV PUPPETEER_SKIP_DOWNLOAD=true

# 패키지 설치 최적화 (캐시 활용)
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# 전체 프로젝트 코드 복사
COPY . .

# Playwright 관련 브라우저 설치
RUN npx playwright install --with-deps

# 실행할 테스트 스크립트 경로 설정
WORKDIR /app/tests

# 컨테이너 포트 설정 (필요한 경우)
EXPOSE 9222

# Playwright 테스트 실행 (결과는 logs 및 screenshots 폴더에 저장)
CMD ["npx", "playwright", "test"]
