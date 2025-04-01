import { BaseActionUtils } from '@common/actions/BaseActionUtils';
import { MobileActionUtils } from '@common/actions/MobileActionUtils';
import { WebActionUtils } from '@common/actions/WebActionUtils';
import type { BrowserContext, Page } from '@playwright/test';
import type { Browser } from 'webdriverio';

export class BaseModal {
  protected page: Page;
  protected driver?: Browser;

  protected baseActions: BaseActionUtils;
  protected webActions?: WebActionUtils;
  protected mobileActions?: MobileActionUtils;

  private selectors = {
    modalCheckbox: '#modal-checkbox',
    modalCloseButton: '.modal-close',
    modalActionButton: '.modal-action',
    modalInsButton: '.modal-ins',
    dimmedLayer: '.dimmed',
  };

  constructor(page: Page, driver?: Browser) {
    this.page = page;
    this.driver = driver;

    this.baseActions = new BaseActionUtils(page, driver!);

    if (driver) {
      this.mobileActions = new MobileActionUtils(page, driver);
    } else {
      this.webActions = new WebActionUtils(page, driver!);
    }
  }

  isMobile(): boolean {
    return !!this.mobileActions;
  }

  isWeb(): boolean {
    return !!this.webActions;
  }

  async determineModalType(): Promise<void> {
    try {
      await this.page.waitForSelector('.modal-content', { timeout: 5000 });
      const modalContent = this.page.locator('.modal-content');

      if (await modalContent.locator(".pop-tit-1:has-text('주소찾기')").count()) {
        await this.handleModal('address_modal');
      } else if (
        (await modalContent.locator(".h3:has-text('확인')").count()) &&
        (await modalContent.locator(".modal-footer button:has-text('확인')").count())
      ) {
        await this.handleModal('confirm_modal');
      } else if (await modalContent.locator(".pop-tit-1:has-text('4G 요금제 선택')").count()) {
        await this.handleModal('plan_select_modal');
      } else {
        console.warn('[Modal] 알 수 없는 모달 감지');
      }
    } catch (error) {
      console.error(`[Modal] 모달 타입 결정 중 오류 발생: ${error}`);
    }
  }

  async handleModal(modalType: string): Promise<void> {
    try {
      switch (modalType) {
        case 'event_modal':
          await this.handleEventModal();
          break;
        case 'confirm_modal':
          await this.handleConfirmModal();
          break;
        case 'address_modal':
          await this.handleAddressModal();
          break;
        case 'market_popup_modal':
          await this.handleMarketPopupModal();
          break;
        default:
          console.warn(`[Modal] 처리할 수 없는 모달 타입: ${modalType}`);
      }
    } catch (error) {
      console.error(`[Modal] 모달 처리 중 에러 발생: ${error}`);
    }
  }

  async handleEventModal(): Promise<void> {
    const closeButton = this.page.locator('.event-modal-close');
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await this.page.waitForSelector('.event-modal', { state: 'hidden' });
    }
  }

  async handleConfirmModal(): Promise<void> {
    const confirmBtn = this.page.locator('div.c-btn-group button.c-btn-solid-1-m');
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await this.page.waitForSelector('div.modal-dialog', { state: 'hidden' });
    }
  }

  async handleAddressModal(): Promise<void> {
    const input = this.page.locator('#address-search-input');
    const button = this.page.locator('#address-search-btn');

    await input.fill('서울특별시 강남구 테헤란로');
    await button.click();
    await this.page.waitForSelector('.modal-content', { state: 'hidden' });
  }

  async handleMarketPopupModal(): Promise<void> {
    const closeButton = this.page.locator('.market-popup-close');
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await this.page.waitForSelector('.market-popup', { state: 'hidden' });
    }
  }

  async checkCommonModals(): Promise<void> {
    try {
      await this.waitLoading();
      await this.page.waitForTimeout(500);
      await this.checkModalWithCheckbox();
      await this.checkModalWithCloseButton();
      await this.page.waitForTimeout(500);
      await this.waitLoading();
    } catch {
      await this.page.waitForTimeout(500);
      await this.waitLoading();
    }
  }

  private async checkModalWithCheckbox(): Promise<void> {
    try {
      const className = await this.page.locator('body').getAttribute('class');
      if (className?.includes('modal-open')) {
        await this.baseActions.click(this.selectors.modalCheckbox);
      }
    } catch {}
  }

  private async checkModalWithCloseButton(): Promise<void> {
    try {
      const className = await this.page.locator('body').getAttribute('class');
      if (className?.includes('modal-open')) {
        await this.baseActions.click(this.selectors.modalCloseButton);
      }
    } catch {}
  }

  async checkModalWithActionButton(): Promise<void> {
    try {
      const className = await this.page.locator('body').getAttribute('class');
      if (className?.includes('modal-open')) {
        await this.baseActions.click(this.selectors.modalActionButton);
      }
    } catch {}
  }

  async checkModalDimmedLayer(): Promise<void> {
    try {
      const dimmed = this.page.locator(this.selectors.dimmedLayer);
      if (await dimmed.isVisible()) {
        await this.baseActions.click(this.selectors.modalInsButton);
      }
    } catch {}
  }

  async closeAllPopups(context: BrowserContext): Promise<void> {
    const pages = context.pages();
    const mainPage = pages[0];

    for (const page of pages) {
      if (page !== mainPage) {
        await page.close();
      }
    }

    await mainPage.bringToFront();
  }

  async waitLoading(): Promise<void> {
    if (this.webActions) {
      await this.webActions.waitForSpinnerToDisappear('.loading-spinner');
    }
  }

  async clickUntilModalDisplayed(
    triggerSelector: string,
    modalSelector: string = '.modal-content',
  ): Promise<void> {
    try {
      await this.page.click(triggerSelector);
      await this.page.waitForSelector(modalSelector, { state: 'visible', timeout: 5000 });
    } catch (e) {
      throw new Error(`모달 표시 실패: ${modalSelector} — ${(e as Error).message}`);
    }
  }
}
