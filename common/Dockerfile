# Description : Dockerfile - 📌 Common Base Image
# Author : Shiwoo Min
# Date : 2024-03-10

# Ubuntu 24.04 이미지 사용 (가벼운 리눅스 환경)
FROM ubuntu:24.04

# 작업 디렉토리 설정
WORKDIR /app/common

# 기본 패키지 설치
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    ca-certificates \
    lsb-release \
    && rm -rf /var/lib/apt/lists/*

# Node.js 설치 (필요한 버전 지정)
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

# strict-ssl=false 설정, 사내망 SSL 우회 옵션
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# 프록시 설정 (필요한 경우 설정, 불필요하면 제거)
ENV HTTP_PROXY=http://proxy.company.com:8080
ENV HTTPS_PROXY=http://proxy.company.com:8080
ENV NO_PROXY=localhost,127.0.0.1

# NPM 설정 변경 (필요한 경우)
RUN npm config set strict-ssl false && \
    npm config set registry https://registry.npmmirror.com && \
    npm cache clean --force

# 애플리케이션 종속성 설치
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# common 패키지 코드 추가
COPY common/ .

# common 패키지를 글로벌 패키지로 등록 (npm link 방식)
RUN npm link

# 컨테이너가 유지되도록 설정
CMD ["tail", "-f", "/dev/null"]
