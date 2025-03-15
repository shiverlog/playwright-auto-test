## 0w-2. 🏗️ 멀티모듈을 도입하여야 하는 이유

### [1] 📦 모놀리식 아키텍처(Monolithic Architecture) vs 멀티 모듈 아키텍처(Multi-Module Architecture)

<p align="center">
  <img src="https://www.finoit.com/wp-content/uploads/2023/09/Difference-between-Monoliths-and-Microservice-Architecture.png"/>
</p>

1. 모놀리식 아키텍처 (Monolithic Architecture): 테스트 자동화 프로젝트에서 모든 테스트(UI, API, 성능 테스트 등)가 하나의 코드베이스 내에서 통합되어 실행되는 구조를 의미하며, 모든 프로세스가 긴밀하게 결합되어 있으며, 단일 서비스 형태로 실행되기 때문에 테스트 환경 설정, 실행, 배포가 단순하지만, 프로젝트가 커질수록 유지보수 및 확장성이 어려워진다.

2. 멀티 모듈 아키텍쳐(Multi-Module Architecture): 테스트 자동화 프로젝트에서 UI 테스트, API 테스트, 성능 테스트 등을 각각 독립적인 모듈로 분리하여 관리하는 구조를 의미하며, 이 방식은 확장성과 유지보수성을 극대화할 수 있으며, Docker 및 CI/CD와 결합하여 최적의 테스트 실행 환경을 구축하는 데 유리하다.

3. 각각의 아키텍쳐 비교

| 비교 항목              | 모놀리식 아키텍처                                                  | 멀티 모듈 아키텍처                                                                                   |
| ---------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| 구성                   | 모든 테스트(UI, API, 성능 테스트 등)가 하나의 프로젝트 내에서 실행 | 테스트 유형별로 UI, API, 성능 테스트 등을 개별 모듈로 분리                                           |
| 확장성                 | 프로젝트가 커질수록 유지보수 및 확장 어려움                        | 새로운 기능 및 테스트 유형 추가가 용이                                                               |
| 유지보수성             | 특정 기능 변경 시 전체 프로젝트에 영향                             | 각 모듈이 독립적으로 존재하여 유지보수 용이                                                          |
| 테스트 실행            | 모든 테스트가 한 번에 실행됨 → 실행 시간이 길어짐                  | 필요한 모듈만 실행하여 테스트 속도 최적화 가능                                                       |
| 빌드 및 배포           | 모든 테스트가 한 프로젝트에서 빌드되어 시간이 오래 걸림            | 모듈별로 독립적인 빌드 및 배포 가능                                                                  |
| 오류 감지 및 영향 범위 | 한 테스트에서 오류 발생 시 전체 테스트 실행에 영향                 | 개별 모듈 내에서 오류가 발생해도 다른 모듈에 영향 없음                                               |
| CI/CD 연동             | 전체 테스트를 한 번에 실행해야 하므로 속도가 느림                  | 특정 모듈만 실행 가능하여 최적화 가능                                                                |
| 병렬 실행 가능 여부    | 모든 테스트를 한 번에 실행해야 하므로 병렬 실행 어려움             | 테스트 모듈을 분리하여 병렬 실행 가능                                                                |
| 기술 스택 다양성       | 하나의 프레임워크와 언어만 사용 가능 (예: Playwright + TypeScript) | 각 모듈별로 적절한 기술 선택 가능 (UI 테스트: Playwright, API 테스트: Supertest, 성능 테스트: k6 등) |
| Docker 활용            | 하나의 컨테이너에서 모든 테스트 실행                               | 모듈별 개별 컨테이너 실행 가능                                                                       |

---

`Page Object Model (POM) 구조`

모놀리식 POM 구조 예시 (단일 프로젝트 구조)

```
TEST/
├── base/                       # WebDriver 기본 설정 및 공통 클래스
├── config/                     # 프로젝트 설정 파일
├── features/                   # 테스트 기능 구현
├── locators/                   # 웹 요소 위치 정보
├── logs/                       # 로그 파일 저장
├── pages/                      # 페이지 객체 모델
├── screenshots/                # 테스트 중 캡처된 스크린샷
├── utils/                      # 유틸리티 함수 모음
├── README.md                   # 프로젝트 설명 문서
├── requirements.txt            # 프로젝트 의존성 목록
└── runner.py                   # 테스트 실행 스크립트
```

