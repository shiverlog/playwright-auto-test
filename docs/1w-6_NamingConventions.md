###### - 민시우(2025/03/10) 작성 -

## 1w-6. 프로젝트 협업을 위한 규칙

### [1] 명명법

1. 프로젝트(Project): TypeScript 중심인 프로젝트는 주로 PascalCase를 사용되지만, Docker, Kubernetes, CI/CD 파이프라인에서는 kebab-case가 일반적이므로, kebab-case 형식으로 작성하였다.

- 프로젝트 명: playwright-auto-test (수정필요)

2. 패키지(Package): 소문자 및 kebab-case를 사용하여 패키지명을 작성한다. TypeScript 및 npm 패키지 표준을 따른다.

- 패키지 명: common, e2e, docs, pubsub, mosaic-db 등

3. TypeScript 모듈 구조 및 메서드 규칙

- 모듈 분리 기준
- Page Objecat 모듈: 특정 페이지 또는 화면에 대한 요소 및 동작을 정의하는 모듈

1. 클래스(Class): 객체를 생성하기 위한 템플릿 역할을 하며, 데이터와 해당 데이터를 처리하는 메서드를 포함하며, PascalCase를 사용하여 클래스를 정의한다.

- Page Object: PascalCase 네이밍 사용 (LoginPage.ts, DashboardPage.ts)
- Service (API 관련): PascalCase 네이밍 사용 (AuthService.ts, UserService.ts)
- Utility 모듈: PascalCase 네이밍 사용 (FileUtil.ts, DateUtil.ts)
- Config 및 Constants: camelCase 또는 UPPER_CASE 사용 (config.ts, constants.ts)
-

2. 메서드(Method): 클래스 내부에서 정의된 함수이며, 객체의 동작을 담당한다.

- ex) pages, steps

```typescript
// UserService 클래스 정의
class UserService {
  private users: string[] = [];

  addUser(user: string): void {
    this.users.push(user);
  }
}
```

📌 인터페이스(Interface): 객체의 구조를 정의하며, 강제적인 타입 검사를 제공하며, PascalCase를 사용하며 I 접두어는 사용하지 않는다.

📌 상수(Constant): 변하지 않는 값을 저장하며, UPPER_SNAKE_CASE를 사용한다.

📌 타입(Type Alias): 특정 데이터 구조를 정의하는데 사용되며, PascalCase를 사용한다.

📌 제네릭(Generic Type): 타입을 유연하게 정의할 수 있도록 하는 기능으로, T, K, V 등의 짧은 문자 또는 의미 있는 PascalCase를 사용한다.

📌 열거형(Enum): 관련된 값을 그룹화하는 데 사용되며, PascalCase를 사용하고, 값은 UPPER_SNAKE_CASE로 작성한다.

📌 함수(Function): 특정 작업을 수행하는 코드 블록이며, camelCase를 사용한다. 함수명은 동사 + 명사 형태로 작성한다.

📌 변수(Variable): 데이터를 저장하는 컨테이너 역할을 하며, camelCase를 사용한다. Boolean 변수의 경우 is, has, can 접두어를 사용한다.

📌 모듈 및 파일명

📌 config

📌 formatters

📌 handlers

📌 locators

📌 공통 utils

📌 docs

### [2] TypeScript 규칙

1. 모든 타입은 명시적으로 정의한다.
2. 인터페이스 보다는 타입을 선호한다.
3. 기본 타입(string, number, boolean)을 사용하며, any는 사용하지 않는다.
4.
