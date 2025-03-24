import type { Page } from '@playwright/test';

class ExternalStep {
  static async gotoHome(page: Page): Promise<void> {
    await page.goto('/');
  }

  static async clickBenefitButton(page: Page): Promise<void> {
    await page.click('css=your-benefit-selector');
  }

  static async clickUjamButton(page: Page): Promise<void> {
    await page.click('css=your-ujam-selector');
  }

  static async clickUdocButton(page: Page): Promise<void> {
    await page.click('css=your-udoc-selector');
  }

  static async waitForPageLoad(page: Page): Promise<void> {
    await page.waitForLoadState('load');
  }

  static async moveToUjamPage(page: Page): Promise<void> {
    await this.clickBenefitButton(page);
    await this.clickUjamButton(page);
    await this.waitForPageLoad(page);
  }

  static async moveToUdocPage(page: Page): Promise<void> {
    await this.clickUdocButton(page);
    await this.waitForPageLoad(page);
  }
}

export default ExternalStep;
