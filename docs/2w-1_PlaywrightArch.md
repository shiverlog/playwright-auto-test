###### - 민시우(2025/03/10) 작성 -

## 2w-1. 🏗️ Playwright Architecture 설계

### [1] 전체 프로젝트 트리 구조

```
PLAYWRIGHT-AUTO-TEST
├── 📂 .github              # GitHub 관련 워크플로우 및 액션 설정
├── 📂 .husky               # Git pre-commit 및 pre-push 훅 관리
├── 📂 .vscode              # VS Code 프로젝트 설정 파일
├── 📂 batch                # 배치 작업 관련 코드 (예: 크론잡, 스케줄링)
├── 📂 common               # 공통 유틸리티, 헬퍼 함수, 공용 모듈 등
├── 📂 docs                 # 프로젝트 문서화 폴더 (README, API 문서 등)
├── 📂 e2e                  # E2E(End-to-End) 테스트 스크립트 모음
├── 📂 example              # Playwright 테스트 예제 또는 샘플 코드
├── 📂 mosaic-db            # 데이터베이스 관련 코드 (마이그레이션, 스키마 등)
├── 📂 node_modules         # npm 패키지들이 설치되는 폴더 (자동 생성)
├── 📂 playwright-report    # Playwright 실행 후 생성되는 리포트 폴더
├── 📂 pubsub               # Pub/Sub 메시징 관련 코드
├── 📂 speedtest            # 성능 테스트 관련 스크립트
├── 📂 test-results         # 테스트 결과 저장 폴더
├── 📂 tests                # 테스트 코드 (Playwright + Jest 등)
│   ├── 📂 tests-examples   # 테스트 예제 모음
├── 📂 zas-is               # 특정 모듈 혹은 서비스 관련 코드 (추가 설명 필요)
├── 📄 .env                 # 환경 변수 설정 파일
├── 📄 .eslintignore        # ESLint 무시할 파일 및 폴더 지정
├── 📄 .eslintrc.json       # ESLint 코드 스타일 및 규칙 설정
├── 📄 .gitignore           # Git에서 제외할 파일 목록
├── 📄 .prettierrc.json     # Prettier 코드 포맷팅 규칙
├── 📄 dependencies.json    # 프로젝트 의존성 정보 (설정이 별도 분리된 경우)
├── 📄 docker-compose.base.yml  # Docker Compose 기본 설정
├── 📄 docker-compose.yml   # Docker Compose 설정 (멀티 컨테이너 구성)
├── 📄 Dockerfile           # Docker 컨테이너 빌드 설정
├── 📄 package-lock.json    # npm 패키지 버전 잠금 파일
├── 📄 package.json         # 프로젝트 종속성 및 스크립트 관리 파일
├── 📄 playwright.config.ts # Playwright 테스트 설정 파일
└── 📄 tsconfig.json        # TypeScript 프로젝트 설정
```

### [2] 프로젝트 구조 분석

📂 `.github/` - GitHub Actions 및 CI/CD 설정 디렉토리

- GitHub Actions 관련 파일 저장
- 자동화된 Playwright 테스트 실행을 위한 CI/CD 파이프라인 설정

```
.github
└── 📂 workflows          # GitHub Actions 관련 CI/CD 워크플로우
    ├── cd.yml             # Continuous Deployment (CD) 설정
    ├── ci.yml             # Continuous Integration (CI) 설정
    ├── main.yml           # 메인 브랜치 관련 GitHub Actions 워크플로우
    ├── node.js.yml        # Node.js 관련 빌드 및 테스트 설정
    ├── playwright.yml     # Playwright 테스트 자동화 관련 설정
    ├── CODEOWNERS         # 코드 소유자 지정 파일 (PR 검토자 자동 지정)
    └── dependabot.yml     # Dependabot 설정 파일 (패키지 및 의존성 자동 업데이트)

```

📂 `.vscode/` - Visual Code 설정 디렉토리

```
.vscode
└── 📂 snippets           # VS Code 코드 스니펫 관련 설정
    ├── extensions.json    # 프로젝트에서 사용하는 VS Code 확장 프로그램 목록
    ├── keybindings.json   # 키 바인딩 설정
    ├── launch.json        # 디버깅 설정 (Run/Debug 설정)
    ├── settings.json      # 사용자 지정 VS Code 설정
    └── tasks.json         # VS Code에서 실행할 작업(task) 설정
```

📂 `batch/` - 배치 스크립트 디렉토리

- Playwright 테스트 실행을 자동화하는 스크립트 저장
- CI/CD 또는 로컬 테스트 실행을 위한 Shell/Bash 스크립트 포함

