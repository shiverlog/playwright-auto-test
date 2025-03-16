###### - 민시우(2025/03/10) 작성 -

## 1w-5. 🚀 OOP 개념을 Playwright 프로젝트에 적용

### [1] ⚡ OOP의 특징

##### OOP(Object-Oriented Programming): 필요한 데이터를 추상화하여 속성(Attributes)와 행위(methods)를 가진 객체를 만들고, 그 객체들 간의 유기적인 상호 작용을 통해 로직을 구성하는 프로그래밍 방법이다.

<p align="center">
  <img src="https://ds055uzetaobb.cloudfront.net/brioche/uploads/9zf47a20NN-cpt-object-var-procsvg.png"/>
</p>

##### 1. 캡슐화(Encapsulation): 데이터와 그 로직(method)를 클래스 라고 불리는 틀 안에 응집시키는 것을 의미하는데, 이렇게 데이터와 프로세스를 응집시켜 데이터 구조 변경이 생겼을 때 그 사이드 이펙트가 미치는 최소화한다.

<p align="center">
  <img src="https://velog.velcdn.com/images/yangys0928/post/d83563d2-5911-4de5-9f12-f016aca3fbf1/image.png"/>
</p>

##### 2. 정보은닉(Information Hiding): 불필요한 내부 정보를 숨기고, 외부에서 필요한 정보만 접근 가능하도록 한다.

##### 3. 추상화(Abstraction): 추상 클래스(abstract class)를 사용하여 공통 기능을 정의하고, 구체적인 구현은 서브 클래스에서 하도록 강제한다.

##### 4. 다형성(Polymorphism): 같은 메서드가 서로 다른 클래스에서 다르게 동작할 수 있도록 하는 개념이다.

###### - 오버로딩(Overloading): 같은 이름의 메서드를 매개변수의 개수나 타입에 따라 다르게 동작하도록 하는 개념이며, TypeScript에서는 메서드 시그니처(Method Signature)를 활용하여 오버로딩을 구현한다.

###### - 오버라이딩(Overriding): 부모 클래스의 메서드를 자식 클래스에서 재정의(덮어쓰기)하는 개념이다.

##### 5. 상속(Inheritance) & 재사용성(Reusability)

###### - 상속(Inheritance): 부모 클래스의 속성과 메서드를 자식 클래스가 물려받아 재사용할 수 있도록 하는 개념으로,이를 통해 코드 중복을 줄이고 유지보수성을 향상시킬 수 있다.

##### - 재사용성(Reusability): 공통 기능을 한 곳에서 정의하고 여러 클래스에서 공유하여 사용할 수 있도록 하는 개념으로 상속, 추상 클래스, 인터페이스, 유틸리티 모듈 등을 활용하여 중복 코드를 줄이고 개발 효율성을 높일 수 있다.

---

### [2] 🔥 OOP 개념 적용 예시

##### 1. 캡슐화 (Encapsulation) - 환경 설정 및 데이터 보호

###### - 적용위치 : `common/config/`, `.env`

###### - Playwright 프로젝트에서 `.env` 파일을 활용하여 **API 키, 사용자 정보 등 민감한 데이터를 보호**할 수 있다.

###### - `.env` 파일을 **직접 코드에서 노출하지 않고**, `config.ts`에서 이를 안전하게 로드하는 방식으로 접근한다.

```typescript
// common/config/config.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  baseUrl: process.env.BASE_URL || 'https://default.com',
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  apiKey: process.env.API_KEY,
};
```

##### 2. 상속 (Inheritance) - BasePage를 활용한 코드 재사용

###### - 적용 위치: `src/pages/BasePage.ts` → `src/pages/LoginPage.ts`

###### - 부모 클래스인 BasePage 를 만들어 모든 페이지에서 재사용 가능하도록 상속 구조를 만든다.

