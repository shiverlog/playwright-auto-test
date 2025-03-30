import { execSync } from 'child_process';
import type { Browser } from 'webdriverio';

export type ChromeFlavor = 'stable' | 'beta' | 'v125' | 'v130' | 'v135';

interface ChromeAccessConfig {
  pkgPrefix: string;
  stepIds: string[];
}

const CHROME_CONFIGS: Record<ChromeFlavor, ChromeAccessConfig> = {
  stable: {
    pkgPrefix: 'com.android.chrome:id',
    stepIds: [
      'terms_accept',
      'signin_fre_continue_button',
      'positive_button',
      'negative_button',
      'com.android.permissioncontroller:id/permission_allow_button',
    ],
  },
  beta: {
    pkgPrefix: 'com.chrome.beta:id',
    stepIds: [
      'signin_fre_continue_button',
      'button_primary',
      'terms_accept',
      'positive_button',
      'com.android.permissioncontroller:id/permission_allow_button',
    ],
  },
  v125: {
    pkgPrefix: 'com.android.chrome:id',
    stepIds: [
      'signin_fre_continue_button',
      'button_primary',
      'terms_accept',
      'positive_button',
      'com.android.permissioncontroller:id/permission_allow_button',
    ],
  },
  v130: {
    pkgPrefix: 'com.android.chrome:id',
    stepIds: [
      'button_primary',
      'signin_fre_continue_button',
      'terms_accept',
      'positive_button',
      'com.android.permissioncontroller:id/permission_allow_button',
    ],
  },
  v135: {
    pkgPrefix: 'com.android.chrome:id',
    stepIds: [
      'button_primary',
      'signin_fre_continue_button',
      'terms_accept',
      'positive_button',
      'com.android.permissioncontroller:id/permission_allow_button',
    ],
  },
};

export class ChromeAccessUtils {
  constructor(
    private driver: Browser,
    private switchContext: (view: string) => void,
    private udid: string, // ADB 연결 디바이스 ID
  ) {}

  /**
   * 지정된 Chrome 버전/채널(flavor)에 따라 초기 설정 팝업을 자동으로 처리
   */
  async handleChromeSetup(flavor: ChromeFlavor): Promise<void> {
    const config = CHROME_CONFIGS[flavor];

    this.switchContext('NATIVE_APP');
    await this.driver.setTimeout({ implicit: 2000 });

    for (const id of config.stepIds) {
      const fullId = id.includes(':') ? id : `${config.pkgPrefix}/${id}`;
      const el = await this.findElementIfExists(fullId);
      if (el) await el.click();
    }

    await this.driver.setTimeout({ implicit: 20000 });
  }

  /**
   * 자동으로 Chrome 버전을 감지해 적절한 flavor로 초기 설정을 수행
   */
  async autoHandleChromeSetup(): Promise<void> {
    const caps = this.driver.capabilities;
    const version = (caps.browserVersion || (caps as any).platformVersion || '0.0') as string;
    const flavor = detectChromeFlavor(version);
    await this.handleChromeSetup(flavor);
  }

  /**
   * Chrome 앱 데이터 전체 초기화 (ADB: pm clear)
   */
  clearChromeAppData(): void {
    const packageName = 'com.android.chrome';
    try {
      const result = execSync(`adb -s ${this.udid} shell pm clear ${packageName}`, {
        encoding: 'utf-8',
      });

      if (!result.includes('Success')) {
        console.warn(`[ADB] Chrome clear 실패: ${result}`);
        throw new Error(`Chrome 데이터 초기화 실패`);
      }

      console.log('[ADB] Chrome 앱 데이터 초기화 완료');
    } catch (e) {
      console.error('[ADB] chrome_clear 예외:', e);
    }
  }

  /**
   * Chrome의 특정 초기화 시나리오를 수동 처리 (단순 고정된 ID 클릭)
   * 기본 버전과는 별개로 강제 클릭 순서를 지정할 때 사용
   */
  async chromeAccessBasic(): Promise<void> {
    this.switchContext('NATIVE_APP');
    await this.driver.setTimeout({ implicit: 2000 });

    const tryClick = async (resourceId: string) => {
      const el = await this.findElementIfExists(resourceId);
      if (el) await el.click();
    };

    await tryClick('com.android.chrome:id/signin_fre_continue_button');
    await tryClick('com.android.chrome:id/button_primary');
    await tryClick('com.android.chrome:id/ack_button');

    const negativeBtn = await this.findElementIfExists('com.android.chrome:id/negative_button');
    if (negativeBtn) {
      await negativeBtn.click();
      await tryClick('com.android.permissioncontroller:id/permission_allow_button');
    }

    await this.driver.setTimeout({ implicit: 20000 });
    this.switchContext('WEBVIEW_com.lguplus.mobile.cs');
  }

  /**
   * 해당 리소스 ID에 해당하는 요소가 존재하면 반환, 아니면 null
   */
  private async findElementIfExists(resourceId: string) {
    try {
      const el = await this.driver.$(`id=${resourceId}`);
      if (await el.isDisplayed()) {
        return el;
      }
      return null;
    } catch {
      return null;
    }
  }
}

/**
 * Chrome 버전 문자열을 받아 적절한 flavor로 매핑
 */
export function detectChromeFlavor(version: string): ChromeFlavor {
  const major = parseInt(version.split('.')[0], 10);

  if (isNaN(major)) return 'stable';
  if (major >= 135) return 'v135';
  if (major >= 130) return 'v130';
  if (major >= 125) return 'v125';

  return 'stable';
}
