# Description : Dockerfile - 📌 pub/sub Container Image
# Author : Shiwoo Min
# Date : 2025-03-20

# 경량 베이스 이미지 사용 (Ubuntu 대신 Debian Slim)
FROM debian:bookworm-slim AS pubsub

# APT 패키지 업데이트 및 필수 패키지 설치
RUN apt-get update && apt-get install -y curl wget gnupg apt-transport-https ca-certificates lsb-release

# Google Cloud SDK 키 및 저장소 설정
RUN curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | tee /usr/share/keyrings/cloud.google.asc > /dev/null && \
    echo "deb [signed-by=/usr/share/keyrings/cloud.google.asc] https://packages.cloud.google.com/apt cloud-sdk main" \
    > /etc/apt/sources.list.d/google-cloud-sdk.list

# Google Cloud SDK 설치
RUN apt-get update && apt-get install -y google-cloud-sdk

# APT 캐시 정리
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# 환경 변수 설정 (Pub/Sub 에뮬레이터 포트)
ENV PUBSUB_EMULATOR_HOST=0.0.0.0:8085

# 포트 노출
EXPOSE 8085

# 컨테이너 실행 시 Pub/Sub 에뮬레이터 시작
CMD ["gcloud", "beta", "emulators", "pubsub", "start", "--host-port=0.0.0.0:8085"]
