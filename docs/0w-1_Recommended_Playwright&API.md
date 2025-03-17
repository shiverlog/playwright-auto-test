###### - 민시우(2025/03/10) 작성 -

## 0w-1. 💡 Playwright & API 통합 테스트를 위한 도구 및 언어 제안

### [1] 🚀 테스트 자동화 툴 및 언어도입

#### `Playwright`

<p align="center">
  <img src="https://playwright.dev/img/playwright-logo.svg" width="50" />
</p>

1. Microsoft에서 개발한 오픈소스 웹 테스트 자동화 프레임워크로, 크로스 브라우저 테스트, 멀티탭, 모바일 시뮬레이션, 네트워크 인터셉트 등을 지원하는 강력한 기능을 제공한다.

2. 비동기(Async) 및 병렬 실행 기능을 활용하여 빠르고 안정적인 UI 및 API 테스트 수행이 가능하다.

#### `Node.js`

<p align="center">
  <img src="https://nodejs.org/static/images/logo.svg" width="50" />
</p>

1. Chrome V8 JavaScript 엔진을 기반으로 동작하는 서버 사이드 런타임으로, 브라우저 외부에서도 JavaScript를 실행할 수 있도록 지원한다. 특히 비동기(Asynchronous) 이벤트 기반(Non-blocking I/O) 모델을 사용하여 빠른 실행 속도와 확장성을 제공하며, 대량의 요청을 효율적으로 처리할 수 있다.

2. NPM (Node Package Manager)를 통해 다양한 라이브러리를 쉽게 설치할 수 있으며, 웹 서버(Node.js) + 프론트엔드(TypeScript) + 테스트 자동화(Playwright) 환경을 완벽하게 통합할 수 있다.

3. GitHub Actions, Jenkins, GitLab CI/CD 등과의 통합이 용이하여 CI/CD(Continuous Integration & Continuous Deployment) 파이프라인을 구축하기에 최적화된 환경을 제공한다.

#### `TypeScript`

<p align="center">
  <img src="https://www.typescriptlang.org/icons/icon-144x144.png" width="50" />
</p>

1. JavaScript(JS)를 기반으로 한 정적 타입 언어로, Microsoft에서 개발한 오픈소스 프로그래밍 언어이다.

2. TypeScript는 JS의 모든 기능을 포함하면서도, 정적 타입 검사(Static Type Checking)를 추가하여 코드 안정성과 유지보수성을 향상시킨다.

3. Interface & Type을 지원하여 데이터 및 함수의 구조를 명확하게 정의할 수 있어, 협업 및 유지보수성이 뛰어나며, 코드 리팩토링이 용이하다.

---

#### `언어 비교 (TS vs JS vs Python)`

<p align="center">
  <img src="https://www.typescriptlang.org/icons/icon-144x144.png" width="50" style="margin-right: 10px;" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" width="50" style="margin-right: 10px;" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" width="50" />
</p>

| 비교 항목             | TypeScript (TS)                         | JavaScript (JS)                  | Python                           |
| --------------------- | --------------------------------------- | -------------------------------- | -------------------------------- |
| Playwright 공식 지원  | ✅ 가장 강력한 지원                     | ✅ 최신 기능 지원                | 🟡 지원하지만 기능 제한적        |
| 테스트 실행 속도      | ✅ 빠름 (비동기 지원, 병렬 실행 최적화) | ✅ 빠름 (비동기 지원)            | 🟡 상대적으로 느림 (싱글 스레드) |
| 비동기 처리           | ✅ 완벽한 async/await 지원              | ✅ async/await 지원              | 🟡 asyncio 사용 가능하지만 느림  |
| 병렬 실행             | ✅ test.describe.parallel() 지원        | ✅ test.describe.parallel() 지원 | 🟡 느림 (pytest-xdist 필요)      |
| 타입 안정성           | ✅ 정적 타입 검사                       | ❌ 없음                          | ❌ 없음                          |
| 자동 완성 & IDE 지원  | ✅ 강력한 자동 완성                     | 🟡 지원하지만 부족               | 🟡 일부 IDE 지원                 |
| 코드 유지보수성       | ✅ 뛰어남                               | ❌ 어려움                        | 🟡 어려움                        |
| API 테스트 기능       | ✅ Playwright API 기능 내장             | ✅ Playwright API 기능 내장      | 🟡 requests 라이브러리 활용      |
| 모바일 웹 테스트 지원 | ✅ 완벽 지원                            | ✅ 완벽 지원                     | 🟡 제한적                        |
| CI/CD                 | ✅ 최적화                               | ✅ 최적화                        | 🟡 설정 필요, 실행 속도 느림     |

**결론:** TypeScript는 정적 타입 시스템을 제공하여 컴파일 단계에서 타입 오류를 방지하고, 유지보수성이 뛰어나므로 가장 적합하여, TypeScript로 진행한다.

---

#### `테스트 툴 비교 (Playwright vs Selenium vs Appium)`

<p align="center">
  <img src="https://playwright.dev/img/playwright-logo.svg" width="50" style="margin-right: 10px;" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Selenium_Logo.png" width="50" style="margin-right: 10px;" />
  <img src="https://proxyjobsupport.com/wp-content/uploads/2024/02/appium.png" width="50" />
</p>

