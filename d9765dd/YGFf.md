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

# 현재 사용자(shiverlog) 패스워드 재설정
passwd shiverlog

# 현재 사용자에게(shiverlog) sudo 권한 추가
usermod -aG sudo shiverlog

# WSL 다시 실행
exit
wsl

# Ubuntu 기본 설정 및 패키지 업데이트
sudo apt update && sudo apt upgrade -y

# Docker 설치 (Ubuntu 환경)
sudo apt install -y ca-certificates curl gnupg

# Docker GPG 키 추가 및 저장소 설정
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo tee /etc/apt/keyrings/docker.asc > /dev/null
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker 패키지 설치
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Docker 서비스 실행 및 자동 시작 설정
sudo systemctl start docker
sudo systemctl enable docker

# 현재 사용자를 Docker 그룹에 추가
sudo usermod -aG docker $USER
```

### [2] Docker 설치 및 가이드

```sh
# 최신 Docker Desktop 설치
sudo rm /usr/local/bin/docker-compose  # 기존 버전 삭제
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

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
