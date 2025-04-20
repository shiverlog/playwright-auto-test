/**
 * Description : AuthPage.ts - 📌 리다이렉션 확인 전 인증로직
 * Author : Shiwoo Min
 * Date : 2025-04-18
 */
import { WebActions } from '@common/actions/WebActions.js';
import { BaseModal } from '@common/components/BaseModal.js';
import { authLocator } from '@common/locators/authLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Logger } from '@common/logger/customLogger.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import { POCEnv } from '@common/utils/env/POCEnv.js';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type winston from 'winston';

export class AuthPage extends WebActions {
  protected modal: BaseModal;
  protected platform: Platform;
  protected uiType: UIType;

  constructor(page: Page) {
    super(page);
    this.modal = new BaseModal(page, undefined);
    this.platform = 'MOBILE_WEB';
    this.uiType = 'MOBILE';
  }

  // 홈페이지 이동
  async gotoHomePage(carrier: 'uplus' | 'kt' | 'skt') {
    const carrierUrlMap = {
      uplus: urlLocator.lguplusUrl,
      kt: urlLocator.ktUrl,
      skt: urlLocator.SktUrl,
    };

    const url = carrierUrlMap[carrier];
    await this.ensurePage().goto(url);
    await this.modal.checkCommonModals();
  }

  // 로그인 페이지 이동 (carrier별로 버튼 다름)
  async gotoLoginPage(carrier: 'uplus' | 'kt' | 'skt') {
    if (carrier === 'uplus') {
      await this.click(uiLocator.hamburger[this.uiType]);
      await this.click(authLocator.mainLoginButton[this.uiType]);
    } else if (carrier === 'kt') {
      await this.click(uiLocator.hamburger[this.uiType]);
      await this.click(authLocator.mainLoginButton[this.uiType]);
    } else if (carrier === 'skt') {
      await this.click(uiLocator.hamburger[this.uiType]);
      await this.click(authLocator.mainLoginButton[this.uiType]);
    }
    await this.ensurePage().waitForSelector(authLocator.loginTitle[this.uiType], { timeout: 5000 });
  }

  // 통신사별 로그인 시나리오 실행
  async loginByCarrier(carrier: 'uplus' | 'kt' | 'skt', id: string, pw: string): Promise<boolean> {
    try {
      await this.gotoHomePage(carrier);
      await this.gotoLoginPage(carrier);

      if (carrier === 'uplus') {
        await this.click(authLocator.uplusLoginButton);
        await this.ensurePage().waitForSelector(authLocator.uplusLoginTitle[this.uiType], {
          timeout: 5000,
        });
        await this.ensureJs().forceClick(authLocator.uplusClearButton);
        await this.typeTextSlowly(authLocator.uplusIdInput, id);
        if (await this.ensurePage().locator(authLocator.idTooltip).isVisible()) {
          await this.ensurePage().click(authLocator.uplusSaveButton);
        }
        await this.typeTextSlowly(authLocator.uplusPwInput, pw);
        await this.ensurePage().waitForTimeout(2000);
        await this.click(authLocator.uplusLoginSubmitButton);
      }

      if (carrier === 'kt') {
        await this.click(authLocator.ktLoginButton);
        await this.typeTextSlowly(authLocator.ktIdInput, id);
        await this.typeTextSlowly(authLocator.ktPwInput, pw);
        await this.ensurePage().waitForTimeout(2000);
        await this.click(authLocator.ktLoginSubmitButton);
      }

      if (carrier === 'skt') {
        await this.click(authLocator.sktLoginButton);
        await this.typeTextSlowly(authLocator.sktIdInput, id);
        await this.typeTextSlowly(authLocator.sktPwInput, pw);
        await this.ensurePage().waitForTimeout(2000);
        await this.click(authLocator.sktLoginSubmitButton);
      }

      try {
        await this.ensurePage().waitForURL(urlLocator.main[this.platform], { timeout: 10000 });
        await expect(this.ensurePage()).toHaveURL(urlLocator.main[this.platform]);
      } catch (urlError) {
        console.warn('[Login Error] URL 변경 감지 실패', urlError);
        return false;
      }

      await this.ensurePage().waitForTimeout(2000);
      return true;
    } catch (err) {
      console.error(`[Login Failed - ${carrier}]`, err);
      return false;
    }
  }
}
