# Playwright가 미리 설치된 공식 베이스 이미지 사용 (v1.51.0 + Ubuntu Noble)
FROM mcr.microsoft.com/playwright:v1.51.0-noble

# 작업 디렉토리 설정
WORKDIR /app

# 환경 변수 설정 (보안 인증 무시 + 테스트 환경)
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV NODE_ENV=test

# 패키지 메타 정보 복사
COPY package.json package-lock.json ./

# 의존성 설치 (peerDeps 충돌 방지)
RUN npm install --legacy-peer-deps

# 모바일 웹 테스트 코드 복사
COPY e2e/emulator-mobile-web ./e2e/emulator-mobile-web

# AVD 및 emulator 실행 관련 도구 설치 (단, 일부는 권장하지 않음 - 참고용)
# 에뮬레이터 실행은 실제로는 로컬에서 하는 것이 안정적이지만, 도커에서 실행해야 하는 경우 다음 참고:
# RUN apt-get update && apt-get install -y \
#     qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils \
#     android-sdk emulator libgl1-mesa-dev mesa-utils \
#     && rm -rf /var/lib/apt/lists/*

# Android SDK 및 에뮬레이터 다운로드는 시간 소모적이며 빌드가 무거워질 수 있음
# RUN yes | sdkmanager --licenses && \
#     sdkmanager "platform-tools" "emulator" "system-images;android-30;google_apis;x86_64"

# 테스트 실행 (에뮬레이터가 이미 실행 중이라는 전제)
CMD ["npx", "playwright", "test", "--config=e2e/emulator-mobile-web/playwright.config.ts"]