```typescript
// src/pages/BasePage.ts (부모 클래스)
import { Page } from "@playwright/test";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }
}

// src/pages/LoginPage.ts (자식 클래스)
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  private usernameField = "#username";
  private passwordField = "#password";
  private loginButton = "#login";

  async login(username: string, password: string): Promise<void> {
    await this.page.fill(this.usernameField, username);
    await this.page.fill(this.passwordField, password);
    await this.page.click(this.loginButton);
  }
}
```

##### 3. 다형성 (Polymorphism) - 동일한 인터페이스로 여러 페이지 처리

###### - 적용 위치: `src/pages/BasePage.ts`, `src/pages/LoginPage.ts`, `src/pages/DashboardPage.ts`

###### - BasePage를 상속받은 모든 페이지에서 다형성을 활용하여 동일한 인터페이스를 따를 수 있도록 한다.

```typescript
// src/pages/BasePage.ts
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}

// src/pages/LoginPage.ts
export class LoginPage extends BasePage {
  async getPageTitle(): Promise<string> {
    return 'Login Page - ' + (await super.getPageTitle());
  }
}

// src/pages/DashboardPage.ts
export class DashboardPage extends BasePage {
  async getPageTitle(): Promise<string> {
    return 'Dashboard - ' + (await super.getPageTitle());
  }
}
```

##### 4. 추상화 (Abstraction) - 공통된 테스트 실행 단계 분리

###### - 적용위치 : `/src/steps/`

```typescript
// src/steps/LoginStep.ts (구체적인 구현)
import { LoginPage } from '../pages/LoginPage';

// src/steps/TestStep.ts (추상 클래스)
export abstract class TestStep {
  abstract execute(): Promise<void>;
}

export class LoginStep extends TestStep {
  private loginPage: LoginPage;

  constructor(loginPage: LoginPage) {
    super();
    this.loginPage = loginPage;
  }

  async execute(): Promise<void> {
    await this.loginPage.login('testUser', 'testPassword');
  }
}
```

##### 5. 재사용성 (Reusability) - common 공통모듈을 만들어서, 자주 사용하는 함수를 모아 여러 페이지와 테스트에서 재사용할 수 있도록 관리한다

###### - 적용위치 : `common`

```typescript
// common/utils/utils.ts
export class Utils {
  static async waitForElement(page: Page, selector: string): Promise<void> {
    await page.waitForSelector(selector);
  }

  static async takeScreenshot(page: Page, filename: string): Promise<void> {
    await page.screenshot({ path: `screenshots/${filename}.png` });
  }
}
```

### [3] 🔍 Playwright & TypeScript OOP 개념 참고자료

##### 1. Playwright 공식 문서

- [Playwright 공식 가이드](https://playwright.dev/docs/intro)
- [Playwright Page Object Model (POM)](https://playwright.dev/docs/pom)
- [Playwright Trace Viewer & 디버깅](https://playwright.dev/docs/trace-viewer)

##### 2. TypeScript OOP 개념 학습

- [TypeScript 공식 문서 (클래스 & 인터페이스)](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [TypeScript 상속 (Inheritance)](https://www.typescriptlang.org/docs/handbook/classes.html#inheritance)
- [TypeScript 인터페이스 & 다형성](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [OOP 디자인 패턴 & TypeScript 적용](https://refactoring.guru/design-patterns/typescript)

##### 3. Playwright & OOP 적용 예제

- [Playwright에서 Page Object Model 적용](https://www.lambdatest.com/blog/page-object-model-playwright/)
- [Playwright OOP 활용 예제](https://testautomationu.applitools.com/playwright-tutorial/)
- [TypeScript 기반 OOP 패턴 & 예제](https://dev.to/)
- [SOLID 원칙과 OOP 설계](https://khalilstemmler.com/articles/solid-principles/)

##### 4. Docker 및 CI/CD 연동

- [Docker Hub](https://hub.docker.com/)
- [Docker를 활용한 Playwright 테스트 실행](https://playwright.dev/docs/ci#docker)
- [Playwright CI/CD 연동 (GitHub Actions)](https://playwright.dev/docs/ci)

```

```
