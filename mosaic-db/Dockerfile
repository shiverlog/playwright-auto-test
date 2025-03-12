# 1. 가벼운 빌드 환경 설정
FROM debian:latest AS builder

# 2. 필수 패키지 설치 (C++ 빌드 툴)
RUN apt-get update && apt-get install -y \
    build-essential cmake gcc g++ \
    && rm -rf /var/lib/apt/lists/*

# 3. 작업 디렉토리 설정
WORKDIR /app

# 4. 로컬에 있는 mosaic-db 소스를 컨테이너 내부로 복사
COPY . /app

# 5. CMake 빌드 수행
RUN cmake . && make

# 6. 실행을 위한 가벼운 컨테이너 준비
FROM debian:latest

# 7. 실행에 필요한 라이브러리만 설치 (필요에 따라 추가 가능)
RUN apt-get update && apt-get install -y \
    libpq-dev && rm -rf /var/lib/apt/lists/*

# 8. 실행 파일을 복사
WORKDIR /app
COPY --from=builder /app/mosaic-db /app/mosaic-db

# 9. 컨테이너에서 사용할 포트 지정
EXPOSE 5000

# 10. 기본 실행 명령
CMD ["./mosaic-db", "--daemon"]

# Docker 이미지를 빌드하여 'mosaic-db'라는 태그를 붙임
# (현재 디렉토리의 Dockerfile을 사용하여 빌드)
# docker build -t mosaic-db .

# 'mosaic-db-container'라는 이름을 지정하여 백그라운드(-d)에서 실행
# docker run --name mosaic-db-container -d mosaic-db
