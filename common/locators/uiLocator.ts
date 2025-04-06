/**
 * Description : uiLocator.ts - 📌  UI 처리를 위한 Locator 정의
 * Author : Shiwoo Min
 * Date : 2025-04-03
 */
import { UIType } from '@common/types/platform-types';

/**
 * UI 관련 로케이터
 */
export const uiLocator = {
  // 헤더 로고
  logo: {
    PC: '//a[normalize-space(text())="LG U+"]',
    MOBILE: '//a[span[contains(@class, "is-blind") and normalize-space(text())="LG U+"]]',
    APP: '',
  },
  // 햄버거
  hamburger: {
    PC: '//a[img[@alt="전체메뉴"]]',
    MOBILE: '//button[.//span[contains(text(), "전체메뉴")]]',
    APP: '//button[.//span[contains(text(), "전체메뉴")]]',
  },
  // (Web) GNB 스토어 가이드
  storeGuideIcon: {
    PC: '//a[img[@alt="스토어 가이드"]]',
    MOBILE: '',
    APP: '',
  },
  // GNB 서치
  searchGNB: {
    PC: '//a[img[@alt="검색"]]',
    MOBILE: '//button[span[contains(@class, "is-blind") and normalize-space(text())="검색하기"]]',
    APP: '',
  },
  // GNB 장바구니
  cartGNB: {
    PC: '//a[img[@alt="장바구니"]]',
    MOBILE: '//button[span[contains(@class, "is-blind") and normalize-space(text())="장바구니"]]',
    APP: '',
  },
  // (Web) GNB 나의 정보
  myInfoIcon: {
    PC: '//a[span[contains(@class, "is-blind") and normalize-space(text())="내정보 메뉴 펼치기"]]',
    MOBILE: '',
    APP: '',
  },

  // 햄버거 > 메인 바로가기
  homeShortcutGNB: {
    PC: '',
    MOBILE:
      '//button[span[contains(@class, "is-blind") and normalize-space(text())="홈 바로가기"]]',
    APP: '',
  },
  // 햄버거 > Global 바로가기
  globalShortcutGNB: {
    PC: '',
    MOBILE:
      '//button[span[contains(@class, "is-blind") and normalize-space(text())="글로벌 바로가기"]]',
    APP: '',
  },
  // GNB, 햄버거 > 모바일
  mobileMenu: {
    PC: '//*[@class="header-gnb-list"]//a[span and contains(normalize-space(span/text()), "모바일")]',
    MOBILE: '//li[button/span and contains(normalize-space(button/span/text()), "모바일")]',
    APP: '//button[.//span[contains(text(), "전체메뉴")]]',
  },
  // GNB, 햄버거 > 인터넷/IPTV
  internetMenu: {
    PC: '//*[@class="header-gnb-list"]//a[span and contains(normalize-space(span/text()), "인터넷/IPTV")]',
    MOBILE: '//li[button/span and contains(normalize-space(button/span/text()), "인터넷/IPTV")]',
    APP: '',
  },
  // GNB, 햄버거 > 마이페이지
  mypageMenu: {
    PC: '//*[@class="header-gnb-list"]//a[span and contains(normalize-space(span/text()), "마이페이지")]',
    MOBILE: '//li[button/span and contains(normalize-space(button/span/text()), "마이페이지")]',
    APP: '',
  },
  // GNB, 햄버거 > 혜택/멤버십
  benefitMenu: {
    PC: '//*[@class="header-gnb-list"]//a[span and contains(normalize-space(span/text()), "혜택/멤버십")]',
    MOBILE: '//li[button/span and contains(normalize-space(button/span/text()), "혜택/멤버십")]',
    APP: '',
  },
  // GNB, 햄버거 > 고객지원
  supportMenu: {
    PC: '//*[@class="header-gnb-list"]//a[span and contains(normalize-space(span/text()), "고객지원")]',
    MOBILE: '//li[button/span and contains(normalize-space(button/span/text()), "고객지원")]',
    APP: '',
  },
  // GNB, 햄버거 > 다이렉트샵
  directMenu: {
    PC: '//*[@class="header-gnb-list"]//a[span and contains(normalize-space(span/text()), "다이렉트샵")]',
    MOBILE: '//li[button/span and contains(normalize-space(button/span/text()), "다이렉트샵")]',
    APP: '',
  },
  // GNB, 햄버거 > 유독
  udocMenu: {
    PC: '//*[@class="header-gnb-list"]//a[span and contains(normalize-space(span/text()), "유독")]',
    MOBILE: '//li[button/span and contains(normalize-space(button/span/text()), "유독")]',
    APP: '',
  },
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
} as const;

// 전체 타입
export type UILocator = typeof uiLocator;

// UIType 기반 필드 추출
export type UILocatorByUIType = {
  [K in keyof UILocator as UILocator[K] extends Record<UIType, string> ? K : never]: Record<
    UIType,
    string
  >;
};
