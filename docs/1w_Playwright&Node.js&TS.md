# 1W. Playwright & Node.js & TS 학습(03/07 - 03/14)

## 개발툴 및 Node.js 언어 설치

- Visual Code : https://code.visualstudio.com/download
- Node JS : https://nodejs.org/ko/download
- wsl2 : https://learn.microsoft.com/windows/wsl/install
- docker : https://www.docker.com/get-started/
- mosaicdb : https://github.com/sfu-dis/mosaicdb

```sh
# wsl2 설치(우분투 및 도커사용을 위함)
wsl --install
```

```wsl
# mosaic-db 사용을 위한 라이브러리 설치
sudo apt-get install cmake gcc-10 g++-10 libc++-dev libc++abi-dev \
    libnuma-dev libibverbs-dev libgflags-dev libgoogle-glog-dev liburing-dev
```

```powershell
# Chocolatey 설치
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

```powershell
# chocolatey를 사용하여 OpenCV 설치
choco install opencv -y
```

## 가이드

- Typescript 가이드 : https://www.typescriptlang.org/
- Playwright 가이드 : https://playwright.dev/docs/intro
- Selenium 가이드 : https://www.selenium.dev/documentation/
- Appium 가이드 : https://appium.io/docs/en/latest/
- Docker hub : https://hub.docker.com/
- OpenCV 가이드 : https://docs.opencv.org/4.x/dc/de6/tutorial_js_nodejs.html
- Opencv4nodejs : https://github.com/justadudewhohacks/opencv4nodejs

## TypeScript 설치 및 Playwright 설치

```PowerShell
# 스크립트 실행 제한을 해제하여 모든 PowerShell 스크립트 실행 가능
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
Set-ExecutionPolicy RemoteSigned

# 기본 글로벌 패키지 설치
npm install -g npm
npm install -g typescript

# Playwright 초기화
npm init playwright@latest
# √ Do you want to use TypeScript or JavaScript? · TypeScript
# √ Where to put your end-to-end tests? · e2e
# √ Add a GitHub Actions workflow? (y/N) · true

# TypeScript 개발 환경 패키지
npm install --save-dev typescript ts-node @types/node

# ESLint 및 코드 스타일링
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-prettier prettier

# Playwright 기본 테스트 및 확장
npm install --save-dev @playwright/test playwright-bdd playwright-expect

# API 테스트 및 Mocking
npm install --save-dev supertest msw nock casual

# Playwright + API 테스트 + 리포팅
npm install --save-dev @playwright/test playwright-bdd supertest pixelmatch dotenv allure-playwright

# 성능 분석 및 환경 변수 관리
npm install --save-dev playwright-lighthouse dotenv cross-env

# 테스트 실행 최적화 및 병렬 처리
npm install --save-dev concurrently forever start-server-and-test

# 디버깅 및 코드 커버리지 측정
npm install --save-dev debug nyc

# Jest 러너 추가
npm install --save-dev jest-circus

# Faker 데이터 생성
npm install --save-dev @faker-js/faker

# 로거를 사용하기 위한 패키지 설치
npm install winston
npm install winston-daily-rotate-file

npm install morgan
npm install --save @types/morgan

# xlsx 패키지 설치
npm install xlsx

# Slack API 패키지 설치
npm install @slack/web-api certifi dotenv
npm install @slack/web-api typescript dotenv
npm install @slack/socket-mode
npm install p-retry
npm install ssl-root-cas

# Google API 패키지 설치
npm install googleapis dotenv axios

# Mail 패키지 설치
npm install nodemailer

# Pubsub 패키지 설치
npm install @google-cloud/pubsub --save

# Appium 및 WebDriver 설치
npm install -g appium
npm install appium --save-dev
npm install webdriverio --save-dev
appium driver install uiautomator2 # Android 드라이버 설치
appium driver install xcuitest  # iOS 드라이버 설치
npm install --save-dev @types/webdriverio
npm install wd

# 리엑트 패키지 설치
npm install react react-dom
npm install --save-dev @types/react @types/react-dom

# swagger
npm install swagger-jsdoc swagger-ui-express

# postman
npm install -g postman-to-k6
npm install -g postman-code-generators
npm install -g newman

# Open CV 변수 선언
setx OPENCV_INCLUDE_DIR "C:\tools\opencv\build\include"
setx OPENCV_LIB_DIR "C:\tools\opencv\build\x64\vc16\lib"
setx OPENCV_BIN_DIR "C:\tools\opencv\build\x64\vc16\bin"
setx PATH "%OPENCV_BIN_DIR%;%PATH%"

