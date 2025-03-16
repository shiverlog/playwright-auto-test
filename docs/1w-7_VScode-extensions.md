###### - 민시우(2025/03/10) 작성 -

## 1w-7. 🔰 VScode 튜토리얼

### [1] 📦 VScode 확장 프로그램 설치

```PowerShell
# GitHub Copilot - AI 기반 코드 자동 완성
code --install-extension GitHub.copilot

# ChatGPT - AI 기반 코드 자동 완성 및 최적화
code --install-extension chatgpt-vscode.chatgpt
code --install-extension CodedotAI.chatgpt-code

# GitHub Actions - CI/CD 파이프라인 관리
code --install-extension GitHub.vscode-github-actions

# Azure Pipelines - Azure DevOps 파이프라인 지원
code --install-extension ms-azure-devops.azure-pipelines

# YAML - 파일 편집 지원 (CI/CD, Kubernetes 설정에 유용)
code --install-extension redhat.vscode-yaml

# Docker - 컨테이너 관리 및 개발 지원
code --install-extension ms-azuretools.vscode-docker

# Material Icon Theme - VS Code 아이콘 테마 (Material 디자인 적용)
code --install-extension PKief.material-icon-theme

# indent-rainbow - 코드 들여쓰기 가독성 개선
code --install-extension oderwat.indent-rainbow

# GitLens - Git 변경 이력 및 Blame 기능 강화
code --install-extension eamodio.gitlens

# Git Graph - Git 브랜치 시각화
code --install-extension mhutchie.git-graph

# Error Lens - 코드 오류 및 경고를 한눈에 표시
code --install-extension usernamehw.errorlens

# Code Spell Checker - 코드 내 철자 오류 검사
code --install-extension streetsidesoftware.code-spell-checker

# Playwright - 테스트 자동화 지원
code --install-extension ms-playwright.playwright

# Playwright Test Explorer - VS Code 내 Playwright 테스트 실행 및 UI 결과 확인
code --install-extension krizzdewizz.playwright-test-explorer

# Playwright Test Runner - 테스트 실행 자동화
code --install-extension sakamoto66.vscode-playwright-test

# Playwright Helpers - Playwright 테스트 자동화 도우미
code --install-extension jaktestowac.playwright-helpers

# Playwright Snippets - Playwright 테스트 코드 자동완성
code --install-extension mkaufman.playwright-test-snippets

# VS Code 테스트 실행 UI 지원
code --install-extension ms-vscode.test-adapter
code --install-extension ms-vscode.test-adapter-converter

# Test Explorer UI - 다양한 테스트 프레임워크 실행 및 관리
code --install-extension hbenl.vscode-test-explorer

# Live Server - HTML, JS, CSS 실시간 미리보기
code --install-extension ritwickdey.LiveServer

# Jest - 테스트 코드 실행 및 디버깅
code --install-extension Orta.vscode-jest

# TypeScript Import Sorter 자동정렬
code --install-extension mika-perry.vscode-typescript-imports-sorter

# Appium Kit - Appium 환경 관리
code --install-extension SudharsanSelvaraj.appium-kit

# Appium Toolbox - Appium 서버 및 세션 관리
code --install-extension boneskull.appium-toolbox

# Appium Inspector - UI 요소 검사
code --install-extension thiyagu05.appium-inspector

# REST Client - VS Code 내에서 HTTP 요청 실행 가능
code --install-extension humao.rest-client

# Thunder Client - Postman 대체용 API 클라이언트
code --install-extension rangav.vscode-thunder-client

# Markdown 지원
code --install-extension yzhang.markdown-all-in-one

# TODO 및 FIXME 주석 하이라이트
code --install-extension gruntfuggly.todo-tree
```

---

### [2] ⚙️ Visual Code Tools 세팅

#### 📌 Visual Code 커스텀(.vscode)

###### - launch.json : Debug 및 Testing 실행 설정

###### - settings.json : 프로젝트별 VS Code 설정

###### - tasks.json : 자동화 작업 설정 (테스트 실행, 빌드 등)

###### - extensions.json : 확장 프로그램 정의

###### - keybindings.json : 커스텀 단축키 설정

###### - snippets/\*.code-snippets : 코드 자동 완성 설정

#### 📌 VS Code Debug 단축키 정리

| **기능**                         | **단축키**          | **설명**                                       |
| -------------------------------- | ------------------- | ---------------------------------------------- |
| **실행 (Start)**                 | `F5`                | Debug 버튼을 눌러 실행                         |
| **중지 (Stop)**                  | `Shift + F5`        | 디버깅 중지                                    |
| **다시 실행 (Restart)**          | `Ctrl + Shift + F5` | 디버깅을 처음부터 다시 실행                    |
| **다음 라인 실행 (Step Over)**   | `F10`               | 다음 코드 라인으로 이동 (함수 내부 실행 안 함) |
| **함수 내부 실행 (Step Into)**   | `F11`               | 현재 실행하는 함수 내부로 이동                 |
| **함수 실행 후 복귀 (Step Out)** | `Shift + F11`       | 함수 실행 후 호출한 위치로 복귀                |
| **브레이크포인트 추가/삭제**     | `F9`                | 특정 코드에서 멈추도록 설정                    |

###### - **`F10` (Step Over)**: 함수 내부로 들어가지 않고 다음 코드 실행

###### - **`F11` (Step Into)**: 함수 내부 코드까지 실행

###### - **`Shift + F11` (Step Out)**: 함수 실행 후 호출된 위치로 돌아감

#### 📌 VS Code 파일 및 탐색 관련 단축키 정리