```
batch
├── 📂 batch_result               # 배치 작업 결과 저장 폴더
├── 📂 jobs                       # 배치 작업 실행 관련 폴더
│   └── 📂 tasks                  # 개별 배치 작업 스크립트 모음
│       ├── automation.sh          # 자동화 실행 스크립트 (셸 스크립트)
│       ├── git_clone.sh           # Git 저장소 클론하는 스크립트
│       ├── slack_message_send.bat # Slack 메시지 전송 (Windows용)
│       ├── slack_upload.bat       # Slack에 파일 업로드 (Windows용)
│       ├── sub.bat                # 서브 배치 작업 (Windows용)
│   ├── batchRunner.ts             # 배치 작업을 실행하는 TypeScript 코드
├── Dockerfile                     # 배치 작업을 컨테이너화하는 Docker 설정 파일
└── package.json                   # 프로젝트 종속성 및 실행 스크립트 관리 파일
```

📂 `common/` - 공통 유틸리티 및 설정 디렉토리

- Playwright 테스트에서 재사용되는 코드 및 설정 관리
- API 호출, 데이터 처리, 공통 컴포넌트 포함

```
common
├── 📂 config                # 설정 파일을 관리하는 폴더
├── 📂 constants             # 프로젝트 전역에서 사용하는 상수 정의
├── 📂 formatters            # 데이터 포맷 변환 및 정규화 관련 모듈
├── 📂 handlers              # 이벤트 또는 요청 핸들러 모듈
├── 📂 locators              # Playwright/테스트에서 사용하는 요소 위치 정보
├── 📂 logger                # 로깅 관련 모듈
├── 📂 notifications         # 알림(이메일, 슬랙 등) 관련 모듈
├── 📂 utils                 # 공통적으로 사용하는 유틸리티 함수 모음
├── Dockerfile               # 공통 모듈을 컨테이너로 실행하기 위한 설정 파일
├── index.ts                 # 공통 모듈의 엔트리포인트 (내보내기 및 관리)
└── package.json             # 공통 모듈의 종속성 및 실행 스크립트 관리
```

📂 `docs/` - 문서 및 가이드 디렉토리

- 프로젝트 관련 문서 보관 (설치 방법, API 문서, 테스트 전략 등)

📂 `e2e` - E2E 테스트 관련 디렉토리

- Playwright의 E2E(End-to-End) 테스트를 관리하는 폴더
- 각 플랫폼 또는 환경별로 테스트를 분리하여 관리.

```
e2e
├── 📂 pc-web         # PC 웹 테스트 스크립트
├── 📂 mobile-web     # 모바일 웹 테스트 스크립트
├── 📂 android        # Android E2E 테스트 스크립트
├── 📂 ios            # iOS E2E 테스트 스크립트
└── 📂 api            # API 테스트 스크립트
```

| 폴더명        | 설명                                          |
| ------------- | --------------------------------------------- |
| `pc-web/`     | PC(데스크톱) 환경 E2E 테스트                  |
| `mobile-web/` | Mobile Web(모바일웹) E2E 테스트               |
| `android/`    | Android OS 기반 E2E 테스트                    |
| `ios/`        | iOS 기반 E2E 테스트                           |
| `api/`        | API 테스트 (Playwright의 `request` 객체 사용) |

📂 `pubsub/` - 메시지 발행(publish) 및 구독(subscribe) 관련 로직 및 서비스가 포함된 디렉토리

📂 `mosaic-db/` - 데이터베이스 연동 및 관리 로직을 담은 디렉토리

📂 `node_modules/` - 패키지 종속성

- `npm install`로 설치된 모든 Node.js 패키지가 저장됨
- node_modules은 중첩된 구조를 갖지 않고, 최상위로 가능한 한 모든 패키지를 올려서(호이스팅해서) 중복을 최소화함

📂 `tests/` - 테스트 케이스 저장

- Playwright 테스트 코드가 저장되는 메인 폴더

📂 주요 개별 파일

- `.env`: 환경 변수 설정 파일. API 키, DB 정보 등 민감한 데이터를 관리
- `.eslintignore`: ESLint가 무시할 파일 및 폴더 지정
- `.eslintrc.json`: ESLint 코드 스타일 및 규칙 설정
- `.gitignore`: Git에서 추적하지 않을 파일 및 폴더 목록
- `.prettierrc.json`: Prettier 코드 포맷팅 스타일 설정
- `dependencies.json`: 프로젝트 의존성 관련 정보 (추가적인 패키지 관리용)
- `docker-compose.base.yml`: 기본적인 Docker Compose 설정 (공통 베이스)
- `docker-compose.yml`: Docker Compose 설정 파일 (컨테이너 오케스트레이션)
- `Dockerfile`: 애플리케이션을 Docker 컨테이너로 빌드하기 위한 설정
- `package-lock.json`: 프로젝트 종속성 버전 고정 파일 (자동 생성)
- `package.json`: 프로젝트 종속성 및 실행 스크립트 관리 파일
- `playwright.config.ts`: Playwright 테스트 설정 파일 (브라우저, 타임아웃 등 설정)
- `tsconfig.json`: TypeScript 컴파일러 옵션 설정 파일
