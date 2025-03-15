## 1w-4. 🚀 Git 학습 가이드

```sh
# 원격 저장소 클론
git clone <repository.git>

# 로컬 저장소 초기화
git init

# (전역설정) 사용자 이름 설정
git config --global user.name "Your Name"

# (전역설정) 사용자 이메일 설정
git config --global user.email "your.email@example.com"

# 설정된 정보 확인
git config --list

# (전역설정) 설정된 정보 확인
git config --global --list

# (로컬설정) 설정된 정보 확인
git config --local --list

# 원격 저장소 확인
git remote -v

# 원격 저장소 추가
git remote add origin <repository.git>

# 원격 저장소 URL 변경
git remote set-url origin <new_repository.git>

# 원격 저장소의 모든 브랜치 및 최신 변경 사항 가져오기
git fetch --all

# 현재 체크아웃된 브랜치의 원격 변경 사항을 가져와서 병합(merge) 또는 리베이스(rebase) 진행
git pull

# 원격 저장소의 특정 브랜치를 로컬로 가져오기
git pull origin <branch_name>

# 변경된 모든 파일을 스테이징
git add .

# 변경된 특정 파일 n개를 스테이징
git add ./sample/file1.txt ./sample/file2.js ./sample/file3.py ...

# 변경 사항을 커밋
git commit -m "커밋 메시지"

# 브랜치 변경, 새 브랜치 생성, 파일 체크아웃
git checkout <branch_name>

# 브랜치 변경
git switch <branch_name>

# 원격 저장소 주소 추가
git remote add origin <repository.git>

# 현재 체크아웃된 브랜치를 원격 저장소의 동일한 브랜치로 푸시
git push

# 로컬 브랜치를 원격 저장소로 푸시
git push origin <branch>

# 원격 저장소의 최신 상태 가져오기
git fetch origin

# 로컬 브랜치를 원격 브랜치 상태로 강제로 덮어쓰기(스테이징 영역과 작업 디렉토리의 변경 사항도 삭제)
git reset --hard origin/<branch_name>

# 로컬 브랜치를 원격 브랜치 상태로 강제로 덮어쓰기(현재 체크아웃된 로컬 브랜치는 변경X)
git fetch --force --all

# 현재 변경 사항 확인
git status

# 변경된 파일 비교
git diff

# 커밋 로그 확인
git log

# 간단한 그래프 형태로 커밋 이력 확인
git log --oneline --graph

# 현재 브랜치 목록 확인
git branch

# 새로운 브랜치 생성
git branch <branch_name>

# 새 브랜치를 생성하고 이동
git checkout -b <branch_name>

# 로컬 브랜치 삭제
git branch -d <branch_name>

# 원격 브랜치 삭제
git push origin --delete <branch_name>

# 특정 파일을 스테이징 취소
git reset HEAD <file>

# 특정 파일을 강제 롤백
git reset --hard HEAD@{n}

# 모든 변경 사항을 취소하고 마지막 커밋 상태로 되돌리기
git reset --hard

# 원격 브랜치를 기준으로 현재 브랜치를 리베이스
git rebase origin/<branch>

# 특정 커밋 되돌리기 (새로운 커밋 생성)
git revert <commit_hash>

# 특정 커밋을 현재 브랜치에 적용
git cherry-pick <commit_hash>

# 현재 변경 사항 임시 저장
git stash

# 임시 저장된 변경 사항 불러오기
git stash pop

# 태그 생성
git tag <tag_name>

# 태그 목록 확인
git tag

# 특정 태그 푸시
git push origin <tag_name>

# 모든 태그 푸시
git push origin --tags

# 로컬 태그 삭제
git tag -d <tag_name>

# 원격 태그 삭제
git push origin --delete <tag_name>

# git cach 삭제
git rm -r --cached <file>

# git "bad signature 0x00000000", "fatal: index file corrupt" 오류 발생시
del .git\index
git add .

feature/user-{yyyyMMddHHmmss}      ### 기능 관련 (api 개발, 수정 등)
infra/user-{yyyyMMddHHmmss}        ### 인프라 관련 (docker, sql 등)
bugfix/user-{yyyyMMddHHmmss}       ### 버그 픽스 관련 (버그 수정)
```
