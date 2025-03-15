# 0w-3. 🎭 Playwright 로 자동화테스트 프로젝트를 리펙토링하여야 하는 이유

### [1] 🤖 자동화 테스트 목표 설정

`단위테스트(Unit Test)`

단위테스트(Unit Test): 레이어 단위(Controller, Service, Repository, Hook) 또는 특정 클래스에 대해서 정상적으로 동작하는지 확인하는 테스트로 개발 단에서 담당한다.

- 개별 함수, 메서드, 클래스, 컴포넌트 등을 독립적으로 검증하다.
- 테스트 실행 속도가 빠르고, 작은 코드 변경에도 바로 검증할 수 있다.

- 예시: Junit, Pytest, Jest, Supertest, RTL(React Testing Library)

`E2E테스트(End To End Test)`

E2E(End-to-End) 테스트는 애플리케이션의 전체적인 사용자 플로우를 검증하는 테스트 방식으로, 자동화 테스터는 애플리케이션의 모든 기능이 올바르게 작동하는지 확인하고, 테스트 자동화를 구축하는 역할을 한다.

- **테스트 시나리오 설계:** 실제 사용자 플로우를 기반으로 E2E 테스트 시나리오를 작성
- **테스트 환경 구성:** CI/CD 파이프라인과 연동하여 자동화 실행 (Jenkins, GitHub Actions 등)
- **테스트 실행 및 결과 분석:** 자동화된 E2E 테스트를 실행하고 로그 및 리포트를 분석
- **리그레이션 유지보수:** 버그 리포팅 및 개선
- **브라우저 및 모바일 환경 테스트:** POC(PC, MW, And, iOS)

- 예시: Playwright, Pytest, Selenium, Appium

---

### [2] 🔄 기존 Python + Selenium/Appium 기반 프로젝트의 문제점

기존의 Selenium, Appium 으로 구축된 **AS-IS 프로젝트에서 Playwright를 기반한 자동화 프로젝트로 TO-BE** 하는 이유는 다음과 같다.

1. 병렬 실행 불가능 및 테스트 독립성 부족

   - TC(Test Case)별 단일 메서드에 모든 검증 로직이 포함되어 있어 코드 재사용이 어렵다.
   - Pytest의 fixture, parametrize 등의 기능을 활용하기 어려운 구조로, 모듈화를 적용하기 위해 대대적인 리팩토링이 필요하다.
   - 테스트 간 의존성이 발생하고 각 테스트가 독립적으로 실행되지 않아, **병렬 실행 및 도커라이징(Dockerization)** 에 적합하지 않다.
   - 이로 인해 테스트 실행 시간이 길어지고, 특정 테스트만 개별적으로 실행하거나 선택적으로 수행하는 기능이 제한되며, CI/CD 환경에서 빠른 피드백을 제공하기 어려운 구조적 문제가 발생한다.

2. 모놀리식 아키텍처로 인한 확장성 문제

   - 프로젝트가 모놀리식(Monolithic) 구조로 설계되어 있어, 중복된 설정 코드(webdriver 설정, 환경 변수, 공통 유틸리티 등)가 모든 프로젝트에서 반복되어, 설정이 변경될 경우 모든 프로젝트에서 일괄 수정해야 하는 부담이 발생한다.
   - 다만, 멀티모듈 방식을 채택하여, Common 프로젝트에 대한 의존성의 커지거나, Common 모듈이 변경될 경우, 모든 종속 프로젝트에서 변경 사항 반영으로 인한 사이드임펙트 문제점 및 프로젝트의 복잡성의 커지는 문제점을 야기 할 수 있으므로, 아키텍쳐에 대한 논의가 필요할 것으로 보인다.
   - 수동적으로 chrome driver 버젼 관리가 필요하여, 이에 테스트 도구 버전과 드라이버 버전이 호환되지 않는 경우를 막기위해 자동 업데이트 모듈(NPM 기반)을 사용할 필요성이 있다.

3. 로깅(logging) 기능 부족

   - 현재 주로 print()를 사용하여 로그를 남기고 있어, 테스트 실행 중 발생하는 오류를 체계적으로 저장하지 못하며, 실패 원인 분석 및 디버깅이 어려우며, 테스트 결과를 한눈에 확인하기 어렵다.

