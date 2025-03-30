import { BaseActionUtils } from '@common/actions/BaseActionUtils';
import { appMenuLocator } from '@common/locators/uiLocator';
import type { Page } from '@playwright/test';

export class BaseHeader {
  private page: Page;
  private baseActions: BaseActionUtils;
  private var: Record<string, any>; // common_el 등에서 참조할 변수

  constructor(page: Page, baseActions: BaseActionUtils, varMap: Record<string, any>) {
    this.page = page;
    this.baseActions = baseActions;
    this.var = varMap;
  }

  /**
   * 햄버거 메뉴를 클릭하고 지정된 메뉴들을 순서대로 클릭하여 특정 URL로 이동
   */
  public async goToHamburgerMenu(menuSelectors: string[], expectedUrl: string): Promise<boolean> {
    const hamburgerSelector = appMenuLocator.mainMenu;
    const expandButtonSelector = appMenuLocator.expandAll;

    try {
      await this.baseActions.click(hamburgerSelector);
      await this.baseActions.waitForLoadState('networkidle');

      for (const selector of menuSelectors) {
        if (await this.baseActions.containsText(expandButtonSelector, '전체 펼침')) {
          await this.baseActions.scrollTo(expandButtonSelector);
          await this.baseActions.click(expandButtonSelector);
        }

        await this.baseActions.scrollTo(selector);
        await this.baseActions.click(selector);
        await this.baseActions.waitForLoadState('networkidle');
      }

      const currentUrl = this.baseActions.getCurrentUrl();
      return currentUrl.includes(expectedUrl);
    } catch {
      return false;
    }
  }
}
