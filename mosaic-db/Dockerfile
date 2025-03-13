# 빌드 단계 (Debian을 사용하여 MosaicDB 컴파일)
FROM ubuntu:18.04 AS builder

# 필수 패키지 설치 (C++ 빌드 툴 및 의존성 + Python 2 기본 지원)
RUN apt-get update && apt-get install -y \
    software-properties-common \
    && add-apt-repository -y ppa:deadsnakes/ppa \
    && apt-get update && apt-get install -y \
    build-essential \
    cmake \
    gcc \
    g++ \
    python2.7 \
    python2.7-dev \
    libssl-dev \
    libsqlite3-dev \
    zlib1g-dev \
    libnuma-dev \
    libibverbs-dev \
    libgflags-dev \
    libgoogle-glog-dev \
    wget \
    tar \
    make \
    && rm -rf /var/lib/apt/lists/*

# 2. liburing 수동 설치 (소스 코드 빌드)
WORKDIR /usr/src
RUN wget https://github.com/axboe/liburing/archive/refs/tags/liburing-2.1.tar.gz \
    && tar xzf liburing-2.1.tar.gz \
    && cd liburing-liburing-2.1 \
    && ./configure \
    && make -j$(nproc) \
    && make install

# 3. Python 2가 정상적으로 설치되었는지 확인
RUN python2 --version

# 4. 작업 디렉토리 설정 및 소스 코드 복사
WORKDIR /app
COPY . /app

# 5. CMakeLists.txt 확인 (디버깅용)
RUN ls -la /app

# 6. 빌드 수행 (CMake 사용)
RUN mkdir -p build
WORKDIR /app/build
RUN cmake .. -DCMAKE_BUILD_TYPE=Release && make

# ─────────────────────────────────────────────
# 2️⃣ 런타임 단계 (경량 컨테이너에서 실행)
# ─────────────────────────────────────────────
FROM ubuntu:18.04 AS runtime

# 1. 필수 런타임 라이브러리 설치
RUN apt-get update && apt-get install -y --no-install-recommends \
    libssl-dev \
    libsqlite3-dev \
    zlib1g-dev \
    libnuma-dev \
    libibverbs-dev \
    libgflags-dev \
    libgoogle-glog-dev \
    && rm -rf /var/lib/apt/lists/*

# 2. 실행 디렉토리 설정 및 빌드된 실행 파일 복사
WORKDIR /app
COPY --from=builder /app/build/ycsb_SI_hybrid_coro /app/mosaic-db

# 3. 보안 정책 우회 (사내망 SSL 문제 대응)
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# 4. HugePages 설정 (512 페이지 할당)
RUN echo "512" > /proc/sys/vm/nr_hugepages

# 5. mlock (메모리 잠금) 설정 추가
RUN echo "root soft memlock unlimited" >> /etc/security/limits.conf && \
    echo "root hard memlock unlimited" >> /etc/security/limits.conf

# 6. 컨테이너에서 사용할 포트 지정
EXPOSE 5000

# 7. MosaicDB 실행 (백그라운드 실행)
ENTRYPOINT ["/app/mosaic-db", \
    "-log_data_dir=/mnt/nvme0n1/mosaicdb-log", \
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
