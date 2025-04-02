import type { Browser } from 'webdriverio';

export class SafariAccessUtils {
  constructor(
    private driver: Browser,
    private switchContext: (view?: string) => void,
  ) {}

  /**
   * Safari 실행 후 최초 팝업/권한 등을 자동 처리
   */
  async handleSafariSetup(): Promise<void> {
    this.switchContext('NATIVE_APP');
    await this.driver.setTimeout({ implicit: 2000 });

    const stepLabels = ['Continue', 'Allow', 'Not Now', 'Done'];

    for (const label of stepLabels) {
      const el = await this.findElementByLabel(label);
      if (el) await el.click();
    }

    await this.driver.setTimeout({ implicit: 20000 });
  }

  /**
   * Safari 방문 기록 및 웹사이트 데이터 지우기
   * iOS 설정 앱 > Safari > 방문 기록 지우기 흐름 자동화
   */
  async clearSafariCache(): Promise<void> {
    try {
      this.switchContext('NATIVE_APP');
      await this.driver.activateApp('com.apple.Preferences');
      await this.pause(1500);

      await this.swipeUp();

      const safari = await this.findElementByLabel('Safari');
      if (safari) await safari.click();

      await this.pause(1000);
      await this.swipeUp();
      await this.swipeUp();

      const clearData = await this.findElementByLabel('방문 기록 및 웹사이트 데이터 지우기');
      if (clearData) await clearData.click();

      const confirm = await this.findElementByLabel('모든 방문 기록');
      if (confirm) await confirm.click();

      const tabClose = await this.findElementByLabel('모든 탭 닫기');
      if (tabClose && (await tabClose.getAttribute('value')) === '0') {
        await tabClose.click();
      }

      const finalConfirm = await this.findElementByLabel('방문 기록 지우기');
      if (finalConfirm) await finalConfirm.click();

      // 다시 원래 앱으로 복귀
      await this.driver.activateApp('com.lguplus.mobile.cs');
      this.switchContext();
    } catch (e) {
      console.error('[SafariAccessUtils] 예외 발생:', e);
      await this.driver.activateApp('com.lguplus.mobile.cs');
      this.switchContext();
    }
  }

  /**
   * label을 가진 요소 탐색
   */
  private async findElementByLabel(label: string) {
    try {
      const el = await this.driver.$(`-ios predicate string:label == "${label}" AND visible == 1`);
      if (await el.isDisplayed()) return el;
      return null;
    } catch {
      return null;
    }
  }

  /**
   * 위로 스와이프
   */
  private async swipeUp(): Promise<void> {
    const { height, width } = await this.driver.getWindowSize();
    const startY = Math.floor(height * 0.8);
    const endY = Math.floor(height * 0.2);
    const startX = Math.floor(width / 2);

    await this.driver.touchPerform([
      { action: 'press', options: { x: startX, y: startY } },
      { action: 'wait', options: { ms: 300 } },
      { action: 'moveTo', options: { x: startX, y: endY } },
      { action: 'release' },
    ]);

    await this.pause(1000);
  }

  private async pause(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
