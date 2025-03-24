/**
 * Description : modalHandler.ts - 📌 모달 예외처리 Fixture
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import type { Locator, Page } from '@playwright/test';

/**
 * ModalHandler: 모달 처리 유틸리티 클래스
 * - handleModal: 모달 유형에 따라 적절한 처리 수행
 * - determineModalType: 모달 유형 결정
 * - 모달별 개별 처리 함수 포함
 */
export class ModalHandler {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * ✅ 모달창의 타입을 결정하고 적절한 핸들러 호출
   */
  async determineModalType(): Promise<void> {
    try {
      await this.page.waitForSelector('.modal-content', { timeout: 5000 });

      const modalContent: Locator = this.page.locator('.modal-content');

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
        console.error('❌ 알 수 없는 모달 감지');
      }
    } catch (error) {
      console.error(`❌ 모달 타입 결정 중 오류 발생: ${error}`);
    }
  }

  /**
   * ✅ 모달 유형에 따라 적절한 핸들러 호출
   * @param modalType 감지된 모달 타입
   */
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
          console.error(`⚠️ 처리할 수 없는 모달창 타입: ${modalType}`);
      }
    } catch (error) {
      console.error(`❌ 모달창 처리 실패: ${error}`);
    }
  }

  /**
   * ✅ 이벤트 모달 처리
   */
  async handleEventModal(): Promise<void> {
    console.log('🎉 이벤트 모달 처리 중...');
    const closeButton = this.page.locator('.event-modal-close');
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await this.page.waitForSelector('.event-modal', { state: 'hidden' });
      console.log('✅ 이벤트 모달 닫힘 완료');
    }
  }

  /**
   * ✅ 확인 모달 처리
   */
  async handleConfirmModal(): Promise<void> {
    try {
      console.log('🔔 확인 모달 처리 중...');
      const confirmButton = this.page.locator('div.c-btn-group button.c-btn-solid-1-m');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        await this.page.waitForSelector('div.modal-dialog', { state: 'hidden' });
        console.log('✅ 확인 모달 닫힘 완료');
      }
    } catch (error) {
      console.error(`❌ 확인 모달 처리 실패: ${error}`);
    }
  }

  /**
   * ✅ 주소 찾기 모달 처리
   */
  async handleAddressModal(): Promise<void> {
    try {
      console.log('📍 주소 찾기 모달 처리 중...');
      const addressInput = this.page.locator('#address-search-input');
      await addressInput.fill('서울특별시 강남구 테헤란로');
      const searchButton = this.page.locator('#address-search-btn');
      await searchButton.click();
      await this.page.waitForSelector('.modal-content', { state: 'hidden' });
      console.log('✅ 주소 찾기 완료');
    } catch (error) {
      console.error(`❌ 주소 찾기 모달 처리 실패: ${error}`);
    }
  }

  /**
   * ✅ 마켓 팝업 모달 처리
   */
  async handleMarketPopupModal(): Promise<void> {
    try {
      console.log('🛍️ 마켓 팝업 모달 처리 중...');
      const closeButton = this.page.locator('.market-popup-close');
      if (await closeButton.isVisible()) {
        await closeButton.click();
        await this.page.waitForSelector('.market-popup', { state: 'hidden' });
        console.log('✅ 마켓 팝업 모달 닫힘 완료');
      }
    } catch (error) {
      console.error(`❌ 마켓 팝업 모달 처리 실패: ${error}`);
    }
  }
}
