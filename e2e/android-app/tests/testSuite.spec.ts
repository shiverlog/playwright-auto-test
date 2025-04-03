import { AppElement } from '@common/elements/AppElement';
import { expect, test } from '@common/fixtures/BaseAppFixture';

test('AOS 앱이 정상적으로 실행되는지 확인', async ({ driver }) => {
  const el = await driver.$('id=com.lguplus.mobile.cs:id/navigation_bar'); // 예시 ID
  const wrapped = new AppElement(el, driver);

  const isVisible = await wrapped.isVisible();
  expect(isVisible).toBeTruthy();
});
