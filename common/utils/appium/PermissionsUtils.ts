/**
 * Description : PermissionsUtils.ts - 📌 Android/iOS 통합 초기 권한 처리 유틸
 * Author : Shiwoo Min
 * Date : 2024-04-10
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

export class PermissionsUtils {
  // 현재 POC 키 (null 보호 차원)
  private readonly poc: string = POCEnv.getType() ?? 'GLOBAL';
  // 로그 인스턴스
  private readonly logger: winston.Logger = Logger.getLogger(this.poc) as winston.Logger;
  // 드라이버 인스턴스
  private readonly driver: Browser;

  constructor(driver: Browser) {
    this.driver = driver;
  }

  /**
   * iOS 권한 팝업 자동 클릭 처리
   */
  public async handleIOSPopups(): Promise<void> {
    const labels = [
      'Allow',
      'Allow While Using App',
      'OK',
      "Don't Allow",
      '허용',
      '앱을 사용하는 동안 허용',
      '확인',
      '남지어',
      '동의',
    ];

    for (const label of labels) {
      try {
        const el = await this.driver.$(
          `-ios predicate string:label == "${label}" AND visible == 1`,
        );
        if (await el.isDisplayed()) {
          await el.click();
          this.logger.info(`[iOS Permissions][${this.poc}] 팝업 자동 클릭: ${label}`);
        }
      } catch {
        // 무시: 요소가 없을 수도 있음
      }
    }
  }

  /**
   * iOS Safari 시스템 설정에서 권한 처리
   */
  public async handleSafariSystemPermissions(): Promise<void> {
    try {
      const safariLabels = [
        '방문 기록 및 웹사이트 데이터 지우기',
        '모든 방문 기록',
        '모든 타블 닫기',
        '방문 기록 지우기',
      ];

      for (const label of safariLabels) {
        const el = await this.driver.$(
          `-ios predicate string:label == "${label}" AND visible == 1`,
        );
        if (await el.isDisplayed()) {
          await el.click();
          this.logger.info(`[iOS Safari][${this.poc}] 설정 클릭 처리: ${label}`);
        }
      }
    } catch (error) {
      this.logger.error(`[iOS Safari][${this.poc}] Safari 권한 처리 실패:`, error);
    }
  }

  /**
   * Android 권한 팝업 자동 클릭 처리
   */
  public async handleAndroidPopups(): Promise<void> {
    const selectors = [
      'com.android.chrome:id/signin_fre_continue_button',
      'com.android.chrome:id/button_primary',
      'com.android.chrome:id/ack_button',
      'com.android.chrome:id/negative_button',
      'com.android.permissioncontroller:id/permission_allow_button',
    ];

    for (const selector of selectors) {
      try {
        const el = await this.driver.$(`id=${selector}`);
        if (await el.isDisplayed()) {
          await el.click();
          this.logger.info(`[Android Permissions][${this.poc}] 버튼 클릭됨: ${selector}`);
        }
      } catch {
        // 무시: 요소가 없을 수도 있음
      }
    }
  }

  /**
   * 통합 처리: iOS Safari 권한 + Android/iOS 팝업 자동 처리
   */
  public async handleAllPermissions(): Promise<void> {
    await this.handleIOSPopups();
    await this.handleAndroidPopups();
    await this.handleSafariSystemPermissions();
  }
}
