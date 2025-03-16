###### - 민시우(2025/03/10) 작성 -

## 1w-1. 🚀 Playwright 학습

```PowerShell
# 모든 테스트 한 번에 실행
npx playwright test

# 특정 테스트 파일만 실행
npx playwright test tests/LoginTest.spec.ts
npx playwright test tests/LoginTest.spec.ts

# 테스트 결과 HTML 보고서 보기
npx playwright show-report
```

#### 📌 테스트 실행 방법

```sh
# Playwright 테스트 실행 (모든 테스트)
npx playwright test

# 특정 테스트 실행
npx playwright test example.spec.ts

# 특정 브라우저에서 실행 (chromium, firefox, webkit)
npx playwright test --browser=chromium

# UI 모드에서 실행 (테스트 실행 및 디버깅 가능)
npx playwright test --ui

# WebDriver 실행 후 테스트 실행 (예: Android)
npx wdio wdio.conf.js

# 특정 플랫폼에서 실행 (Android/iOS)
npx wdio --suite android
npx wdio --suite ios
```

#### 📌 Playwright 테스트 실행 및 기본 API

#### 📌 Playwright의 요소 선택 및 조작

#### 📌 XPath vs. CSS Selector 비교

| **비교 항목**                    | **CSS Selector (`page.locator()`)**            | **XPath (`page.locator('xpath=...')`)**                   |
| -------------------------------- | ---------------------------------------------- | --------------------------------------------------------- |
| **가독성 (깔끔함)**              | ✅ 짧고 직관적                                 | ❌ 길어질 경우 가독성이 낮음                              |
| **속도**                         | ✅ 빠름 (브라우저 기본 최적화)                 | ❌ 상대적으로 느림 (DOM 탐색 방식)                        |
| **편의성**                       | ✅ 더 간결하고 쉽게 작성 가능                  | ❌ 복잡한 계층 구조에서 유용하지만 길어짐                 |
| **역할 기반 선택 (`getByRole`)** | ✅ 지원 (ARIA 역할 기반)                       | ❌ XPath로 직접 처리해야 함                               |
| **상대 경로 지원**               | ❌ 직접 지원하지 않음 (`:has()`와 조합해야 함) | ✅ `//`, `..`, `ancestor::` 같은 경로 탐색 가능           |
| **형제 요소 선택**               | ❌ 복잡 (`+`, `~` 사용)                        | ✅ `following-sibling::`, `preceding-sibling::` 사용 가능 |
| **부모 요소 탐색**               | ❌ 직접 지원 안됨                              | ✅ `..`, `parent::` 로 부모 요소 찾기 가능                |
| **텍스트 검색 (`contains`)**     | ❌ `hasText()` 사용 필요                       | ✅ `contains(text(), '...')` 직접 사용 가능               |

#### 📌 Playwright `Locator Select` 옵션 정리

| **메서드**                           | **설명**                                       |
| ------------------------------------ | ---------------------------------------------- |
| `page.locator(selector)`             | CSS 또는 XPath를 사용하여 요소를 선택          |
| `page.getByText(text)`               | 특정 텍스트를 포함하는 요소 선택               |
| `page.getByRole(role, options)`      | ARIA 역할(예: `button`, `link`) 기반 요소 선택 |
| `page.getByLabel(label)`             | `<label>` 요소와 연결된 입력 필드 선택         |
| `page.getByPlaceholder(placeholder)` | `placeholder` 속성을 가진 입력 필드 선택       |
| `page.getByTestId(testId)`           | `data-testid` 속성을 가진 요소 선택            |
| `locator.first()`                    | 일치하는 요소 중 첫 번째 요소 선택             |
| `locator.last()`                     | 일치하는 요소 중 마지막 요소 선택              |
| `locator.nth(index)`                 | 일치하는 요소 중 특정 인덱스의 요소 선택       |
| `locator.and(locator)`               | 두 개의 locator를 조합하여 필터링              |
| `locator.or(locator)`                | 두 개의 locator 중 하나라도 일치하면 선택      |
| `page.locator('xpath=...')`          | XPath를 사용하여 요소 선택                     |
| `page.locator('css=...')`            | CSS 선택자를 사용하여 요소 선택                |
| `locator.filter({ hasText })`        | 특정 텍스트를 포함하는 요소만 선택             |
| `locator.filter({ has })`            | 특정 자식 요소를 포함하는 요소만 선택          |
| `locator.filter({ hasNot })`         | 특정 자식 요소를 포함하지 않는 요소 선택       |
| `locator.filter({ hasNotText })`     | 특정 텍스트를 포함하지 않는 요소 선택          |

