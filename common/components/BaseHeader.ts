// /**
//  * Description : BaseHeader.ts - 📌 헤더/GNB 컨포넌트
//  * Author : Shiwoo Min
//  * Date : 2025-04-01
//  */
// import { BaseActionUtils } from '@common/actions/BaseActionUtils.js';
// import { MobileActionUtils } from '@common/actions/MobileActionUtils.js';
// import { WebActionUtils } from '@common/actions/WebActionUtils';
// import { uiLocator } from '@common/locators/uiLocator.js';
// import { urlLocator } from '@common/locators/urlLocator.js';
// import { Platform, UIType } from '@common/types/platform-types.js';
// import type { BrowserContext, Page } from '@playwright/test';
// import type { Browser } from 'webdriverio';

// export class BaseHeader {
//   // Playwright Page 인스턴스
//   protected page: Page;
//   // Appium 등 Browser 인스턴스(Option - App 환경만 적용)
//   protected driver?: Browser;
//   // Playwright + Appium  공통유틸
//   protected baseActions: BaseActionUtils;
//   protected webActions?: WebActionUtils;
//   protected mobileActions?: MobileActionUtils;

//   // 생성자를 써서 초기화
//   constructor(page: Page, driver?: Browser) {
//     this.page = page;
//     this.driver = driver;

//     this.baseActions = new BaseActionUtils(page, driver!);

//     // 모바일 여부에 따라 모바일/웹 액션 클래스 분기 초기화
//     if (driver) {
//       this.mobileActions = new MobileActionUtils(page, driver);
//     } else {
//       this.webActions = new WebActionUtils(page!);
//     }
//   }

//   // 현재 테스트 환경이 웹인지 여부 반환
//   isWeb(): boolean {
//     return !!this.webActions;
//   }

//   // 현재 테스트 환경이 모바일인지 여부 반환
//   isMobile(): boolean {
//     return !!this.mobileActions;
//   }

//   /**
//    * 햄버거 메뉴를 클릭하고 지정된 메뉴들을 순서대로 클릭하여 특정 URL로 이동
//    */
//   // async goToHamburgerMenu(menuSelectors: string[], expectedUrl: string): Promise<boolean> {
//   //   try {
//   //     await this.baseActions.click(mobileMenuLocator.);
//   //     await this.baseActions.waitForLoadState('networkidle');

//   //     for (const selector of menuSelectors) {
//   //       if (await this.baseActions.containsText(expandButtonSelector, '전체 펼침')) {
//   //         await this.baseActions.scrollTo(expandButtonSelector);
//   //         await this.baseActions.click(expandButtonSelector);
//   //       }

//   //       await this.baseActions.scrollTo(selector);
//   //       await this.baseActions.click(selector);
//   //       await this.baseActions.waitForLoadState('networkidle');
//   //     }

//   //     const currentUrl = this.baseActions.getCurrentUrl();
//   //     return currentUrl.includes(expectedUrl);
//   //   } catch {
//   //     return false;
//   //   }
//   // }
// }
