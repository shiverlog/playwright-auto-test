# Playwright 공식 Docker 이미지 사용 (최신 버전, Ubuntu 24.04 LTS 기반)
FROM mcr.microsoft.com/playwright:v1.51.0-noble

# 작업 디렉토리 설정
WORKDIR /app

# SSL 인증서 우회 설정 (사내망 SSL 문제 해결)
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# 패키지 파일 복사 및 설치
COPY package.json package-lock.json ./
RUN npm install

# 테스트 코드 복사
COPY . .

# Playwright 브라우저 설치
RUN npx playwright install --with-deps

# Playwright 테스트 실행
CMD ["npx", "playwright", "test"]
