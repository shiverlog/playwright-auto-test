#!/bin/bash

# POC 키 값 (각 환경별 식별자)
POC=$1

# POC 별 Git 저장소 및 로컬 디렉토리 설정
declare -A REPOS
REPOS["pc"]="http://gitlab.uhdcsre.com/digital-platform-team/qa/appium_pc.git"
REPOS["mw"]="http://gitlab.uhdcsre.com/digital-platform-team/qa/appium_mw.git"
REPOS["aos"]="http://gitlab.uhdcsre.com/digital-platform-team/qa/appium_aos.git"
REPOS["ios"]="http://gitlab.uhdcsre.com/digital-platform-team/qa/appium_ios.git"

declare -A DIRS
DIRS["pc"]="C:/dev/remotePC_batchfiles/pubsub/appium_pc"
DIRS["mw"]="C:/dev/remotePC_batchfiles/pubsub/appium_mw"
DIRS["aos"]="C:/dev/remotePC_batchfiles/pubsub/appium_aos"
DIRS["ios"]="C:/dev/remotePC_batchfiles/pubsub/appium_ios"

# 결과 로그 저장 경로
LOG_PATH="C:/dev/remotePC_batchfiles/slack_appium_aos_batchfiles/batchfiles_result"

# POC 입력 확인
if [[ -z "${REPOS[$POC]}" ]]; then
    echo "잘못된 POC 타입입니다. 사용 가능한 값: pc | mw | aos | ios"
    exit 1
fi

# 로컬 경로 및 Git 저장소 설정
REPO_URL=${REPOS[$POC]}
LOCAL_DIR=${DIRS[$POC]}

echo "[$POC] Git 작업 시작: $REPO_URL -> $LOCAL_DIR"

# 디렉토리 확인 및 git clone 또는 pull 수행
if [ -d "$LOCAL_DIR" ]; then
    echo "[$POC] 디렉토리 존재. 최신 코드 가져오기..."
    cd "$LOCAL_DIR"
    git pull
    git branch
    git checkout release
    git pull origin release
else
    echo "[$POC] 디렉토리 없음. 새로 클론 진행..."
    git clone "$REPO_URL" "$LOCAL_DIR"
    cd "$LOCAL_DIR"
    git checkout release
fi

pip list

# 결과 로그 저장
echo "[$POC] Git 작업 완료." > "$LOG_PATH/step2_git_clone_result_$POC.log" 2>&1