4. 렌더링 및 네트워크 이슈

   - Selenium의 한계로, 특정 요소가 DOM에서 변경되거나 사라지면, Selenium은 이를 추적하지 못하고 `StaleElementException` 발생 및및 요소가 아직 로드되지 않았는데 찾으려고 하면 `NoSuchElementException` 발생한다.
   - 웹 애플리케이션이 비동기적으로 요소를 로드하는 경우, 예상보다 요소가 늦게 렌더링 될 수 있다. 따라서, 렌더링 이슈로 인하여, 명시적 대기 및 암시적 대기를 사용하지만, 적절한 대기 메커니즘( Auto-Wait)이 적용되지 못한다.

5. 컴포넌트 및 공통 유틸리티(utils) 부족

   - 네비게이션 바, 모달 창, 공통 버튼 등 재사용 가능한 UI 요소가 `components/`로 분리되지 않고, 테스트 코드에 직접 포함되어 있다.

   - UI 테스트, API 테스트 등에서 공통적으로 활용할 utils/ 모듈이 미흡하여 코드 중복이 많고 유지보수가 어렵다.

6. 클래스 및 메서드 모듈화 미흡

   - 테스트 코드가 클래스와 메서드 단위로 구조화되지 않아 유지보수성이 떨어진다.

7. 하드코딩된 검증 로직

   - UI 요소의 검증 방식 중, 하드코딩되어 있는 부분이 많아, 테스트 시, 다양한 시나리오에 대한 테스트가 제한된다.

---

### [3] 🎭 Playwright를 도입해야 하는 이유

기존의 Python 및 Selenium/Appium 기반의 프로젝트에서 Node.js + TS를 활용한 Playwright를 도입하여야 하는 이유는 다음과 같다.

1. Auto-Wait (자동 대기) 지원

   - Selenium/Appium의 WebDriverWait을 사용해 명시적으로 대기하던 방식이다.

   - Playwright는 기본적으로 요소가 로드될 때까지 자동으로 대기(Auto-Wait)하여 StaleElementException, NoSuchElementException 방지한다.

2. 빠른 테스트 실행 속도

   - Selenium은 WebDriver와 실제 브라우저 간 클라이언트-서버 방식으로 작동하여 속도가 느리다.

   - Playwright는 브라우저와 같은 프로세스 내에서 실행하여 Selenium보다 3~4배 빠르다.

3. 멀티 브라우저 & 모바일 지원

   - Selenium은 Chrome, Firefox, Edge 등의 브라우저를 지원하지만, 모바일 디바이스 테스트 시 Appium을 추가로 사용해야 한다.

   - Playwright는 단일 프레임워크에서 Chromium, Firefox, WebKit(Safari) 및 모바일 디바이스(아이폰, 안드로이드) 지원이 가능하다.

4. Headless 모드 최적화

   - Selenium은 Headless 모드에서 일부 기능이 제한적이며, 속도 차이가 크지 않다.

   - Playwright는 Headless 모드에서 실행 최적화되어 훨씬 빠르고 안정적인 테스트가 가능하다.

5. 네트워크 요청 감지 및 조작 기능

   - Selenium은 네트워크 요청을 감지하려면 별도의 프록시 설정 필요하다.

   - Playwright는 page.route() API를 사용하여 네트워크 요청 차단/변경(Mock API 가능)하다.

6. 병렬 테스트 실행 지원(Parallel Execution)

   - Selenium은 병렬 테스트 실행 시 Selenium Grid 필요하고, 현재 구조에서 병렬테스트 진행이 어렵고, 구조를 변경하더라도 설정이 복잡하다.

   - Playwright는 `npx playwright test --shard=1/2` 같은 명령어 하나로 병렬 실행을 지원한다.

7. 빠른 테스트 실행 속도

   - Selenium/Appium은 WebDriver와 실제 브라우저 간 클라이언트-서버 방식으로 작동하여 속도가 느리다.

   - Playwright는 브라우저와 같은 프로세스 내에서 실행하여 Selenium보다 3~4배 빠르다.

8. 강력한 디버깅 기능

   - Selenium/Appium은 실패한 테스트 디버깅 시 스크린샷만 제공한다.

   - Playwright는 테스트 실행 영상 기록 가능하며, 실패한 경우 UI 상태를 확인할 수 있는 Trace Viewer 제공한다.

