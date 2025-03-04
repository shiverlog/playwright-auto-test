#!/bin/bash

# 깃 클론

FILE="appium_aos"

cd "C:/dev/remotePC_batchfiles/pubsub";

# 나중에 git clone 받을 브랜치명 수정
# 파일/디렉토리 상관없이appium_aos이 존재하지 않으면 git clone, 존재하면 git pull 
# 새로 git clone을 받는다면 가상환경 생성 및 활성화 실행
if [ -e $FILE ];
then
	echo 'appium_aos file is exist'
	cd "appium_aos";
	# git pull origin development;
	git pull origin release;
	git branch;
	git checkout release;
	git branch;
	#pip install -r C:/dev/remotePC_batchfiles/pubsub/appium_aos/requirements.txt;
	pip list;
else
	echo 'selenium_mw file is not exist';
	git clone http://gitlab.uhdcsre.com/digital-platform-team/qa/appium_aos.git;
	cd "C:/dev/remotePC_batchfiles/pubsub/appium_aos";
	git checkout release;
	git branch;
	#pip install -r C:/dev/remotePC_batchfiles/pubsub/appium_aos/requirements.txt;
	pip list;
fi > 'C:/dev/remotePC_batchfiles/appium_aos_batchfiles/batchfiles_result/step2_git_clone_result.log' 2>&1

