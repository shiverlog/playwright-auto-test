/**
 * Description : BaseModal.ts - 📌 전체 모달 처리 컨포넌트
 * Author : Shiwoo Min
 * Date : 2025-04-02
 */
import { BaseActions } from '@common/actions/BaseActions.js';
import { MobileActions } from '@common/actions/MobileActions.js';
import { WebActions } from '@common/actions/WebActions.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { BrowserContext, Page } from '@playwright/test';
import type { Browser } from 'webdriverio';

export class BaseModal {
  // Playwright Page 인스턴스
  protected page?: Page;

  // Appium 등 Browser 인스턴스
  protected driver?: Browser;
  protected baseActions: BaseActions;
  protected webActions?: WebActions;
  protected mobileActions?: MobileActions;

  constructor(page?: Page, driver?: Browser) {
    this.page = page;
    this.driver = driver;

    // page가 없으면 BaseActions 생성 불가 -> 에러 방지
    if (page) {
      this.baseActions = new BaseActions(page, driver);
      // Appium 드라이버가 있으면 모바일 액션 유틸로 분기
      if (driver !== undefined) {
        // Mobile 은 page 가 옵션이므로 뒤로 위치
        this.mobileActions = new MobileActions(driver, page);
      } else {
        // 드라이버가 없으면 Web 전용 유틸 사용
        this.webActions = new WebActions(page);
      }
    } else {
      throw new Error('[BaseModal] page 객체가 필요합니다.');
    }
  }

  // 페이지 객체를 안전하게 반환
  protected ensurePage(): Page {
    if (!this.page) throw new Error('[BaseModal] page가 설정되지 않았습니다.');
    return this.page;
  }

  // 현재 테스트 환경이 웹인지 여부
  isWeb(): boolean {
    return !!this.webActions;
  }

  // 현재 테스트 환경이 모바일인지 여부
  isMobile(): boolean {
    return !!this.mobileActions;
  }

  // 모달 타입에 따라 핸들러 호출
  async modalHandler(modalType: string): Promise<void> {
    try {
      switch (modalType) {
        case 'notice_modal':
          await this.noticeModalHandler();
          break;
        case 'confirm_modal':
          await this.confirmModalHandler();
          break;
        case 'interstitial_modal':
          await this.interstitialModalHandler();
          break;
        case 'event_modal':
          await this.eventModalHandler();
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

  // 모달 내용 기반으로 모달 타입 결정
  async determineModalType(): Promise<void> {
    try {
      const { modalContent, modalHeader } = uiLocator;
      await this.ensurePage().waitForSelector(modalContent, { timeout: 5000 });
      const header = this.ensurePage().locator(modalHeader);
      const titleText = await header.textContent();

      if (titleText?.includes('공지')) {
        await this.modalHandler('notice_modal');
      } else {
        console.warn('[Modal] 알 수 없는 모달 감지됨');
      }
    } catch (error) {
      console.error(`[Modal] 모달 타입 결정 중 오류 발생: ${error}`);
    }
  }

  // 공지 모달 닫기
  async noticeModalHandler(): Promise<void> {
    const { modalTodayOnlyOnceButton, modalFooterClose } = uiLocator;
    const todayOnlyOnceBtn = this.ensurePage().locator(`xpath=${modalTodayOnlyOnceButton}`);

    if (await todayOnlyOnceBtn.isVisible()) {
      await todayOnlyOnceBtn.click();
      await this.ensurePage().waitForSelector(uiLocator.modalContent, { state: 'hidden' });
      return;
    }

    const closeBtn = this.ensurePage().locator(`xpath=${modalFooterClose}`);
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await this.ensurePage().waitForSelector(uiLocator.modalContent, { state: 'hidden' });
    }
  }

  // 이벤트 모달 닫기
  async eventModalHandler(): Promise<void> {
    const closeButton = this.ensurePage().locator(`xpath=${uiLocator.modalFooterClose}`);
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await this.ensurePage().waitForSelector(uiLocator.modalContent, { state: 'hidden' });
    }
  }

  // 인터스티셜 모달 닫기
  async interstitialModalHandler(): Promise<void> {
    const closeButton = this.ensurePage().locator(`xpath=${uiLocator.modalFooterClose}`);
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await this.ensurePage().waitForSelector(uiLocator.modalContent, { state: 'hidden' });
    }
  }

  // 확인 모달 닫기
  async confirmModalHandler(): Promise<void> {
    const confirmButton = this.ensurePage().locator(`xpath=${uiLocator.modalConfirm}`);
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
      await this.ensurePage().waitForSelector(uiLocator.modalContent, { state: 'hidden' });
    }
  }

  // 마켓 팝업 모달 닫기
  async marketPopupModalHandler(): Promise<void> {
    const closeButton = this.ensurePage().locator(`xpath=${uiLocator.modalFooterClose}`);
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await this.ensurePage().waitForSelector(uiLocator.modalContent, { state: 'hidden' });
    }
  }

  // 주소찾기 모달 처리
  async addressModalHandler(): Promise<void> {
    const input = this.ensurePage().locator('#address-search-input');
    const button = this.ensurePage().locator('#address-search-btn');
    await input.fill('서울특별시 강남구 테헤란로');
    await button.click();
    await this.ensurePage().waitForSelector('.modal-content', { state: 'hidden' });
  }

  // 공통 팝업 체크 후 닫기
  async checkCommonModals(): Promise<void> {
    try {
      const closeBtn = this.ensurePage().locator(`xpath=${uiLocator.modalFooterClose}`);
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await this.ensurePage().waitForSelector(uiLocator.modalContent, { state: 'hidden' });
      }
    } catch {
      await this.ensurePage().waitForTimeout(500);
    }
  }

  // 모든 팝업 페이지 닫고 메인 페이지로 전환
  async closeAllPopups(context: BrowserContext): Promise<void> {
    const pages = context.pages();
    const mainPage = pages[0];

    for (const page of pages) {
      if (page !== mainPage && !page.isClosed()) {
        await page.close();
      }
    }

    await mainPage.bringToFront();
  }

  // 특정 요소 클릭 후 모달이 뜰 때까지 대기
  async clickUntilModalDisplayed(
    triggerSelector: string,
    modalSelector: string = uiLocator.modalContent,
  ): Promise<void> {
    try {
      await this.baseActions.click(triggerSelector);
      await this.ensurePage().waitForSelector(modalSelector, {
        state: 'visible',
        timeout: 5000,
      });
    } catch (e) {
      throw new Error(`모달 표시 실패: ${modalSelector} — ${(e as Error).message}`);
    }
  }
}