| 비교 항목               | Playwright                   | Selenium                         | Appium                            |
| ----------------------- | ---------------------------- | -------------------------------- | --------------------------------- |
| 주요 목적               | 웹 UI 및 API 자동화 테스트   | 웹 UI 자동화 테스트              | 모바일 앱(UI, API) 자동화 테스트  |
| 지원 플랫폼             | ✅ 웹 (크로스 브라우저)      | ✅ 웹 (크로스 브라우저)          | ✅ 모바일 (iOS, Android)          |
| 지원 브라우저           | ✅ Chromium, Firefox, WebKit | ✅ Chrome, Firefox, Safari, Edge | ❌ (모바일 전용)                  |
| 비동기 실행             | ✅ async/await 기본 지원     | ❌ Explicit Wait 필요            | ❌ Explicit Wait 필요             |
| 테스트 실행 속도        | 🚀 빠름                      | ⏳ 느림                          | ⏳ 느림                           |
| 자동 대기(Auto Wait)    | ✅ 기본 제공                 | ❌ 명시적인 wait 필요            | ❌ 명시적인 wait 필요             |
| 병렬 테스트 실행        | ✅ --workers 옵션 지원       | ❌ Selenium Grid 필요            | ❌ Appium Grid 필요               |
| API 테스트 가능 여부    | ✅ 내장 API 테스트 지원      | ❌ 별도 라이브러리 필요          | ✅ 일부 네이티브 API 테스트 가능  |
| 네트워크 요청 차단/변경 | ✅ 지원                      | ❌ 불가능                        | ❌ 불가능                         |
| 모바일 디바이스 테스트  | ✅ 모바일 환경 시뮬레이션    | ❌ 불가능                        | ✅ 네이티브 모바일 앱 테스트 가능 |
| Docker 지원             | ✅ 기본 지원                 | ✅ Selenium Grid 필요            | ✅ Appium Grid 필요               |

**결론:** PC, 모바일 웹 테스트에는 Playwright가 적합하며, 네이티브 모바일 앱은 Appium이 더 적합할 수 있어서, APP은 Playwright 및 Appium 을 혼용하여 프로젝트를 진행하도록 하겠다.

---

### [2] 🆚 테스트 자동화를 위한 API 툴 비교

- Swagger: API의 설계, 문서화 및 검증을 위한 오픈소스 프레임워크로, RESTful API의 명세(Documentation) 및 클라이언트 SDK 자동 생성을 지원하는 표준이다
  <p align="center">
    <img src="https://swagger.io/docs/_astro/hero-img.CQIKAqF0_1585RE.webp"/>
  </p>

- Postman: API 테스트 및 자동화, 협업을 위한 강력한 도구로, 개발자가 API 요청을 쉽게 보내고 응답을 확인하며, Newman을 통해 테스트 자동화 및 CI/CD 연동을 지원한다
  <p align="center">
    <img src="https://voyager.postman.com/illustration/api-client-postman-screenshot-illustration.png"/>
  </p>

| 비교 항목                                 | Postman + Newman                                | Playwright API                          | Pytest                             | Swagger (OpenAPI)                        |
| ----------------------------------------- | ----------------------------------------------- | --------------------------------------- | ---------------------------------- | ---------------------------------------- |
| 주요 목적                                 | API 테스트 자동화 및 CI/CD 연동                 | UI + API 테스트 통합                    | Python 기반 API 테스트 자동화      | API 문서화 및 명세 관리                  |
| API 테스트 지원                           | ✅ 가능 (pm.test())                             | ✅ 가능 (request.get(), request.post()) | ✅ 가능 (requests, httpx 활용)     | ❌ 제한적 (Try it out 지원)              |
| Playwright 연계성                         | ✅ 가능 (Newman 활용)                           | ✅ Playwright 자체 API 테스트 가능      | ❌ 직접 연계 불가                  | ❌ 직접 연계 불가                        |
| CI/CD 연동                                | ✅ newman CLI 지원                              | ✅ npx playwright test 지원             | ✅ pytest 지원                     | ❌ API 문서 검증 용도로 활용             |
| Mock API 지원                             | ✅ Postman Mock Server 지원                     | ✅ Playwright route.fulfill() 지원      | ✅ pytest-mock, responses 지원     | ✅ Swagger Editor에서 Mock API 생성 가능 |
| 데이터 기반 테스트 지원                   | ✅ CSV, JSON 활용 가능                          | ✅ JSON 파일 및 .env 활용 가능          | ✅ pytest.parametrize 활용 가능    | ❌ 기능 없음                             |
| 테스트 리포트 지원                        | ✅ HTML, JSON, JUnit 리포트 지원                | ✅ playwright-report 지원               | ✅ pytest-html, Allure Report 지원 | ❌ 기본 제공 없음                        |
| Playwright UI + API 테스트 통합 가능 여부 | ✅ 가능 (npx playwright test && newman run ...) | ✅ 가능 (UI & API 테스트 통합 가능)     | ❌ 불가능                          | ❌ 불가능                                |

**결론:** Playwright 프로젝트에서 API 테스트를 실행하거나 통합 테스트를 수행할 경우, Postman+Newman 또는 Playwright API 툴이 가장 적합하여, 이 두 가지로 실습할 예정이다.

---

### [3] 🔍 참고 자료

- [Playwright 공식 문서](https://playwright.dev/docs/api-testing)
- [Node.js 공식 사이트](https://nodejs.org/)
- [TypeScript 공식 사이트](https://www.typescriptlang.org/)
- [Python 공식 사이트](https://www.python.org/)
- [Selenium 공식 사이트](https://www.selenium.dev/)
- [Appium 공식 사이트](https://appium.io/)
- [Postman 공식 사이트](https://www.postman.com/)
- [Newman 공식 GitHub](https://github.com/postmanlabs/newman)
- [Pytest 공식 문서](https://docs.pytest.org/en/stable/)
- [Swagger (OpenAPI) 공식 사이트](https://swagger.io/)
- [API Testing | Playwright](https://playwright.dev/docs/api-testing)
