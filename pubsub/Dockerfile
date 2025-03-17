# Description : Dockerfile - 📌 pub/sub Container Image
# Author : Shiwoo Min
# Date : 2024-03-10

# 경량 베이스 이미지 사용 (Ubuntu 대신 Debian Slim)
FROM debian:bookworm-slim AS pubsub

# APT 패키지 업데이트 및 필수 패키지 설치 (curl, wget, Google Cloud SDK 키 관리)
RUN apt-get update
RUN apt-get install -y curl wget gnupg

# Google Cloud SDK 및 Pub/Sub Emulator 저장소 추가
RUN curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | tee /usr/share/keyrings/cloud.google.asc > /dev/null
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.asc] https://packages.cloud.google.com/apt cloud-sdk main" | tee /etc/apt/sources.list.d/google-cloud-sdk.list

# Google Cloud SDK 및 Pub/Sub Emulator 설치
RUN apt-get update
RUN apt-get install -y google-cloud-sdk pubsub-emulator

# 불필요한 APT 캐시 제거 (이미지 최적화)
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# 환경 변수 설정 (Pub/Sub 에뮬레이터 포트 설정)
ENV PUBSUB_EMULATOR_HOST=0.0.0.0:8085

# 컨테이너 포트 설정 (Pub/Sub 에뮬레이터 기본 포트)
EXPOSE 8085

# 컨테이너 실행 시 Google Cloud Pub/Sub 에뮬레이터 실행
CMD ["gcloud", "beta", "emulators", "pubsub", "start", "--host-port=0.0.0.0:8085"]