#### 📌 Playwright `Locator Actions` 정리

| **메서드**                        | **설명**                         |
| --------------------------------- | -------------------------------- |
| `locator.check()`                 | 체크박스를 선택                  |
| `locator.uncheck()`               | 체크박스를 선택 해제             |
| `locator.click()`                 | 요소를 클릭                      |
| `locator.hover()`                 | 마우스를 요소 위에 호버          |
| `locator.fill(value)`             | 입력 필드에 텍스트 입력          |
| `locator.focus()`                 | 요소에 포커스를 설정             |
| `locator.press(key)`              | 특정 키 입력 (`Enter`, `Tab` 등) |
| `locator.setInputFiles(filePath)` | 파일 업로드 (파일 선택)          |
| `locator.selectOption(value)`     | 드롭다운에서 옵션 선택           |

#### 📌 Playwright `getBy` Methods 정리

| **메서드**                           | **설명**                                       |
| ------------------------------------ | ---------------------------------------------- |
| `page.getByLabel(label)`             | `<label>` 요소와 연결된 입력 필드 선택         |
| `page.getByPlaceholder(placeholder)` | `placeholder` 속성을 가진 입력 필드 선택       |
| `page.getByText(text)`               | 특정 텍스트를 포함하는 요소 선택               |
| `page.getByAltText(altText)`         | `alt` 속성을 가진 요소 선택 (이미지 등)        |
| `page.getByTitle(title)`             | `title` 속성을 가진 요소 선택                  |
| `page.getByRole(role, options)`      | ARIA 역할(예: `button`, `link`) 기반 요소 선택 |
| `page.getByTestId(testId)`           | `data-testid` 속성을 가진 요소 선택            |

#### 📌 Playwright Assertions 정리

| **Assertion**                                       | **설명**                                              |
| --------------------------------------------------- | ----------------------------------------------------- |
| `expect(locator).toHaveCount(number)`               | 특정 개수의 요소가 존재하는지 확인                    |
| `expect(locator).toBeEnabled()`                     | 요소가 활성화(Enabled) 상태인지 확인                  |
| `expect(locator).toBeDisabled()`                    | 요소가 비활성화(Disabled) 상태인지 확인               |
| `expect(locator).toBeVisible()`                     | 요소가 화면에 표시되는지 확인                         |
| `expect(locator).toBeHidden()`                      | 요소가 숨겨져 있는지 확인                             |
| `expect(locator).toHaveText(text)`                  | 요소가 특정 텍스트를 포함하는지 확인                  |
| `expect(locator).toHaveAttribute(attribute, value)` | 요소가 특정 속성 값을 가지고 있는지 확인              |
| `expect(locator).toHaveId(idValue)`                 | 요소의 `id` 값이 특정 값인지 확인                     |
| `expect(locator).toHaveClass(classValue)`           | 요소의 `class` 속성이 특정 값인지 확인                |
| `expect(page).toHaveURL(urlValue)`                  | 현재 페이지의 URL이 특정 값과 일치하는지 확인         |
| `expect(page).toHaveTitle(titleValue)`              | 현재 페이지의 제목(Title)이 특정 값과 일치하는지 확인 |

#### 📌 Playwright `getBy` Methods 정리

#### 📌 Playwright에서의 비동기 처리 (async/await)

#### 📌 Playwright 커스텀 설정 (playwright.config.ts)

#### 📌 Playwright의 다양한 테스트 실행

#### 📌 Playwright의 네트워크 요청 조작

#### 📌 Playwright의 시각적 테스트 (UI 회귀 테스트)

#### 📌 Playwright에서 Drag & Drop 테스트

#### 📌 Playwright 성능 테스트 및 로깅

#### 📌 Playwright CI/CD 환경 설정

```

```