# opencv_world4110.lib -> opencv_world.lib 으로 변경
choco install -y python visualcpp-build-tools
npm install -g node-gyp
npm install -g cmake-js

# OpenCV 자동 빌드를 비활성화
set OPENCV4NODEJS_DISABLE_AUTOBUILD=1

# 외부 메모리 추적 비활성화
set OPENCV4NODEJS_DISABLE_EXTERNAL_MEM_TRACKING=1

# 기존 설치 파일 정리
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force

# OpenCV4NodeJS 설치
npm install opencv4nodejs --build-from-source
npm install

# node_modules 경로 확인
npm root

# depedencies.json 안의 패키지 node_modules 에 저장
Get-Content dependencies.json

# node_modules 안의 패키지 dependencies.json 저장
npm list --depth=0 --json > dependencies.json

# TypeScript 컴파일
npx tsc

# 모든 사용자(Everyone)에게 해당 폴더 및 하위 폴더에 대한 전체 제어 권한 부여
icacls "E:\playwright-auto-test" /grant Everyone:F /T
```

## VS Code 확장 프로그램 설치

```PowerShell
# GitHub Copilot - AI 기반 코드 자동 완성
code --install-extension GitHub.copilot

# GitHub Actions - CI/CD 파이프라인 관리
code --install-extension GitHub.vscode-github-actions

# Azure Pipelines - Azure DevOps 파이프라인 지원
code --install-extension ms-azure-devops.azure-pipelines

# YAML 파일 편집 지원 (CI/CD, Kubernetes 설정에 유용)
code --install-extension redhat.vscode-yaml

# Docker 컨테이너 관리 및 개발 지원
code --install-extension ms-azuretools.vscode-docker

# VS Code 아이콘 테마 (Material 디자인 적용)
code --install-extension PKief.material-icon-theme

# 코드 들여쓰기 가독성 개선 (Indentation Colorizer)
code --install-extension oderwat.indent-rainbow

# GitLens - Git 변경 이력 및 Blame 기능 강화
code --install-extension eamodio.gitlens

# 코드 오류 및 경고를 한눈에 표시 (Error Lens)
code --install-extension usernamehw.errorlens

# 코드 내 철자 오류 검사 (Code Spell Checker)
code --install-extension streetsidesoftware.code-spell-checker

# Playwright 테스트 작성 및 실행 지원
code --install-extension ms-playwright.playwright
```

## Git 학습

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

feature/user-{yyyyMMddHHmmss}      ### 기능 관련 (api 개발, 수정 등)
infra/user-{yyyyMMddHHmmss}        ### 인프라 관련 (docker, sql 등)
bugfix/user-{yyyyMMddHHmmss}       ### 버그 픽스 관련 (버그 수정)
```

## Docker 학습

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

## Appium 학습

### 웹뷰(WebView)와 네이티브 뷰(Native View) 개념 및 웹 인증 프로세스

- ChromeCustomTab (Android) : Android 4.3 이상에서 OAuth/OpenID Connect 인증을 웹 기반으로 실행할 때 사용
- ASWebAuthenticationSession (iOS) : iOS 12 이상에서 OAuth/OpenID Connect 인증을 위한 공식 API, Safari 기반 인증을 실행하고, 로그인 후 앱으로 자동 복귀 가능
- 웹뷰(WebView): 네이티브 앱 내부에서 웹 페이지를 로드할 수 있도록 하는 임베디드 브라우저, 내부적으로 HTML, CSS, JavaScript로 구성된 웹 페이지를 렌더링, 웹 페이지가 포함되어 있기 때문에, 이를 처리하려면 컨텍스트(Context) 전환이 필요, Android에서는 WebView, iOS에서는 WKWebView 또는 UIWebView를 사용하여 구현

```
// 현재 사용 가능한 모든 컨텍스트 가져오기
const contexts = await driver.getContexts();

// 웹뷰 컨텍스트로 전환
await driver.switchContext(contexts.find(ctx => ctx.includes('WEBVIEW')));

// 웹 요소 조작
const webElement = await driver.findElement('css selector', '#login-button');
await webElement.click();

// 다시 네이티브 컨텍스트로 전환
await driver.switchContext('NATIVE_APP');
```

- 네이티브 뷰(Native View): 모바일 운영체제(Android/iOS)가 제공하는 네이티브 UI 컴포넌트를 의미하며, 운영체제의 UI 프레임워크(Android의 View, iOS의 UIKit)를 사용하여 렌더링된 화면, Appium에서는 네이티브 뷰 요소를 찾을 때 UiAutomator2 (Android)와 XCUITest (iOS) 엔진을 사용

