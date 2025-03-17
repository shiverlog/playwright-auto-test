# Description : Dockerfile - 📌 DB Container Image
# Author : Shiwoo Min
# Date : 2024-03-10

# 경량 Debian 기반 이미지 사용
FROM debian:bookworm-slim AS builder

# 필수 패키지 설치 (Python2 수동 빌드에 필요한 패키지 포함)
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    gcc \
    g++ \
    libssl-dev \
    libsqlite3-dev \
    zlib1g-dev \
    libnuma-dev \
    libibverbs-dev \
    libgflags-dev \
    libgoogle-glog-dev \
    liburing-dev \
    wget \
    tar \
    make \
    curl \
    libbz2-dev \
    libreadline-dev \
    libffi-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Python2 소스 코드 다운로드 및 빌드
WORKDIR /usr/src
RUN wget https://www.python.org/ftp/python/2.7.18/Python-2.7.18.tgz && \
    tar xzf Python-2.7.18.tgz && \
    cd Python-2.7.18 && \
    ./configure --enable-optimizations && \
    make -j$(nproc) && \
    make altinstall

# Python2 심볼릭 링크 추가 (python2를 python으로 사용 가능하게 설정)
RUN ln -s /usr/local/bin/python2.7 /usr/bin/python2 && ln -s /usr/bin/python2 /usr/bin/python

# Python 버전 확인 (디버깅용)
RUN python --version

# MosaicDB 빌드
WORKDIR /app
COPY . /app

# CMakeLists.txt가 위치한 `mosaic-db` 폴더로 이동
RUN mkdir -p build
WORKDIR /app/build
RUN cmake /app -DCMAKE_BUILD_TYPE=Release && make -j$(nproc)

# 런타임 단계 (실행 컨테이너)
FROM debian:bookworm-slim AS runtime

# 필수 런타임 라이브러리만 설치
RUN apt-get update && apt-get install -y --no-install-recommends \
    libssl-dev \
    libsqlite3-dev \
    zlib1g-dev \
    libnuma-dev \
    libibverbs-dev \
    libgflags-dev \
    libgoogle-glog-dev \
    liburing-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 실행 디렉토리 설정 및 실행 파일 복사
WORKDIR /app
COPY --from=builder /app/build/ycsb_SI_hybrid_coro /app/mosaic-db

# 보안 정책 우회 (SSL 문제 대응)
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# HugePages 및 메모리 설정
RUN echo "512" > /proc/sys/vm/nr_hugepages
RUN echo "root soft memlock unlimited" >> /etc/security/limits.conf && \
    echo "root hard memlock unlimited" >> /etc/security/limits.conf

# 포트 설정
EXPOSE 5000

# HealthCheck 추가
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s \
  CMD curl --fail http://localhost:5000/health || exit 1

# MosaicDB 실행
ENTRYPOINT ["/app/mosaic-db"]
CMD ["-log_data_dir=/mnt/nvme0n1/mosaicdb-log", \
    "-node_memory_gb=50", \
    "-ycsb_workload=C", \
    "-ycsb_read_tx_type=hybrid-coro", \
    "-seconds=10", \
    "-threads=10"]

# Docker 이미지를 빌드하여 'mosaic-db'라는 태그를 붙임
# (현재 디렉토리의 Dockerfile을 사용하여 빌드)
# docker build -t mosaic-db .

# 'mosaic-db-container'라는 이름을 지정하여 백그라운드(-d)에서 실행
# docker run --name mosaic-db-container -d mosaic-db
