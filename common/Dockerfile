# Description : Dockerfile - 📌 Common Base Image
# Author : Shiwoo Min
# Date : 2024-03-10

# Ubuntu 24.04 기반 이미지
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

# Node.js 20 설치 (Node 18 이상 필수)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

# strict-ssl=false 설정, 사내망 SSL 우회 옵션
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# 프록시 환경이 아니라면 proxy 설정 제거
# ENV HTTP_PROXY=http://proxy.company.com:8080
# ENV HTTPS_PROXY=http://proxy.company.com:8080
# ENV NO_PROXY=localhost,127.0.0.1

# npm 설정 최적화 (중국 mirror 또는 기본 설정)
RUN npm config set strict-ssl false && \
    npm config set registry https://registry.npmmirror.com && \
    npm cache clean --force

# 종속성 설치
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# common 패키지 코드 복사
COPY common/ .

# 전역 링크
RUN npm link

# 컨테이너 유지
CMD ["tail", "-f", "/dev/null"]