```
// Android에서 네이티브 요소 찾기 (ID 사용)
const element = await driver.findElement('id', 'com.example.app:id/button');
await element.click();

// iOS에서 네이티브 요소 찾기 (Accessibility ID 사용)
const element = await driver.findElement('accessibility id', 'login_button');
await element.click();
```

### Execution Context(명시적 대기 조건 EC)

| 조건명                              | 설명                                                      |
| ----------------------------------- | --------------------------------------------------------- |
| **presenceOfElementLocated**        | 요소가 DOM에 존재할 때까지                                |
| **presenceOfAllElementsLocatedBy**  | 특정 요소가 여러 개 존재할 때까지                         |
| **visibilityOfElementLocated**      | 요소가 DOM에 존재하며 화면에 표시될 때까지                |
| **visibilityOf**                    | 주어진 요소가 화면에 표시될 때까지                        |
| **invisibilityOfElementLocated**    | 요소가 화면에서 사라질 때까지                             |
| **invisibilityOf**                  | 주어진 요소가 화면에서 사라질 때까지                      |
| **stalenessOf**                     | 요소가 더 이상 유효하지 않을 때까지                       |
| **elementToBeClickable**            | 요소가 클릭 가능해질 때까지                               |
| **elementToBeSelected**             | 요소가 선택될 때까지                                      |
| **elementSelectionStateToBe**       | 요소의 선택 상태가 특정 값과 일치할 때까지                |
| **numberOfElementsToBe**            | 특정 개수만큼 요소가 존재할 때까지                        |
| **numberOfElementsToBeMoreThan**    | 특정 개수보다 많아질 때까지                               |
| **numberOfElementsToBeLessThan**    | 특정 개수보다 적어질 때까지                               |
| **textToBePresentInElement**        | 특정 요소의 텍스트가 특정 값과 일치할 때까지              |
| **textToBePresentInElementLocated** | 특정 요소의 텍스트가 특정 값과 일치할 때까지              |
| **textToBePresentInElementValue**   | 특정 요소의 `value` 속성이 특정 값과 일치할 때까지        |
| **attributeToBe**                   | 특정 요소의 속성이 특정 값과 일치할 때까지                |
| **attributeContains**               | 특정 요소의 속성이 특정 값을 포함할 때까지                |
| **titleIs**                         | 현재 페이지의 제목이 특정 값과 일치할 때까지              |
| **titleContains**                   | 현재 페이지의 제목이 특정 값을 포함할 때까지              |
| **urlToBe**                         | 현재 URL이 특정 값과 일치할 때까지                        |
| **urlContains**                     | 현재 URL이 특정 값을 포함할 때까지                        |
| **frameToBeAvailableAndSwitchToIt** | 특정 프레임이 사용 가능해질 때까지                        |
| **numberOfWindowsToBe**             | 열린 브라우저 탭(윈도우) 개수가 특정 개수와 일치할 때까지 |
| **alertIsPresent**                  | 경고창(Alert)이 나타날 때까지                             |
| **and**                             | 여러 개의 조건을 모두 만족할 때까지                       |
| **or**                              | 여러 개의 조건 중 하나라도 만족하면 종료                  |
| **not**                             | 특정 조건이 충족되지 않을 때까지                          |

## TypeScript 학습

### TypeScript 기본 문법

### TypeScript 컴파일러(tsconfig)

### 클래스 & 인터페이스

### 고급 타입

### 제네릭

### 데코레이터

### 모듈 및 네임스페이스

## Playwright 학습

```PowerShell
# 모든 테스트 한 번에 실행
npx playwright test

# 특정 테스트 파일만 실행
npx playwright test tests/LoginTest.spec.ts
npx playwright test tests/LoginTest.spec.ts

# 테스트 결과 HTML 보고서 보기
npx playwright show-report
```

### Playwright 테스트 실행 및 기본 API

### Playwright의 요소 선택 및 조작

### Playwright에서의 비동기 처리 (async/await)

### Playwright 커스텀 설정 (playwright.config.ts)

### Playwright의 다양한 테스트 실행

### Playwright의 네트워크 요청 조작

### Playwright의 시각적 테스트 (UI 회귀 테스트)

### Playwright에서 Drag & Drop 테스트

### Playwright 성능 테스트 및 로깅

### Playwright CI/CD 환경 설정