멀티 모듈 POM 구조 예시

```
TEST/
│── common/                     # 공통 유틸리티 및 공통 기능
│   ├── utils/                  # 공통 유틸리티 함수 모음
│   ├── Dockerfile              # 공통 모듈을 도커 이미지로 만들 수 있도록 설정
│   ├── package.json
│   ├── tsconfig.json
│   ├── README.md
│
│── api-tests/                  # API 테스트 프로젝트
│   ├── src/
│   │   ├── tests/              # API 테스트 코드
│   ├── swagger/                # Swagger API 문서 및 설정
│   ├── postman/                # Postman 컬렉션 및 테스트
│   ├── Dockerfile              # API 테스트를 컨테이너화
│   ├── playwright.config.ts
│   ├── package.json
│   ├── README.md
│
│── pubsub/                      # Pub/Sub 메시징 시스템
│   ├── src/
│   │   ├── publisher.ts
│   │   ├── subscriber.ts
│   ├── config/                  # 설정 파일
│   ├── Dockerfile               # PubSub 메시징 컨테이너화
│   ├── package.json
│   ├── README.md
│
│── db/                          # DB 관리 프로젝트
│   ├── migrations/              # DB 마이그레이션 스크립트
│   ├── seeds/                   # 테스트 데이터 시드
│   ├── config/                  # DB 설정
│   ├── Dockerfile               # DB 컨테이너 생성 (MySQL, PostgreSQL 등)
│   ├── package.json
│   ├── README.md
│
│── batch/                       # 배치 실행 프로젝트
│   ├── scripts/                 # 배치 파일 (Shell, PowerShell, Windows)
│   ├── Dockerfile               # 배치 실행을 위한 컨테이너 구성
│   ├── package.json
│   ├── README.md
│
├── chrome-pc/                   # Chrome (Windows/Linux) 테스트 프로젝트
│   ├── src/
│   │   ├── tests/               # Playwright 테스트 스크립트
│   ├── pages/                   # POM 기반 페이지 객체
│   ├── locators/                # Chrome PC 전용 요소 위치 정보 (JSON 형식)
│   │   ├── loginPage.json       # 로그인 페이지 로케이터
│   │   ├── mainPage.json        # 메인 페이지 로케이터
│   ├── config/                  # 설정 파일
│   │   ├── playwright.config.ts # Playwright 설정 파일
│   ├── components/              # Chrome PC 전용 UI 컴포넌트 모음
│   ├── logs/                    # 테스트 실행 로그
│   ├── test-results/            # 테스트 결과 저장소
│   ├── screenshots/             # 스크린샷 저장소
│   ├── requirements.txt         # Chrome PC 전용 추가 패키지
│   ├── Dockerfile               # Chrome PC 테스트용 Docker 설정
│   ├── README.md                # Chrome PC 테스트 프로젝트 설명 문서
```

---

결론: 프로젝트의 확장성과 유지보수성을 고려하여, 모듈화 및 멀티 모듈이 적용된 Page Object Model(POM) 기반의 아키텍처를 설계해야 하며, 멀티 모듈 방식을 적용하면 각 기능이 독립적으로 실행될 수 있으며, CI/CD 환경에서도 효율적인 테스트 수행이 가능하다. 또한, 기존의 TC(Test Case)별 단일 함수 내에서 모든 검증을 실행하는 방식에서 벗어나, 기능별로 테스트를 분리하고 컨포넌트/메서드 기반으로 구조화하는 방식으로 개선해야 한다.

### [2] 🔍 참고 자료

- [모놀리식 vs 마이크로서비스 아키텍처 개념](https://martinfowler.com/articles/microservices.html)
- [멀티 모듈 아키텍처 개념](https://docs.gradle.org/current/userguide/multi_project_builds.html)
- [Docker 공식 문서](https://docs.docker.com/)
- [Kubernetes 공식 사이트](https://kubernetes.io/)
- [CI/CD 개념 및 도구 비교](https://www.redhat.com/en/topics/devops/what-is-ci-cd)
