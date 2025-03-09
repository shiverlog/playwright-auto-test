# 2W. Playwright Architecture 설명

## 전체 프로젝트 트리 구조
```
PLAYWRIGHT-AUTO-TEST/
├── .github/                 # GitHub Actions 및 CI/CD 설정 폴더
│   └── workflows/           # GitHub Actions 자동화 워크플로우
│       ├── cd.yml           # Continuous Deployment (CD) - 배포 자동화
│       ├── ci.yml           # Continuous Integration (CI) - 테스트 및 빌드 실행
│       ├── main.yml         # 모든 CI/CD 작업을 통합 실행
│       ├── node.js.yml      # Node.js 환경에서 실행 테스트
│       └── playwright.yml   # Playwright E2E 테스트 실행
│
├── .vscode/                 # VS Code 프로젝트 설정 폴더
│   ├── launch.json          # Playwright 디버깅 및 실행 설정
│   ├── settings.json        # VS Code 개발 환경 설정
│   ├── extensions.json      # 필수 VS Code 확장 추천 목록
│   └── tasks.json           # 자동화된 빌드 및 실행 작업 설정
│
├── batch/                   # Playwright 테스트 실행 자동화 배치 스크립트
│   ├── batch_result/        # 배치 실행 결과 로그 저장
│   ├── config/              # 배치 관련 설정
│   ├── jobs/                # 배치 작업 관리
│   ├── tasks/               # 개별 배치 작업 스크립트 (테스트 실행, Slack 알림 등)
│   └── package.json         # Node.js 배치 작업용 패키지 관리
│
├── common/                  # 공통 유틸리티 및 설정 모음
│   ├── constants/           # 상수 값 관리
│   ├── error/               # 에러 처리 관련 코드
│   ├── formatters/          # 데이터 포맷 관련 유틸리티
│   ├── logger/              # 로그 기록 및 저장 기능
│   ├── notifications/       # Slack, Teams 등의 알림 기능
│   ├── utils/               # Playwright 테스트용 공통 함수 모음
│   ├── .env                 # 환경 변수 파일
│   ├── .eslintignore        # ESLint 제외 파일 설정
│   ├── .eslintrc.ts         # ESLint 코드 스타일 설정
│   └── requirements.txt     # 필요한 패키지 목록
│
├── docs/                    # 프로젝트 관련 문서 및 가이드
│   ├── 1w_Playwright&Node.js&TS.md  # Playwright + Node.js + TypeScript 학습 문서
│   ├── 2w_PlaywrightArch.md         # Playwright 아키텍처 및 구조 설명
│   ├── 3w_Modularization.md         # Playwright 코드 모듈화 가이드
│   ├── 4w_POC.md                    # POC(Proof of Concept) 진행 문서
│   ├── 5w_Dockerizing.md             # Playwright Docker 적용 및 컨테이너화
│   └── README.md                     # 문서 개요 및 프로젝트 설명
│
├── e2e-aos/                # Android OS 환경 Playwright E2E 테스트
├── e2e-api/                # API 테스트 (Playwright의 `request` 기능 활용)
├── e2e-ios/                # iOS 환경 Playwright E2E 테스트
├── e2e-mw/                 # 모바일 웹 환경 Playwright E2E 테스트
├── e2e-pc/                 # PC 환경 Playwright E2E 테스트
│   ├── config/             # Playwright 환경 설정 파일
│   ├── logs/               # 테스트 실행 로그 저장
│   ├── src/                # 테스트 코드 및 관련 모듈
│   ├── tests/              # Playwright 테스트 케이스
│   ├── playwright.config.ts # Playwright 설정 파일
│   ├── tsconfig.json       # TypeScript 설정 파일
│   └── requirements.txt    # 필요한 패키지 목록
│
├── example/                # Playwright 테스트 예제 코드
├── mosaic-db/              # 데이터베이스 관련 설정 및 스크립트
├── node_modules/           # 프로젝트의 모든 패키지 종속성 (npm install 실행 후 생성됨)
├── pubsub/                 # 메시지 큐 (Kafka, RabbitMQ 등) 관련 테스트
├── sample/                 # 샘플 테스트 및 코드 저장소
├── tests/                  # Playwright E2E 테스트 케이스 저장소
├── tests-examples/         # Playwright 테스트 예제 코드 저장소
├── zas-is/                 # 특정 서비스나 기능 관련 코드
│
├── .gitignore              # Git에서 제외할 파일 목록 설정
├── docker-compose.yml      # Docker 환경 구성 및 컨테이너 설정
└── package-lock.json       # 프로젝트 의존성 버전 고정 및 관리 파일
```
## 프로젝트 구조 분석