| **기능**                  | **단축키 (Windows/Linux)** | **단축키 (Mac)**   | **설명**                        |
| ------------------------- | -------------------------- | ------------------ | ------------------------------- |
| **새 파일 생성**          | `Ctrl + N`                 | `Cmd + N`          | 새 파일을 생성                  |
| **파일 열기**             | `Ctrl + O`                 | `Cmd + O`          | 기존 파일을 열기                |
| **파일 저장**             | `Ctrl + S`                 | `Cmd + S`          | 현재 파일 저장                  |
| **다른 이름으로 저장**    | `Ctrl + Shift + S`         | `Cmd + Shift + S`  | 파일을 다른 이름으로 저장       |
| **모든 파일 저장**        | `Ctrl + K, S`              | `Cmd + Option + S` | 열린 모든 파일 저장             |
| **파일 탐색기 열기/닫기** | `Ctrl + B`                 | `Cmd + B`          | 파일 탐색기(사이드바) 열기/닫기 |
| **파일 간 이동**          | `Ctrl + Tab`               | `Cmd + Tab`        | 열린 파일 간 빠르게 이동        |

#### 📌 VS Code 편집 관련 단축키 정리

| **기능**                 | **단축키 (Windows/Linux)** | **단축키 (Mac)**         | **설명**                       |
| ------------------------ | -------------------------- | ------------------------ | ------------------------------ |
| **한 줄 삭제**           | `Ctrl + Shift + K`         | `Cmd + Shift + K`        | 현재 커서가 위치한 줄 삭제     |
| **한 줄 이동 (위/아래)** | `Alt + ↑ / ↓`              | `Option + ↑ / ↓`         | 현재 줄을 위/아래로 이동       |
| **한 줄 복사 (위/아래)** | `Shift + Alt + ↑ / ↓`      | `Shift + Option + ↑ / ↓` | 현재 줄을 위/아래로 복사       |
| **자동 줄 정렬**         | `Ctrl + Shift + L`         | `Cmd + Shift + L`        | 현재 선택한 코드 정렬          |
| **코드 포맷팅**          | `Shift + Alt + F`          | `Shift + Option + F`     | Prettier 또는 기본 포맷터 적용 |

#### 📌 VS Code 검색 및 찾기 관련 단축키 정리

| **기능**                  | **단축키 (Windows/Linux)** | **단축키 (Mac)**   | **설명**                            |
| ------------------------- | -------------------------- | ------------------ | ----------------------------------- |
| **현재 파일 내 검색**     | `Ctrl + F`                 | `Cmd + F`          | 현재 파일에서 특정 텍스트 검색      |
| **전체 프로젝트 내 검색** | `Ctrl + Shift + F`         | `Cmd + Shift + F`  | 워크스페이스 전체에서 텍스트 검색   |
| **찾기 및 바꾸기**        | `Ctrl + H`                 | `Cmd + Option + F` | 현재 파일에서 텍스트 찾기 및 바꾸기 |
| **모든 바꾸기**           | `Ctrl + Shift + H`         | `Cmd + Shift + H`  | 프로젝트 전체에서 텍스트 변경       |

#### 📌 VS Code 코드 탐색 및 이동 관련 단축키 정리

| **기능**                   | **단축키 (Windows/Linux)** | **단축키 (Mac)** | **설명**                          |
| -------------------------- | -------------------------- | ---------------- | --------------------------------- |
| **정의로 이동**            | `F12`                      | `F12`            | 함수/변수 정의로 이동             |
| **새 탭에서 정의 열기**    | `Ctrl + F12`               | `Cmd + F12`      | 새로운 탭에서 정의 열기           |
| **참조 찾기**              | `Shift + F12`              | `Shift + F12`    | 현재 선택한 요소의 모든 참조 검색 |
| **라인 번호로 이동**       | `Ctrl + G`                 | `Cmd + G`        | 특정 라인 번호로 이동             |
| **Quick Open (파일 열기)** | `Ctrl + P`                 | `Cmd + P`        | 파일명 검색하여 빠르게 열기       |

#### 📌 VS Code 터미널 및 실행 관련 단축키 정리

| **기능**              | **단축키 (Windows/Linux)** | **단축키 (Mac)**  | **설명**                      |
| --------------------- | -------------------------- | ----------------- | ----------------------------- |
| **터미널 열기/닫기**  | `Ctrl + ~`                 | `Cmd + ~`         | VS Code 내장 터미널 열기/닫기 |
| **새 터미널 창 열기** | `Ctrl + Shift + ~`         | `Cmd + Shift + ~` | 새로운 터미널 창 열기         |
| **명령 팔레트 열기**  | `Ctrl + Shift + P`         | `Cmd + Shift + P` | 모든 명령어 검색 및 실행      |

#### 📌 VS Code Git 및 소스 컨트롤 관련 단축키 정리

| **기능**                    | **단축키 (Windows/Linux)** | **단축키 (Mac)**      | **설명**                |
| --------------------------- | -------------------------- | --------------------- | ----------------------- |
| **소스 컨트롤 열기**        | `Ctrl + Shift + G`         | `Cmd + Shift + G`     | Git 패널 열기           |
| **커밋 (메시지 입력 후)**   | `Ctrl + Enter`             | `Cmd + Enter`         | Git 커밋                |
| **변경 사항 Stage/Unstage** | `Ctrl + Shift + Enter`     | `Cmd + Shift + Enter` | Git 변경 사항 Staging   |
| **Git 변경 사항 보기**      | `Alt + ← / →`              | `Option + ← / →`      | Git 변경 파일 사이 이동 |
