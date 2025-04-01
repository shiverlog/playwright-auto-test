import { BaseModal } from '@common/components/BaseModal';
import type { BrowserContext, Page } from '@playwright/test';

/**
 * PC 전용 모달 처리 유틸
 */
export class Modal extends BaseModal {
  constructor(page: Page) {
    // PC는 Appium driver가 필요 없으므로 page만 전달
    super(page);
  }

  /**
   * PC 전용 추가 모달 처리 필요 시 여기에 오버라이드 가능
   */
  async checkPcOnlyModals(): Promise<void> {
    try {
      const tooltipCloseBtn = this.page.locator('.tooltip-close');
      if (await tooltipCloseBtn.isVisible()) {
        await tooltipCloseBtn.click();
      }
    } catch {
      // 무시
    }
  }

  /**
   * 공통 + PC 전용 모달 체크를 함께 실행
   */
  async checkAllModals(): Promise<void> {
    await this.checkCommonModals();
    await this.checkPcOnlyModals();
  }
}
