import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  console.log('🚀 브라우저 열림'); // 확인용
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/', { timeout: 60000 });
  console.log('🌐 페이지 로딩 완료');
  // Click the get started link.
  // await page.getByRole('link', { name: 'Get started' }).click();

  // // Expects page to have a heading with the name of Installation.
  // await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
