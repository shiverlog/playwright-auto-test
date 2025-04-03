/**
 * Description : uiLocator.ts - 📌  UI 처리를 위한 Locator 정의
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */

// 모달/오버레이 관련 로케이터 (전 POC)
export const overlayLocator = {
  // 전역적인 오버레이
  body: "html[lang='ko']>body",
  // 전체 모달 컨텐츠
  modalContent: 'div.modal-content',
  // 모달 헤더 정보
  modalHeader: 'header.modal-header h1',
  // 모달 바디
  modalBody: 'div.modal-body',
  // 모달 헤더 닫기 버튼
  modalHeaderClose: 'header.modal-header button.c-btn-close',
  // 모달 푸터
  modalFooter: 'div.modal-content footer',
  // 모달 푸터 확인 버튼
  modalConfirm:
    "//div[contains(@class, 'modal-content')]//footer//button[contains(text(), '확인')]",
  // 모달 푸터 오늘 하루 그만 보기 체크
  modalTodayOnlyOnceCheck:
    "//span[contains(@class, 'txt') and contains(text(), '오늘 하루 그만 보기')]",
  // 모달 푸터 오늘 하루 그만 보기 버튼
  modalTodayOnlyOnceButton:
    "//div[contains(@class, 'modal-content')]//footer//button[contains(text(), '오늘 하루 보지 않기')]",
  // 모달 푸터 닫기 버튼
  modalFooterClose:
    "//div[contains(@class, 'modal-content')]//footer//button[contains(text(), '닫기')]",
  // 인터스티셜 오버레이
  insOverlay: "//div[contains(@class, 'ins-custom-overlay')]",
  // 인터스티셜 닫기버튼
  insCloseButton: "//div[contains(@class, 'ins-close-button') and text()='닫기']",
};

// web ui 메뉴 (pc-web)
export const pcMenuLocator = {
  // 웹 로고
  logo: '//a[normalize-space(text())="LG U+"]',
  /**
   * GNB
   */
  mobileMenuLink:
    '//*[@class="header-gnb-list"]//a[span and contains(normalize-space(span/text()), "모바일")]',
  internetMenuLink:
    '//*[@class="header-gnb-list"]//a[span and contains(normalize-space(span/text()), "인터넷/IPTV")]',
  mypageMenuLink:
    '//*[@class="header-gnb-list"]//a[span and contains(normalize-space(span/text()), "마이페이지")]',
  benefitMenuLink:
    '//*[@class="header-gnb-list"]//a[span and contains(normalize-space(span/text()), "혜택/멤버십")]',
  supportMenuLink:
    '//*[@class="header-gnb-list"]//a[span and contains(normalize-space(span/text()), "고객지원")]',
  directMenuLink:
    '//*[@class="header-gnb-list"]//a[span and contains(normalize-space(span/text()), "다이렉트샵")]',
  udocLink:
    '//*[@class="header-gnb-list"]//a[span and contains(normalize-space(span/text()), "유독")]',
  /**
   * 헤더메뉴
   */
  fullMenuIcon: '//a[img[@alt="전체메뉴"]]',
  storeGuideIcon: '//a[img[@alt="(가까운 매장안내)"]]',
  searchIcon: '//a[img[@alt="검색"]]',
  cartIcon: '//a[img[@alt="장바구니"]]',
  myInfoIcon:
    '//a[span[contains(@class, "is-blind") and normalize-space(text())="내정보 메뉴 펼치기"]]',
  
  gnbList: 'ul.header-gnb-list',
  mainMenu: '.c-btn-menu',
  expandAll: 'button.dep_all',
  backHistory: 'button.history_back',
  previousPage: '.c-btn-prev',
  nextButton: "//android.widget.Button[@text='다음']",
  allow: 'com.android.permissioncontroller:id/permission_allow_button',
  allowAll: 'com.android.permissioncontroller:id/permission_allow_all_button',
  allowForegroundOnly:
    'com.android.permissioncontroller:id/permission_allow_foreground_only_button',
  agree: 'com.lguplus.mobile.cs:id/agreeButton',
  enterWithoutLoginText: "//android.widget.Button[@text='로그인하지 않고 입장할게요']",
  enterWithoutLogin: "//android.widget.Button[@text='로그인없이 입장하기']",
  closeButtonText: "//android.widget.Button[@text='닫기']",
  withoutLoginWeb: "button[class='withoutLogin']",
};

// app ui 메뉴 (mobile-web/android/ios)
export const mobileMenuLocator = {
  // 모바일 로고
  logo: '//a[span[contains(@class, "is-blind") and normalize-space(text())="LG U+"]]',
  /**
   * 헤더메뉴
   */
  searchButton:
    '//button[span[contains(@class, "is-blind") and normalize-space(text())="검색하기"]]',
  cartButton: '//button[span[contains(@class, "is-blind") and normalize-space(text())="장바구니"]]',
  hamburgerButton:
    '//button[span[contains(@class, "is-blind") and normalize-space(text())="전체메뉴 열기"]]',
  /**
   * 바로가기
   */
  homeShortcutButton:
    '//button[span[contains(@class, "is-blind") and normalize-space(text())="홈 바로가기"]]',
  globalShortcutButton:
    '//button[span[contains(@class, "is-blind") and normalize-space(text())="글로벌 바로가기"]]',
  /**
   * 사이드 메뉴 탭
   */
  mobileMenuList: '//li[button/span and contains(normalize-space(button/span/text()), "모바일")]',
  internetMenuList:
    '//li[button/span and contains(normalize-space(button/span/text()), "인터넷/IPTV")]',
  mypageMenuList:
    '//li[button/span and contains(normalize-space(button/span/text()), "마이페이지")]',
  benefitMenuList:
    '//li[button/span and contains(normalize-space(button/span/text()), "혜택/멤버십")]',
  supportMenuList:
    '//li[button/span and contains(normalize-space(button/span/text()), "고객지원")]',
  directMenuList:
    '//li[button/span and contains(normalize-space(button/span/text()), "다이렉트샵")]',
  udocMenuList: '//li[button/span and contains(normalize-space(button/span/text()), "유독")]',
  mainMenu: '.c-btn-menu',
  expandAll: 'button.dep_all',
  backHistory: 'button.history_back',
  previousPage: '.c-btn-prev',
  nextButton: '//android.widget.Button[@text="다음"]',
  allow: 'com.android.permissioncontroller:id/permission_allow_button',
  allowAll: 'com.android.permissioncontroller:id/permission_allow_all_button',
  allowForegroundOnly:
    'com.android.permissioncontroller:id/permission_allow_foreground_only_button',
  agree: 'com.lguplus.mobile.cs:id/agreeButton',
  enterWithoutLoginText: "//android.widget.Button[@text='로그인하지 않고 입장할게요']",
  enterWithoutLogin: "//android.widget.Button[@text='로그인없이 입장하기']",
  closeButtonText: "//android.widget.Button[@text='닫기']",
  withoutLoginWeb: "button[class='withoutLogin']",
};

export const modalLocator = {
  modalContent: '.modal-content',
  modalCheckbox: '#modal-checkbox',
  modalCloseButton: '.modal-close',
  modalActionButton: '.modal-action',
  modalInsButton: '.modal-ins',
  dimmedLayer: '.dimmed',
  addressInput: '#address-search-input',
  addressSearchButton: '#address-search-btn',
  confirmButton: 'div.c-btn-group button.c-btn-solid-1-m',
  eventModalClose: '.event-modal-close',
  marketPopupClose: '.market-popup-close',
};
