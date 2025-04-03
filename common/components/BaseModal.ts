/**
 * Description : BaseModal.ts - 📌 전체 모달 처리 컨포넌트
 * Author : Shiwoo Min
 * Date : 2025-04-02
 */
import { BaseActionUtils } from '@common/actions/BaseActionUtils';
import { MobileActionUtils } from '@common/actions/MobileActionUtils';
import { WebActionUtils } from '@common/actions/WebActionUtils';
import { Platform, UIType } from '@common/constants/ContextConstants.js';
import { mobileMenuLocator, overlayLocator } from '@common/locators/uiLocator';
import { urlLocator } from '@common/locators/urlLocator';
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

  // 모달 타입에 따라 대응 핸들러
  async modalHandler(modalType: string): Promise<void> {
    try {
      switch (modalType) {
        // 메인 공지 모달
        case 'notice_modal':
          await this.noticeModalHandler();
          break;
        // 확인 모달
        case 'confirm_modal':
          await this.confirmModalHandler();
          break;
        // 인터스티셜 모달
        case 'interstitial_modal':
          await this.interstitialModalHandler();
          break;
        // 이벤트 모달
        case 'event_modal':
          await this.eventModalHandler();
          break;
        // 어드레스 모달(배송관련)
        case 'address_modal':
          await this.addressModalHandler();
          break;
        // 모바일 마켓 팝업 모달
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

  // 현재 활성화된 모달 타입을 판단하여 적절한 처리 함수 호출
  async determineModalType(): Promise<void> {
    try {
      const { modalContent, modalHeader } = overlayLocator;

      // 모달 감지 대기
      await this.page.waitForSelector(modalContent, { timeout: 5000 });

      const header = this.page.locator(modalHeader);
      const titleText = await header.textContent();

      // 제목 또는 내용 기반으로 모달 타입 판단
      if (titleText?.includes('공지')) {
        await this.modalHandler('notice_modal');
      } else {
        console.warn('[Modal] 알 수 없는 모달 감지됨');
      }
    } catch (error) {
      console.error(`[Modal] 모달 타입 결정 중 오류 발생: ${error}`);
    }
  }

  // 메인 공지 모달 닫기 버튼 클릭 후 모달이 닫힐 때까지 대기
  async noticeModalHandler(): Promise<void> {
    const { modalTodayOnlyOnceButton, modalFooterClose } = overlayLocator;

    // "오늘 하루 보지 않기" 버튼이 보이면 클릭
    const todayOnlyOnceBtn = this.page.locator(`xpath=${modalTodayOnlyOnceButton}`);
    if (await todayOnlyOnceBtn.isVisible()) {
      await todayOnlyOnceBtn.click();
      await this.page.waitForSelector(overlayLocator.modalContent, { state: 'hidden' });
      return;
    }

    // 없으면 "닫기" 버튼 클릭
    const closeBtn = this.page.locator(`xpath=${modalFooterClose}`);
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await this.page.waitForSelector(overlayLocator.modalContent, { state: 'hidden' });
    }
  }

  // 이벤트 모달 닫기
  async eventModalHandler(): Promise<void> {
    const closeButton = this.page.locator(`xpath=${overlayLocator.modalFooterClose}`);
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await this.page.waitForSelector(overlayLocator.modalContent, { state: 'hidden' });
    }
  }

  // 인터스티셜 모달 닫기
  async interstitialModalHandler(): Promise<void> {
    const closeButton = this.page.locator(`xpath=${overlayLocator.modalFooterClose}`);
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await this.page.waitForSelector(overlayLocator.modalContent, { state: 'hidden' });
    }
  }

  // 확인 모달 닫기 (확인 버튼 클릭으로 처리)
  async confirmModalHandler(): Promise<void> {
    const confirmButton = this.page.locator(`xpath=${overlayLocator.modalConfirm}`);
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
      await this.page.waitForSelector(overlayLocator.modalContent, { state: 'hidden' });
    }
  }

  // 마켓 팝업 모달 닫기
  async marketPopupModalHandler(): Promise<void> {
    const closeButton = this.page.locator(`xpath=${overlayLocator.modalFooterClose}`);
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await this.page.waitForSelector(overlayLocator.modalContent, { state: 'hidden' });
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

  /**
   * 로딩/딤드 레이어 등을 고려한 공통 팝업 처리 흐름
   * - 로딩 상태 확인
   * - 체크박스, 닫기 버튼 확인
   */
  async checkCommonModals(): Promise<void> {
    try {
      const closeBtn = this.page.locator(`xpath=${overlayLocator.modalFooterClose}`);
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await this.page.waitForSelector(overlayLocator.modalContent, { state: 'hidden' });
      }
    } catch {
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * 모든 팝업 페이지 닫고 메인 페이지로 전환
   */
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

  /**
   * 특정 트리거를 눌렀을 때 모달이 뜰 때까지 기다리는 유틸
   */
  async clickUntilModalDisplayed(
    triggerSelector: string,
    modalSelector: string = overlayLocator.modalContent,
  ): Promise<void> {
    try {
      await this.baseActions.click(triggerSelector);
      await this.page.waitForSelector(modalSelector, {
        state: 'visible',
        timeout: 5000,
      });
    } catch (e) {
      throw new Error(`모달 표시 실패: ${modalSelector} — ${(e as Error).message}`);
    }
  }
}