9. API 테스트 및 UI 테스트 통합 가능

   - Selenium/Appium은 API 테스트는 별도의 도구(Postman, RestAssured 등) 필요하다.

   - Playwright는 UI 테스트뿐만 아니라 API 테스트도 함께 가능하다.

10. 단일 환경에서 웹 & 모바일 자동화 가능

    - Selenium/Appium은 웹 테스트(Selenium), 모바일 테스트(Appium)를 별도로 구현해야 한다

    - Playwright: 하나의 코드베이스에서 웹과 모바일을 동시에 자동화 가능하다. 다만 도커라이징을 위해, 별도의 프로젝트로 구분하여 아키텍쳐를 구성할 예정이다.

---

### [4] 🏗️ Playwright 프로젝트 아키텍처 설계

<p align="center">
  <img src="https://cdn.prod.website-files.com/6260298eca091b3621cf1890/649476a6824a7b72d50b8cf0_4d24046b-edc4-4845-abb0-86e8d8d205c3.jpeg"/>
</p>


- [Playwright 공식 저장소](https://github.com/microsoft/playwright?tab=readme-ov-file)
- [Playwright 공식 문서](https://playwright.dev/docs/intro)
- [TypeScript 공식 저장소](https://github.com/microsoft/TypeScript)
- [모놀리식 vs 마이크로서비스 아키텍처 개념](https://martinfowler.com/articles/microservices.html)
- [멀티 모듈 아키텍처 개념](https://docs.gradle.org/current/userguide/multi_project_builds.html)
- [Docker 공식 문서](https://docs.docker.com/)
- [Kubernetes 공식 사이트](https://kubernetes.io/)
- [CI/CD 개념 및 도구 비교](https://www.redhat.com/en/topics/devops/what-is-ci-cd)

---

### [5] 🔥 최종 결론 및 개선 방향

1. 기존 Selenium/Appium 기반의 Python 프로젝트는 모놀리식 아키텍처, 코드 중복, 모듈화 부족 등의 문제로 인해 테스트 유지보수성 및 확장성이 낮은 구조를 가지고 있다. 또한 확장성을 위해 API 테스트, Dockerizing이 도입될 경우, 기존의 테스트 아키텍처를 개선할 필요가 있으며, Playwright 도입이 필요할 수 있다.

2. Playwright 도입 대신 기존의 툴 유지 시, 메인 페이지에서 검증하는 각 기능을 별도의 모듈(클래스/메서드)로 분리하고, 각 모듈은 독립적으로 실행 가능하고, 필요 시 조합하여 테스트 가능하게 구성하여야 한다.

3. UI 컴포넌트(Component) 개념을 추가하여, 재사용 가능한 공통 UI 요소를 별도로 관리하면
   테스트 유지보수성, 가독성, 확장성이 극대화된다.

4. 추후 테스트 실행 로그의 체계적인 적재 및 분석이 필요할 경우, logger 기능을 도입하여 테스트 실행 과정에서 발생하는 다양한 로그(정보, 경고, 오류)를 저장하고 관리할 수 있도록 해야 한다.
   이를 위해 JSON 형식(log.json)으로 로그를 저장하면, 테스트 결과를 구조화된 데이터로 보관할 수 있으며, 향후 분석 및 CI/CD 연동 시 활용하기 용이하다.
   또한, 로그 파일을 시각화 도구(Kibana, Grafana 등)와 연계하거나, Slack, Teams 등의 알림 시스템과 연결하면 테스트 실행 결과를 실시간으로 모니터링할 수 있는 환경을 구축할 수 있다.

5. 다만, 자동화 담당 인원의 Playwright 및 POM 구조, 그리고 TypeScript(TS) 언어에 대한 이해도가 부족한 상태이므로, POC(Proof of Concept) 진행을 위해 일정 기간의 학습 및 실습이 필요하다. 이에 따라, 5주 동안 POC를 진행하며, Playwright을 활용한 PC 자동화 환경 구축 및 모듈화 적용을 목표로 한다. (진행자: 민시우 / 1w: TS 및 node.js 학습 / 4w: PC POC 진행)
