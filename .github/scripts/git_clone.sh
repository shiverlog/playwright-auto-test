#!/bin/bash

POC=$1

# GitLab 단일 모노레포 주소
REPO_URL="http://gitlab.uhdcsre.com/digital-platform-team/qa/appium-monorepo.git"

# 기본 디렉토리 설정
WORKSPACE_DIR="./external/appium-monorepo"
LOG_PATH="./logs"
mkdir -p "$LOG_PATH"

# POC 검증
if [[ -z "$POC" ]]; then
  echo "POC 값을 입력해주세요 (예: pc | mw | aos | ios)"
  exit 1
fi

echo "[$POC] Git 작업 시작..."

# git clone 또는 pull
if [[ -d "$WORKSPACE_DIR/.git" ]]; then
  echo "디렉토리 존재 → git pull"
  cd "$WORKSPACE_DIR" || exit 1
  git reset --hard
  git checkout release
  git pull origin release
else
  echo "디렉토리 없음 → git clone"
  git clone "$REPO_URL" "$WORKSPACE_DIR"
  cd "$WORKSPACE_DIR" || exit 1
  git checkout release
fi

# POC 디렉토리 확인
if [[ ! -d "$POC" ]]; then
  echo "[$POC] 디렉토리가 모노레포 내에 존재하지 않습니다: $WORKSPACE_DIR/$POC"
  exit 1
fi

echo "[$POC] Git 클론 및 검증 완료"
echo "[$POC] Git 완료 @ $(date)" | tee "$LOG_PATH/git_clone_result_${POC}.log"