### 📂 `.github/` - GitHub Actions 및 CI/CD 설정 디렉토리
- **GitHub Actions 관련 파일 저장**
- **자동화된 Playwright 테스트 실행을 위한 CI/CD 파이프라인 설정**
```
.github/
└── workflows/
    ├── cd.yml               # Continuous Deployment (CD) - 배포 자동화
    ├── ci.yml               # Continuous Integration (CI) - 테스트 및 빌드 실행
    ├── main.yml             # 메인 Workflow - 모든 CI/CD 작업을 통합 실행
    ├── node.js.yml          # Node.js 환경에서 실행 테스트 (다중 버전 지원 가능)
    └── playwright.yml       # Playwright E2E 테스트 실행
```

### 📂 `.vscode/` - Visual Code 설정 디렉토리
```
.vscode/
├── launch.json              # Playwright 디버깅 및 실행 설정
├── settings.json            # VS Code 개발 환경 설정 (ESLint, 자동 저장 등)
├── settings-desc.json       # VS Code 개발 환경 설정 (ESLint, 자동 저장 등)
├── extensions.json          # 프로젝트 필수 VS Code 확장 추천 목록
└── tasks.json               # 자동화된 빌드 및 실행 작업 설정 (선택적)
```

### 📂 `batch/` - 배치 스크립트 디렉토리
- **Playwright 테스트 실행을 자동화하는 스크립트 저장**
- **CI/CD 또는 로컬 테스트 실행을 위한 Shell/Bash 스크립트 포함**
```
batch/
├── batch_result/                 # 배치 실행 결과 로그 저장
│   └── batch_pc_250307.log       # 특정 날짜의 실행 로그 파일
│
├── config/                        # 배치 관련 설정
│   └── config.ts                  # 설정 파일 (TypeScript)
│
├── jobs/                          # (추가 폴더, 기능이 명확하지 않음)
│   ├── tasks/                         # 개별 배치 작업 스크립트
│   │   ├── automation_test.bat        # Playwright 자동화 테스트 실행
│   │   ├── git_clone.sh               # Git 리포지토리 클론 (Bash)
│   │   ├── slack_logger_upload.bat    # Slack 로그 업로드
│   │   ├── slack_message_send.bat     # Slack 메시지 전송
│   │   └── slack_screenshot_upload.bat# Slack 스크린샷 업로드
│   │
│   └── batch-runner.ts                        # 개별 배치 작업 스크립트
│
└── package.json                    # Node.js 종속성 및 스크립트 관리
```

### 📂 `common/` - 공통 유틸리티 및 설정 디렉토리
- **Playwright 테스트에서 재사용되는 코드 및 설정 관리**
- **API 호출, 데이터 처리, 공통 컴포넌트 포함**
```
common/
├── constants/                # 상수 값 관리
├── error/                    # 에러 처리 관련 코드
├── formatters/               # 데이터 포맷팅 관련 함수
├── logger/                   # 로깅 기능 (로그 저장 및 출력)
│
├── notifications/            # 알림 기능 (Slack, Teams 등)
│   ├── slack/                # Slack 알림 전송 모듈
│   ├── teams/                # Microsoft Teams 알림 모듈
│
├── utils/                    # 유틸리티 함수 모음
│   ├── elementActions.ts     # Playwright 요소 조작 함수
│   ├── pageUtils.ts          # 페이지 관련 유틸리티
│   ├── resultSender.ts       # 결과 전송 기능
│   ├── testPerformance.ts    # 테스트 성능 측정 기능
│   ├── variableExport.ts     # 변수 내보내기 관련 함수
│   ├── waitUtils.ts          # 대기 관련 유틸리티 (`waitForSelector` 등)
│
├── .env                      # 환경 변수 파일
├── .eslintignore             # ESLint 무시할 파일 설정
├── .eslintrc.ts              # ESLint 설정 파일
└── requirements.txt          # 필요한 패키지 목록 (Python 환경일 가능성 있음)
```

