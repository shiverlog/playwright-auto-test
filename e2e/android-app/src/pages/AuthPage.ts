import { MobileActionUtils } from '@common/actions/MobileActionUtils.js';
import { BaseModal } from '@common/components/BaseModal.js';
import { authLocator } from '@common/locators/authLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Page } from '@playwright/test';
import type { Browser } from 'webdriverio';

export class AuthPage extends MobileActionUtils {
  protected modal: BaseModal;
  protected platform: Platform;
  protected uiType: UIType;

  constructor(page: Page | undefined, driver: Browser) {
    // page가 option이라 뒤로 위치
    super(driver, page);

    this.platform = 'ANDROID_APP';
    this.uiType = 'APP';

    // page가 존재할 때에만 BaseModal, WebView 설정 적용
    if (page) {
      this.modal = new BaseModal(page);
      this.setPlaywrightPage(page);
    } else {
      // page가 없을 경우에도 modal을 생성하되 page 없이 생성 가능하게 처리
      this.modal = new BaseModal(undefined);
    }
  }

  // 앱 첫 화면에서 '로그인하지 않고 입장할게요' 클릭
  async gotoHomePage(): Promise<void> {
    await this.switchToNativeContext();
    await this.click(authLocator.guestButton[this.uiType]);
    await this.driver.pause(2000);
  }

  // 로그인 버튼 → ID 로그인
  async gotoLoginPage(): Promise<void> {
    await this.click(authLocator.mainLoginButton[this.uiType]);
    // WebView 사용 시 아래 로직 활성화 예정
    // await this.waitForVisibleWeb(authLocator.loginTitle[this.uiType]);
  }

  // LG U+ 로그인 시나리오
  async doUplusLogin(id: string, pw: string): Promise<boolean> {
    try {
      await this.gotoHomePage();
      await this.gotoLoginPage();
      await this.click(authLocator.uplusLoginButton);
      await this.type(authLocator.uplusIdInput, id);
      await this.type(authLocator.uplusPwInput, pw);
      await this.driver.pause(2000);
      await this.click(authLocator.uplusLoginSubmitButton);

      try {
        await this.driver.waitUntil(
          async () => {
            const currentUrl = await this.driver.getUrl();
            return currentUrl.includes(urlLocator.main[this.platform]);
          },
          { timeout: 10000, timeoutMsg: 'Expected URL to change after login' },
        );
        return true;
      } catch (urlError) {
        console.warn('[Login Error] URL 변경 감지 실패', urlError);
        return false;
      }
    } catch (err) {
      console.error('[Login Failed]', err);
      return false;
    }
  }
}
