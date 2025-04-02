/**
 * Description : BaseModal.ts - 📌 전체 모달 처리 컨포넌트
 * Author : Shiwoo Min
 * Date : 2025-04-02
 */
import { BaseActionUtils } from '@common/actions/BaseActionUtils';
import { MobileActionUtils } from '@common/actions/MobileActionUtils';
import { WebActionUtils } from '@common/actions/WebActionUtils';
import type { BrowserContext, Page } from '@playwright/test';
import type { Browser } from 'webdriverio';

export class BaseModal {
  // Playwright Page 인스턴스
  protected page: Page;
  // Appium 등 Browser 인스턴스(Option - App 환경만 적용)
  protected driver?: Browser;
  // Playwright + Appium  공통유틸
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

  // 생성자를 써서 초기화
  constructor(page: Page, driver?: Browser) {
    this.page = page;
    this.driver = driver;

    this.baseActions = new BaseActionUtils(page, driver!);

    // 모바일 여부에 따라 모바일/웹 액션 클래스 분기 초기화
    if (driver) {
      this.mobileActions = new MobileActionUtils(page, driver);
    } else {
      this.webActions = new WebActionUtils(page!);
    }
  }

  // 현재 테스트 환경이 웹인지 여부 반환
  isWeb(): boolean {
    return !!this.webActions;
  }

  // 현재 테스트 환경이 모바일인지 여부 반환
  isMobile(): boolean {
    return !!this.mobileActions;
  }

  // 현재 활성화된 모달 타입을 판단하여 적절한 처리 함수 호출
  async determineModalType(): Promise<void> {
    try {
      await this.page.waitForSelector('.modal-content', { timeout: 5000 });
      const modalContent = this.page.locator('.modal-content');

      if (await modalContent.locator(".pop-tit-1:has-text('주소찾기')").count()) {
        await this.modalHandler('address_modal');
      } else if (
        (await modalContent.locator(".h3:has-text('확인')").count()) &&
        (await modalContent.locator(".modal-footer button:has-text('확인')").count())
      ) {
        await this.modalHandler('confirm_modal');
      } else if (await modalContent.locator(".pop-tit-1:has-text('4G 요금제 선택')").count()) {
        await this.modalHandler('plan_select_modal');
      } else {
        console.warn('[Modal] 알 수 없는 모달 감지');
      }
    } catch (error) {
      console.error(`[Modal] 모달 타입 결정 중 오류 발생: ${error}`);
    }
  }

  // 모달 타입에 따라 대응 핸들러
  async modalHandler(modalType: string): Promise<void> {
    try {
      switch (modalType) {
        case 'event_modal':
          await this.eventModalHandler();
          break;
        case 'confirm_modal':
          await this.confirmModalHandler();
          break;
        case 'address_modal':
          await this.addressModalHandler();
          break;
        case 'market_popup_modal':
          await this.marketPopupModalHandler();
          break;
        default:
          console.warn(`[Modal] 처리할 수 없는 모달 타입: ${modalType}`);
      }
    } catch (error) {
      console.error(`[Modal] 모달 처리 중 에러 발생: ${error}`);
    }
  }

  // 이벤트 모달 닫기 버튼 클릭 후 모달이 닫힐 때까지 대기
  async eventModalHandler(): Promise<void> {
    const closeButton = this.page.locator('.event-modal-close');
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await this.page.waitForSelector('.event-modal', { state: 'hidden' });
    }
  }

  // 정보 모달 확인 버튼 클릭 후 모달 닫힘 확인
  async confirmModalHandler(): Promise<void> {
    const confirmBtn = this.page.locator('div.c-btn-group button.c-btn-solid-1-m');
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await this.page.waitForSelector('div.modal-dialog', { state: 'hidden' });
    }
  }

  // 주소찾기 모달 주소 입력 후 검색 버튼 클릭, 모달이 닫힐 때까지 대기
  async addressModalHandler(): Promise<void> {
    const input = this.page.locator('#address-search-input');
    const button = this.page.locator('#address-search-btn');

    await input.fill('서울특별시 강남구 테헤란로');
    await button.click();
    await this.page.waitForSelector('.modal-content', { state: 'hidden' });
  }

  // 마켓 팝업 닫기 버튼 클릭 후 팝업이 닫힐 때까지 대기
  async marketPopupModalHandler(): Promise<void> {
    const closeButton = this.page.locator('.market-popup-close');
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await this.page.waitForSelector('.market-popup', { state: 'hidden' });
    }
  }

  /**
   * 로딩/딤드 레이어 등을 고려한 공통 팝업 처리 흐름
   * - 로딩 상태 확인
   * - 체크박스, 닫기 버튼 확인
   */
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
