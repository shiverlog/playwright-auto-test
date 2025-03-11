# Description : Dockerfile - 📌 Common Base Image
# Author : Shiwoo Min
# Date : 2024-03-10

# server image는 ubunutu 22.04를 사용
FROM ubuntu:22

# 작업 디렉토리 설정
WORKDIR /app

# 애플리케이션 종속성 설치
COPY package.json package-lock.json /app/
RUN npm install

# 애플리케이션 파일 추가
COPY . /app/

# image가 올라갔을 때 수행되는 명령어들
# -y 옵션을 넣어서 무조건 설치가 가능하도록 한다.
RUN \
    apt-get update && \
    apt-get install -y apache2

# expose를 이용해 apache server 80포트로 접근
EXPOSE 80

# 컨테이너가 생성 된 이후에 내부의 아파치 서버는 항상 실행중인 상태로 만들어준다.
# apachectl을 foreground(즉, deamon)상태로 돌아가도록 한다.
CMD ["apachectl", "-D", "FOREGROUND"]
