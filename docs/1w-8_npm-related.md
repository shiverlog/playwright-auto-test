###### - 민시우(2025/03/10) 작성 -

## 1w-8. ⚙️ NPM 의존성 및 설치 모듈

### [1] NPM 의존성 및 모듈 관리 개념 정리

1. NPM(Node Package Manager)은 JavaScript 패키지를 관리하는 도구로, `package.json`을 기반으로 프로젝트의 의존성을 정의하고 관리한다.

- **의존성(Dependencies)**: 프로젝트에서 필요한 라이브러리 및 패키지 모음. `package.json`에 정의된다.
- **개발 의존성(DevDependencies)**: 개발 과정에서만 필요한 패키지(예: 테스트, 빌드 도구). `--save-dev` 옵션으로 추가된다.
- 동일한 패키지를 여러 모듈에서 사용할 경우, NPM이 이를 어떻게 로드할지 결정하는 것이 `npm 호이스팅(Hoisting)` 개념이다.
- Hoisting(호이스팅)이란 중복된 패키지를 `node_modules` 루트 경로로 끌어올려 재사용하는 메커니즘을 의미한다.

2. NPM 패키지 의존성 정리 파일
<p align="center">
  <img src="https://miro.medium.com/v2/resize:fit:2000/1*xVArhwHrhwXoBPWlJTGM4g.png"/>
</p>
<p align="center">
  <img src="https://velog.velcdn.com/images/woogur29/post/08b9765b-c066-40e4-a083-3db17f3e4557/image.webp"/>
</p>

- dependencies.json: 프로젝트에서 사용하는 패키지들의 의존성 목록을 JSON 형식으로 정리한 파일로, 특정 환경에서 의존성을 수동으로 관리하거나, 다른 프로젝트에서 동일한 패키지 리스트를 활용할 때 사용된다.
- package.json: 프로젝트의 메타데이터 및 의존성을 정의하는 핵심 파일로, 패키지 이름, 버전, 스크립트, 의존성 목록을 포함한다.
- package-lock.json: `package.json`의 의존성 트리를 고정하여 일관된 패키지 버전을 유지하는 역할이며, npm install 시 해당 파일이 있으면, 정확한 버전을 설치하여 패키지 일관성을 유지한다.

---

### [2] NPM 모듈 설치

#### `Root`

```PowerShell
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

# Node.js 기반의 패키지 매니저 설치
npm install -g pnpm

# Dotenv 환경변수 라이브러리
npm install dotenv

# ESLint 및 코드 스타일링
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-prettier prettier eslint-plugin-import

# Husky 설치 및 초기화 (Git Hooks 설정을 위한 기본 환경 구성)
npx husky-init && npm install

# lint-staged 설치 (커밋 시 변경된 파일만 대상으로 린트 실행)
npm install --save-dev lint-staged

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
npm i --save-dev @types/nodemailer

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

# Vite
npm install -D vite

# Playwright 테스트 리포트 추가
npm install --save-dev playwright-html-reporter

# Mock API 활용
npm install --save-dev @playwright/experimental-ct-react

# CSV, JSON, YAML 데이터 처리
npm install csv-parser json2csv js-yaml --save-dev

# 환경 변수 보안 및 설정 관리
npm install cross-env dotenv-safe --save-dev

# 테스트 실행 최적화 및 CI/CD 개선
npm install --save-dev wait-on start-server-and-test

# Docker 환경에서 Playwright 실행
npm install --save-dev playwright-docker

# UI 테스트 코드 자동 생성 및 다양한 assertion 지원
npm install --save-dev playwright-test-generator testcafe chai chai-as-promised

# 네트워크 분석 및 API 테스트
npm install --save-dev mitmproxy

# 데이터 시각화 및 리포팅 강화
npm install --save-dev mochawesome

# commitizen 설치
pnpm install -D commitizen cz-customizable
```

`NPM 명령어`

```sh
# 스크립트 실행 제한을 해제

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
Set-ExecutionPolicy RemoteSigned

# node_modules 경로 확인
npm root

# depedencies.json 안의 패키지 node_modules 에 저장
Get-Content dependencies.json

# node_modules 안의 패키지 dependencies.json 저장
npm list --depth=0 --json > dependencies.json

# TypeScript 컴파일
npx tsc

# 프록시 설정 확인
npm config get proxy
npm config get https-proxy

# 기존 설치 파일 정리(module 꼬였을 때)
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force

# 프로젝트의 의존성을 설치할 때, peerDependencies 관련 충돌을 무시하고 설치 진행
npm install --legacy-peer-deps

# 모든 사용자(Everyone)에게 해당 폴더 및 하위 폴더에 대한 전체 제어 권한 부여
icacls "E:\playwright-auto-test" /grant Everyone:F /T

# 인증 무시하고 playwright install
NODE_TLS_REJECT_UNAUTHORIZED=0 npx playwright install
```

`speedtest`

```sh
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

# OpenCV4NodeJS 설치
npm install opencv4nodejs --build-from-source

# node 재설치(package.json을 기준)
npm install
```

---

### [3] 🔍 NPM 참고자료

##### 공식 문서 및 가이드

- [NPM 공식 문서](https://docs.npmjs.com/)
- [Node.js 공식 문서](https://nodejs.org/en/docs/)

##### 패키지 관리 및 의존성

- [package.json 공식 문서](https://docs.npmjs.com/cli/v9/configuring-npm/package-json)
- [package-lock.json 공식 문서](https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json)
- [NPM Semantic Versioning (버전 관리)](https://semver.org/)

##### NPM 명령어 및 활용법

- [NPM CLI 명령어 목록](https://docs.npmjs.com/cli/v9/commands)
- [NPM 스크립트 활용하기](https://docs.npmjs.com/cli/v9/using-npm/scripts)

##### NPM 호이스팅 및 모노레포 관리

- [NPM Workspaces (모노레포 지원)](https://docs.npmjs.com/cli/v9/using-npm/workspaces)
- [NPM Hoisting (의존성 호이스팅 개념)](https://classic.yarnpkg.com/en/docs/selective-hoisting/)

##### 패키지 보안 및 취약점 관리

- [NPM Audit (보안 취약점 검사)](https://docs.npmjs.com/cli/v9/using-npm/audit)
- [Snyk - NPM 보안 분석 도구](https://snyk.io/)

##### Docker와 NPM 연동

- [Docker에서 Node.js 및 NPM 실행](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [docker-compose를 활용한 NPM 프로젝트 관리](https://docs.docker.com/compose/)
