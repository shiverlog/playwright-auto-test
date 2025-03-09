# 1. Playwright 공식 Docker 이미지 사용
FROM mcr.microsoft.com/playwright:v1.41.0

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 패키지 매니저 업데이트 및 필수 패키지 설치
RUN apt-get update && apt-get install -y \
  curl \
  unzip \
  && rm -rf /var/lib/apt/lists/*

# 4. Node.js 및 npm 패키지 복사 및 설치
COPY package.json package-lock.json ./
RUN npm install

# 5. Playwright 브라우저 설치 (의존성 포함)
RUN npx playwright install --with-deps

# 6. 배치 스크립트 및 테스트 코드 복사
COPY . .

# 7. 환경 변수 설정 (Batch 실행을 위한 기본값)
ENV ENV=staging
ENV HEADLESS=true
ENV RETRY_COUNT=3

# 8. 실행 권한 부여 (배치 실행을 위한 셸 스크립트 권한 설정)
RUN chmod +x /app/batch/run-tests.sh

# 9. 컨테이너 시작 시 실행할 기본 명령어
CMD ["/bin/bash", "/app/batch/run-tests.sh"]
