###### - 민시우(2025/03/10) 작성 -

## 1w-5. 🐳 Ubuntu 및 Docker 학습 가이드

### [1] Ubuntu 설치 및 가이드

```sh
# wsl2 설치(우분투 및 도커사용을 위함)
wsl --install

# 설치된 WSL2 배포판 확인
wsl --list --verbose

# root 계정으로 로그인
wsl -u root

# 현재 사용자에게 sudo 권한 추가
usermod -aG sudo shiverlog

# WSL 다시 실행
exit
wsl
```

### [2] Docker 설치 및 가이드

```sh
# 도커 버젼 및 실행 중인 프로세스 확인
docker --version
docker ps

# 컨테이너 실행
docker run <container_id>

# 컨테이너 시작/중지/삭제/재시작/일시정지/재개
docker start <container_id>
docker stop <container_id>
docker rm <container_id>
docker restart <container_id>
docker pause <container_id>
docker unpause <container_id>

# 실행 중인 컨테이너에 접속
docker exec -it <container_id> /bin/bash

 # 컨테이너의 표준 입력/출력에 연결
docker attach <container_id>

# 컨테이너 로그 출력
docker logs <container_id>

# 실시간 로그 출력
docker logs -f <container_id>

# 컨테이너 내 실행 중인 프로세스 확인
docker top <container_id>

 # 컨테이너 상세 정보 확인 (JSON 형식)
docker inspect <container_id>

# Docker Compose 실행
docker-compose up -d

# 실시간 로그 확인
docker-compose logs -f

# Compose 서비스 빌드
docker-compose build

# 모든 서비스 재시작
docker-compose restart

# 모든 서비스 중지
docker-compose stop
```
