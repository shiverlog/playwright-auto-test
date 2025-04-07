/**
 * Description : IOSPermissionsUtils.ts - 📌 iOS 기반 초기 권한 처리 유틸
 * Author : Shiwoo Min
 * Date : 2024-04-04
 */
import type { POCKey } from '@common/types/platform-types';
import { BasePermissionsUtils } from '@common/utils/appium/BasePermissionsUtils';
import type { Browser } from 'webdriverio';

export class IOSPermissionsUtils extends BasePermissionsUtils {
  public async handleInitialPopups(): Promise<void> {
    const labels = [
      'Allow',
      'Allow While Using App',
      'OK',
      "Don't Allow",
      '허용',
      '앱을 사용하는 동안 허용',
      '확인',
      '나중에',
      '동의',
    ];

    for (const label of labels) {
      try {
        const el = await this.driver.$(
          `-ios predicate string:label == "${label}" AND visible == 1`,
        );
        if (await el.isDisplayed()) {
          await el.click();
          this.logger.info(`[iOS Permissions] 팝업 자동 클릭: ${label}`);
        }
      } catch {
        // 무시: 요소가 없을 수도 있음
      }
    }
  }

  /**
   * iOS 시스템 설정에서 Safari 등 특정 앱의 권한 팝업 대응
   */
  public async handleSafariSystemPermissions(): Promise<void> {
    try {
      const safariLabels = [
        '방문 기록 및 웹사이트 데이터 지우기',
        '모든 방문 기록',
        '모든 탭 닫기',
        '방문 기록 지우기',
      ];

      for (const label of safariLabels) {
        const el = await this.driver.$(
          `-ios predicate string:label == "${label}" AND visible == 1`,
        );
        if (await el.isDisplayed()) {
          await el.click();
          this.logger.info(`[iOS Safari] 설정 클릭 처리: ${label}`);
        }
      }
    } catch (error) {
      this.logger.error('[iOS Safari] Safari 권한 처리 실패:', error);
    }
  }
}
