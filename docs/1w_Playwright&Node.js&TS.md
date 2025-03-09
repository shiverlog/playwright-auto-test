# 1W. Playwright & Node.js & TS 학습

## 개발툴 및 Node.js 언어 설치
- Visual Code : https://code.visualstudio.com/download
- Node JS : https://nodejs.org/ko/download


## 가이드
- Typescript 가이드 : https://www.typescriptlang.org/
- Playwright 가이드 : https://playwright.dev/docs/intro
- Selenium 가이드 : https://www.selenium.dev/documentation/
- Appium 가이드 : https://appium.io/docs/en/latest/
- Docker hub : https://hub.docker.com/


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

## Appium 학습

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
