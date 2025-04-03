import { AppElement } from '@common/elements/AppElement';
import { expect, test } from '@common/fixtures/BaseAppFixture';

test('iOS 앱이 정상적으로 실행되는지 확인', async ({ driver }) => {
  const el = await driver.$(
    '-ios predicate string:type == "XCUIElementTypeButton" AND name CONTAINS "홈"',
  );
  const wrapped = new AppElement(el, driver);

  const isVisible = await wrapped.isVisible();
  expect(isVisible).toBeTruthy();
});