### 📂 `docs/` - 문서 및 가이드 디렉토리
- **프로젝트 관련 문서 보관 (설치 방법, API 문서, 테스트 전략 등)**
```
docs/
├── 1w_Playwright&Node.js&TS.md   # 1주차 - Playwright + Node.js + TypeScript 학습
├── 2w_PlaywrightArch.md          # 2주차 - Playwright 아키텍처 및 구조
├── 3w_Modularization.md          # 3주차 - Playwright 코드 모듈화 및 구조 개선
├── 4w_POC.md                     # 4주차 - POC(Proof of Concept) 진행 내용
├── 5w_Dockerizing.md              # 5주차 - Playwright Docker 적용 및 컨테이너화
└── README.md                     # 문서 개요 및 프로젝트 가이드
```

### 📂 `e2e-*` - E2E 테스트 관련 디렉토리
- **Playwright의 E2E(End-to-End) 테스트를 관리하는 폴더**
- **각 플랫폼 또는 환경별로 테스트를 분리하여 관리.**
```
e2e-poc/
├── config/                      # Playwright 설정 폴더
│   └── config.ts                # 테스트 환경 설정 파일
│
├── logs/                        # 테스트 실행 로그 저장 폴더
│   └── playwright_pc_250307.log  # Playwright 테스트 실행 로그
│
├── src/                         # 테스트 코드 및 구성 요소
│   ├── components/              # 재사용 가능한 UI 컴포넌트
│   ├── constants/               # 상수 값 저장 (e.g., URL, Timeout 등)
│   ├── fixtures/                # Playwright Fixtures (테스트 데이터, 설정)
│   ├── locators/                # 요소 선택자 (XPath, CSS Selector 등)
│   ├── pages/                   # Page Object Model (POM) - 페이지 정의
│   │   ├── loginPage.ts         # 로그인 페이지 요소 및 기능 정의
│   │   ├── mainPage.ts          # 메인 페이지 요소 및 기능 정의
│   ├── steps/                   # 테스트 스텝 정의 (비즈니스 로직)
│   │   ├── loginSteps.ts        # 로그인 관련 액션 정의
│   │   └── mainSteps.ts         # 메인 페이지 관련 액션 정의
│
├── tests/                       # Playwright 테스트 스크립트 폴더
│
├── .gitignore                   # Git에 포함하지 않을 파일 설정
├── playwright.config.ts         # Playwright 설정 파일
├── requirements.txt             # 필요한 패키지 목록 (Python 또는 npm 모듈)
└── tsconfig.json                # TypeScript 설정 파일
```

| 폴더명 | 설명 |
|--------|------|
| `e2e-pc/` | PC(데스크톱) 환경 E2E 테스트 |
| `e2e-mw/` | Mobile Web(모바일웹) E2E 테스트 |
| `e2e-aos/` | Android OS 기반 E2E 테스트 |
| `e2e-ios/` | iOS 기반 E2E 테스트 |
| `e2e-api/` | API 테스트 (Playwright의 `request` 객체 사용) |

### 📂 `pubsub/` - 메시지 발행(publish) 및 구독(subscribe) 관련 로직 및 서비스가 포함된 디렉토리

### 📂 `mosaic-db/` - 데이터베이스 연동 및 관리 로직을 담은 디렉토리

### 📂 `node_modules/` - 패키지 종속성
- **`npm install`로 설치된 모든 Node.js 패키지가 저장됨**
- node_modules은 중첩된 구조를 갖지 않고, 최상위로 가능한 한 모든 패키지를 올려서(호이스팅해서) 중복을 최소화함

### 📂 `tests/` - 테스트 케이스 저장
- **Playwright 테스트 코드가 저장되는 메인 폴더**

### 📂 `tests-examples/` - 테스트 예제
- **Playwright 테스트 예제 코드 저장**

### 📂 주요 개별 파일
- **`.gitignore`** → Git에 포함되지 않을 파일 목록 설정
- **`docker-compose.yml`** → Docker를 사용한 환경 구성 설정
- **`package-lock.json`** → 설치된 패키지 버전 고정