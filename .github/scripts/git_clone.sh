#!/bin/bash

# POC 이름 (ex: pc, mw, aos, ios)
POC=$1

# 필수 변수 설정
REPO_URL="https://github.com/shiverlog/playwright-auto-test.git"
BRANCH="release"
WORKSPACE_DIR="./playwright-auto-test"
LOG_PATH="./logs" # 수정됨: 명시적으로 로그 경로 설정

# 에러 발생 시 종료
set -e

# POC 유효성 검사
if [[ -z "$POC" ]]; then
  echo "[ERROR] POC 값을 입력해주세요 (예: pc | mw | aos | ios)"
  exit 1
fi

# 로그 디렉토리 생성
mkdir -p "$LOG_PATH"

echo "[INFO] [$POC] Git 작업 시작..."

# 저장소 클론 또는 업데이트
if [[ -d "$WORKSPACE_DIR/.git" ]]; then
  echo "[INFO] 기존 디렉토리 존재 → git pull 실행"
  cd "$WORKSPACE_DIR"
  git fetch origin
  git reset --hard "origin/$BRANCH"
  git checkout "$BRANCH"
  git pull origin "$BRANCH"
else
  echo "[INFO] 디렉토리 없음 → git clone 실행"
  git clone "$REPO_URL" "$WORKSPACE_DIR"
  cd "$WORKSPACE_DIR"
  git checkout "$BRANCH"
fi

# POC 디렉토리 존재 여부 확인
if [[ ! -d "$POC" ]]; then
  echo "[ERROR] [$POC] 디렉토리가 존재하지 않습니다: $WORKSPACE_DIR/$POC"
  exit 1
fi

# 완료 메시지 및 로그 기록
echo "[INFO] [$POC] Git 클론 및 디렉토리 검증 완료"
echo "[$POC] Git 완료 @ $(date)" | tee "$LOG_PATH/git_clone_result_${POC}.log"
