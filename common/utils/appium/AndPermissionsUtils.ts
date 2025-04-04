/**
 * Description : AndPermissionsUtils.ts - 📌 Android 기반 초기 권한 처리 유틸
 * Author : Shiwoo Min
 * Date : 2024-04-04
 */
import type { POCKey } from '@common/types/platform-types';
import { BasePermissionsUtils } from '@common/utils/appium/BasePermissionsUtils';
import type { Browser } from 'webdriverio';

export class AndPermissionsUtils extends BasePermissionsUtils {
  constructor(
    driver: Browser,
    private varMap: Record<string, string>,
    poc?: POCKey,
  ) {
    super(driver, poc);
  }

  public async grantAllPermissions(): Promise<void> {
    const findXPath = async (key: string) => await this.driver.$(`xpath=${this.varMap[key]}`);
    const findId = async (key: string) => await this.driver.$(`id=${this.varMap[key]}`);
    const findCss = async (key: string) => await this.driver.$(`css=${this.varMap[key]}`);

    try {
      const nextBtn = await findXPath('다음버튼');
      if (await nextBtn.isDisplayed()) {
        await nextBtn.click();
        this.logger.info(`[Android Permissions] '다음버튼' 클릭됨`);

        await (await findId('앱_사용중에만_허용')).click();
        for (let i = 0; i < 3; i++) await (await findId('허용_버튼')).click();
        await (await findId('모두허용_버튼')).click();
        await (await findId('동의_버튼')).click();
      }

      const skip1 = await findXPath('로그인하지_않고_입장할게요');
      if (await skip1.isDisplayed()) await skip1.click();

      const skip2 = await findXPath('로그인없이_입장하기');
      if (await skip2.isDisplayed()) await skip2.click();

      await this.driver.switchContext('WEBVIEW_com.lguplus.mobile.cs');

      const webSkip = await findCss('withoutLogin');
      if (await webSkip.isDisplayed()) await webSkip.click();
    } catch (error) {
      this.logger.error('[Android Permissions] 자동 권한 처리 실패:', error);
    }
  }
}
