/**
 * Description : uiLocator.ts - 📌  UI 처리를 위한 Locator 정의
 * Author : Shiwoo Min
 * Date : 2025-04-20
 */
import { UIType } from '@common/types/platform-types';

/**
 * UI 관련 로케이터
 */
export const mainLocator = {
  // 메인 KV 섹션
  kvSection: {
    PC: '',
    MOBILE: '//section[@section-group-id="WebMainKVSection"]',
    APP: '',
  },

  // 메인 KV 링크
  kvLink: {
    PC: '',
    MOBILE: '//section[contains(@class,"kv-section")]//a/preceding-sibling::a',
    APP: '',
  },

  // 메인 바로가기 섹션
  shortcutMenuSection: {
    PC: '',
    MOBILE: '//div[contains(@class, "shortcut-menu")]',
    APP: '',
  },

  // 메인 바로가기 타이틀
  shortcutMenuTitle: {
    PC: '',
    MOBILE: '//div[contains(@class, "shortcut-menu")]//ul/li/a/p[@class="cntBox"]',
    APP: '',
  },

  // 메인 바로가기 콘텐츠 카드
  shortcutMenuCards: {
    PC: '',
    MOBILE: '//div[contains(@class, "shortcut-menu")]//ul/li/a',
    APP: '',
  },

  // 지금 바로! 이 모든 혜택 놓치지 않게! 앱 다운받기 >
  appDownload: {
    PC: '',
    MOBILE: '//a[@data-gtm-click-location="앱 다운받기 영역"]',
    APP: '',
  },

  // 요금/혜택 정보를 한눈에 확인하세요 섹션
  mainGradeInfoSection: {
    PC: '',
    MOBILE: '//a[@data-gtm-click-location="앱 다운받기 영역"]',
    APP: '',
  },

  // 요금/혜택 정보를 한눈에 확인하세요 섹션 타이틀
  mainGradeInfoMypage: {
    PC: '',
    MOBILE: '//a[contains(@data-gtm-click-text, "마이페이지")]/span[2]',
    APP: '',
  },

  // 요금/혜택 정보를 한눈에 확인하세요 섹션 - 닷컴만의 혜택 바로 확인하기 >
  benefitCheckLink: {
    PC: '',
    MOBILE: '//a[contains(@data-gtm-click-text, "혜택 확인")]',
    APP: '',
  },

  // 추천! 지금 인기 모바일 섹션
  popularDeviceSection: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainMobileSectionAOS"]',
    APP: '',
  },

  // 추천! 지금 인기 모바일 타이틀
  popularDeviceTitle: {
    PC: '',
    MOBILE: '//section[contains(@class, "popular-section")]//header//a',
    APP: '',
  },

  // 추천! 지금 인기 모바일 콘텐츠 카드
  popularDeviceCards: {
    PC: '',
    MOBILE:
      '//section[contains(@class, "popular-section")]//div[contains(@class, "swiper-slide")]//a',
    APP: '',
  },

  // 추천! 지금 인기 모바일 콘텐츠 기기명
  popularDeviceName: {
    PC: '',
    MOBILE:
      '//section[contains(@class, "popular-section")]//div[contains(@class, "swiper-slide")]//p[@class="title"]',
    APP: '',
  },

  // 추천! 지금 인기 모바일 콘텐츠 기기명
  popularTitle: {
    PC: '',
    MOBILE:
      '//section[contains(@class, "popular-section")]//div[contains(@class, "swiper-slide")]//p[@class="title"]',
    APP: '',
  },

  // 주목! 혜택 좋은 요금제 >
  pricePlanSection: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainPricePlanSection"]',
    APP: '',
  },
  // 주목! 혜택 좋은 요금제 타이틀
  pricePlanTitle: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainPricePlanSection"]//header//a',
    APP: '',
  },

  // 주목! 혜택 좋은 요금제 콘텐츠
  pricePlanCard: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainPricePlanSection"]//div//a',
    APP: '',
  },

  // 주목! 혜택 좋은 요금제 콘텐츠 기기명
  pricePlanName: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainPricePlanSection"]//p[@class="sub-title"]',
    APP: '',
  },

  // 절약! 인터넷/IPTV 가입 >
  homeProductSection: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainHomeSection"]',
    APP: '',
  },

  // 절약! 인터넷/IPTV 가입 타이틀
  homeProductTitle: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainHomeSection"]//header//a',
    APP: '',
  },

  // 절약! 인터넷/IPTV 가입 콘텐츠 카드
  homeProductCard: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainHomeSection"]//div//a',
    APP: '',
  },

  // 절약! 인터넷/IPTV 가입 콘텐츠 기기명
  homeProductName: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainHomeSection"]//p[@class="brand-payment"]',
    APP: '',
  },

  // 요금제 상세
  productDetailTitle: {
    PC: '',
    MOBILE: '//div[contains(@class, "product-info__item")]//strong[@class="product-name"]',
    APP: '',
  },

  // 유플닷컴 이용 가이드
  useGuideSection: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainUseGuideSection"]',
    APP: '',
  },

  // 유플닷컴 이용 가이드 카드
  useGuideCard: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainUseGuideSection"]//li//a',
    APP: '',
  },

  // 유플닷컴 이용 가이드 카드
  useGuideContentLink: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainUseGuideSection"]//li//a',
    APP: '',
  },

  // 추천 콘텐츠! 잼과 이득이 가득가득
  contentJam: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainRecommendSection"]',
    APP: '',
  },

  // 추천 콘텐츠! 잼과 이득이 가득가득
  contentJamCard: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainRecommendSection"]/div/a',
    APP: '',
  },

  // 유플닷컴 통신 생활
  ourLifeSection: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainOurlifeSection"]',
    APP: '',
  },

  // 유플닷컴 통신 생활
  ourLifeLink: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainOurlifeSection"]//li//a',
    APP: '',
  },

  // 이럴 땐 U렇게 >
  suggestSection: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainSuggestSection"]',
    APP: '',
  },

  // 이럴 땐 U렇게 타이틀
  suggestTitle: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainSuggestSection"]//header//a',
    APP: '',
  },

  // 이럴 땐 U렇게 콘텐츠 카드
  suggestCard: {
    PC: '',
    MOBILE: '//section[section-group-id="MainSuggestSection"]/div/a',
    APP: '',
  },

  // 진행 중 이벤트 >
  eventSection: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainEventSection"]',
    APP: '',
  },

  // 진행 중 이벤트 타이틀
  eventTitle: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainEventSection"]//header//a',
    APP: '',
  },

  // 진행 중 이벤트 콘텐츠 카드
  eventCard: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainEventSection"]/div//a',
    APP: '',
  },
} as const;

// 전체 타입
export type UILocator = typeof mainLocator;

// UIType 기반 필드 추출
export type UILocatorByUIType = {
  [K in keyof UILocator as UILocator[K] extends Record<UIType, string> ? K : never]: Record<
    UIType,
    string
  >;
};
