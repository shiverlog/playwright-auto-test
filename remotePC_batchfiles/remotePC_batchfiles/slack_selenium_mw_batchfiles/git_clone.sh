#!/bin/bash

# 깃 클론

FILE="selenium_mw"

cd "C:/dev/remotePC_batchfiles/pubsub";

# 나중에 git clone 받을 브랜치명 수정
# 파일/디렉토리 상관없이 selenium_pc이 존재하지 않으면 git sclone, 존재하면 git pull 
# 새로 git clone을 받는다면 가상환경 생성 및 활성화 실행
if [ -e $FILE ];
then
	echo 'selenium_mw file is exist'
	cd "selenium_mw";
	git pull; 
	git branch;
	git checkout slack-release;
	git branch;
	git pull origin slack-release;
	# pip install -r C:/dev/remotePC_batchfiles/pubsub/selenium_mw/requirements.txt;
	pip list;
else
	echo 'selenium_mw file is not exist';
	git clone http://gitlab.uhdcsre.com/digital-platform-team/qa/selenium_mw.git;
	cd "C:/dev/remotePC_batchfiles/pubsub/selenium_mw";
	git checkout slack-release;
	git branch;
	# pip install -r C:/dev/remotePC_batchfiles/pubsub/selenium_mw/requirements.txt;
	pip list;
fi > 'C:/dev/remotePC_batchfiles/slack_selenium_mw_batchfiles/batchfiles_result/step2_git_clone_result.log' 2>&1

