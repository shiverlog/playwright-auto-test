/**
 * Description : mobileLocator.ts - 📌  UI 처리를 위한 Locator 정의
 * Author : Shiwoo Min
 * Date : 2025-04-20
 */
import { UIType } from '@common/types/platform-types';

/**
  '결합 할인_상담 신청 버튼': '.total-result-wrap button',
  '결합 할인_드롭다운': '.c-select-btn a',
  '결합 할인_드롭다운_data': '.c-select-option li',
  '결합 할인_드롭다운_결과': '.result-wrap .result-txt',
  '결합 할인_드롭다운_결과_total': '.total-result-wrap .price-txt span',

  가입상담신청_팝업_타이틀: '*[class="modal-title"]',
  가입상담신청_팝업_이름입력창: 'input[name="userName"]',
  가입상담신청_팝업_금액_로딩: 'div.calculatorBox>dl>dd>ul>li>span',
  가입상담신청_팝업_금액: 'div.calculatorBox>dl>dd>ul>li:nth-of-type(2)',
  가입상담신청_팝업_결합할인: 'div.calculatorBox dl.result',
  가입상담신청_팝업_닫기버튼: 'button.close',
  가입상담신청_팝업_휴대폰번호: 'input[name="phNum"]',
  가입상담신청_팝업_개인정보동의: 'input[id="agree"]',

  태블릿_tab: 'div[location="모바일 서브메인|2nd 디바이스"] .c-tab-default ul[role="tablist"]>li a',
  태블릿_panel_주문하기: 'div[location="모바일 서브메인|2nd 디바이스"] div.btn-wrap > button',
  태블릿_panel_상품명:
    'div[location="모바일 서브메인|2nd 디바이스"] .slick-slider.slick-initialized .device-item .card-title .big-title',

  모바일이벤트_탭메뉴: '.par-tabcont-area ul[role="tablist"] li',
  구매후기: 'div[location="모바일 서브메인|구매후기"]',
  구매후기_컨텐츠: '.review-area .review-ul li .review-wrap a',

  mobile_plan: 'a[data-gtm-click-text*="모바일 요금제|5G/LTE"]',
  사용중인_요금제_정보: 'div.user-info',
  사용중인_요금제명: '.key-area div:nth-child(1) dd',

  '5G/LTE_tab': 'ul[role="tablist"] a[data-gtm-click-text*="5G/LTE"]',
  온라인단독_tab: 'ul[role="tablist"] a[data-gtm-click-text*="온라인"]',
  '태블릿/스마트워치_tab': 'ul[role="tablist"] a[data-gtm-click-text*="태블릿"]',
  듀얼넘버_tab: 'ul[role="tablist"] a[data-gtm-click-text*="듀얼넘버"]',

  '태블릿/스마트워치_url': 'https://www.lguplus.com/mobile/plan/mplan/2nd-device',
  듀얼넘버_url: 'https://www.lguplus.com/mobile/plan/mplan/dual',

  요금제_비교하기: 'ul.plan-list li div.btn-area button[data-gtm-click-text*="비교하기"]',
  요금제_list_요금제명: 'ul.plan-list li p button',
  요금제_list_가격: 'ul.plan-list li span.price',
  요금제_list_할인가격: 'ul.plan-list span.sale-price',
  요금제비교함: 'div.middlearea',
  요금제비교함_요금제명: 'div.compare-head>ul>li.active',
  요금제비교함_가격: 'div.compare-body>div:first-child >div.active',
  요금제비교함_할인가격: 'div.compare-body div.active p.price',
  요금제비교함_드롭다운: 'div.compare-head>ul>li.active button.btn-dropdown',
  요금제비교함_드롭다운_list: 'div.c-selform-custom.is-active li a',

  요금제_변경하기: '.btn-area button:nth-of-type(2)',
  혜택_선택_list: '.modal-content .text-radio img',
  혜택_title: '.modal-header h1',
  다음_버튼: '.modal-content .btn-next',
  '요금제_조회/변경_url': 'https://www.lguplus.com/mypage/price-plan/new-mobile',
  요금제_변경_data: 'tbody tr td:last-child',
  요금제조회변경_url: 'https://www.lguplus.com/mypage/price-plan/new-mobile',

  mobile_device: '.m1 div > ul > li:nth-child(1) ul li:nth-child(1) a',
  phone_url: 'https://www.lguplus.com/mobile/device/phone',
  신청하기_btn: 'button[data-gtm-event-label*="주문하기"]',
  phone_info: 'div.device-info-area',
  phone_name: 'h2.title-main .title-main__prod-name',

  장바구니_가입유형: "//div[contains(@class,'c-section') and contains(.,'가입 유형')]//input",
  장바구니_요금제: "//h3[contains(.,'요금제')]/ancestor::div//input[@name='fee-select']",
  장바구니_요금제명: "//h3[contains(.,'요금제')]/ancestor::div//div//a[@class='btn-detail']",
  장바구니_요금제_특별혜택: ".benefit-list .c-checkbox input[type='checkbox']",
  장바구니_할인방법:
    "//h3[contains(.,'할인 방법')]/ancestor::div//input[@name='puan-select' or @name='sale-select']",
  장바구니_납부기간: "//h3[contains(.,'할인 방법')]/ancestor::div//input[@name='month-credit']",
  장바구니_제휴카드: "//div[contains(@class,'c-section') and contains(.,'제휴카드')]//input",
  장바구니_추가할인: "//div[contains(@class,'c-section') and contains(.,'추가 할인 혜택')]//input",
  장바구니_멤버십혜택:
    "//div[contains(@class,'c-section') and contains(.,'VIP 멤버십 혜택')]//input",
  장바구니_사은품: "//span[contains(.,'사은품')]/ancestor::div//input[@name='radio-gift']",
  장바구니_쇼핑쿠폰팩:
    "//h3[contains(., '매월 이용할 혜택')]/ancestor::div[2]//ul[@class='gift-choice-list']//input[not(@disabled)]",
  phone_price: 'div.calculation-box div.title-area div:first-child span.price',

  장바구니_btn: 'button[data-gtm-event-label*="장바구니"]',
  장바구니로_이동_btn: '//div[@class="modal-content"]//button[contains(.,"장바구니")]',
  장바구니_url: 'https://www.lguplus.com/cart',
  장바구니_상품_영역: 'div.products-contianer',

  장바구니_삭제_버튼: '.products-tbl:nth-of-type(1) .btn-del',
  삭제_확인_버튼: '.c-btn-group .c-btn-solid-1-m',
};
 */

/**
 * UI 관련 로케이터
 */
export const mobileLocator = {
  // 모바일 > 서브메인
  mobileSubMain: {
    PC: '',
    MOBILE: '//div[@section-group-id="MoSubMainMobileThemeSection"]',
    APP: '',
  },

  // 검색 > 인기검색어 > 검색어
  kvSection: {
    PC: '',
    MOBILE: '//div[@section-group-id="MoSubMainMobileKVSection"]',
    APP: '',
  },

  이벤트list: '.event-section-ul > li >a',
  이벤트_전체보기: '.bo-modules-mobile-event-list a.all-view-btn',
  이벤트상세_전체영역: 'div.p-benefit-event',
  휴대폰_tab: 'div[location="모바일 서브메인|휴대폰"] .c-tab-default ul[role="tablist"]>li a',

  // 이벤트 >
  eventSection: {
    PC: '',
    MOBILE: '//div[@section-group-id="MoSubMainMobileEventSection"]',
    APP: '',
  },

  // 이벤트 타이틀
  eventTitle: {
    PC: '',
    MOBILE: '//a[@class="c-link-arr h3" and normalize-space(text())="이벤트"]',
    APP: '',
  },

  // 이벤트 컨텐츠
  eventCard: {
    PC: '',
    MOBILE:
      '//*[@section-group-id="MoSubMainMobileEventSection"]//div[contains(@class, "swiper-slide")]/a',
    APP: '',
  },

  // 휴대폰 >
  cellPhoneSection: {
    PC: '',
    MOBILE: '//div[@section-group-id="MoSubMainMobileDeviceSection"]',
    APP: '',
  },

  // 휴대폰 탭
  cellPhoneTab: {
    PC: '',
    MOBILE: '//div[@section-group-id="MoSubMainMobileDeviceSection"]//ul[@role="tablist"]/li[a]',
    APP: '',
  },

  // 휴대폰 컨텐츠 카드
  cellPhoneCard: {
    PC: '',
    MOBILE:
      '//div[@section-group-id="MoSubMainMobileDeviceSection"]//div[not(contains(@style, "display: none"))]//div[contains(@class, "swiper-slide")]',
    APP: '',
  },

  // 휴대폰 컨텐츠 - 상품명
  cellPhoneDeviceName: {
    PC: '',
    MOBILE:
      '//div[@section-group-id="MoSubMainMobileDeviceSection"]//div[not(contains(@style, "display: none"))]//div//p[@class="big-title"]',
    APP: '',
  },

  // 휴대폰 컨텐츠 - 주문하기 버튼
  cellPhoneOrderButton: {
    PC: '',
    MOBILE:
      '//div[@section-group-id="MoSubMainMobileDeviceSection"]//div[not(contains(@style, "display: none"))]//div//button[text()="주문하기"]',
    APP: '',
  },

  // 휴대폰 컨텐츠 상세 페이지 타이틀
  cellPhoneDetailTitle: {
    PC: '',
    MOBILE: '//div[@class="device-kv-wrap__info"]//p[contains(@class, "info--title")]',
    APP: '',
  },

  // 추천 요금제 섹션 >
  recommendPlanSection: {
    PC: '',
    MOBILE: '//div//section[@section-group-id="MoSubMainMobileRecommendPlan"]',
    APP: '',
  },

  // 추천요금제 카드
  recommendPlanCard: {
    PC: '',
    MOBILE:
      '//div[@class="swiper-slide" and .//p[@class="sub-title"] and .//dl[@class="price-info"]]',
    APP: '',
  },

  // 추천요금제 더보기
  recommendPlanMore: {
    PC: '',
    MOBILE:
      '//div[contains(@class, "swiper-slide") and contains(@class, "more") and .//span[@class="btn-more"]]//a',
    APP: '',
  },

  // 요금제 상세 페이지 타이틀
  planDetailTitle: {
    PC: '',
    MOBILE: '//p[@class="h1"]',
    APP: '',
  },

  // 요금제 상세 페이지 가격
  planDetailPrice: {
    PC: '',
    MOBILE: '//span[@class="price"]',
    APP: '',
  },

  // 요금제 상세 비교 버튼
  planDetailCompareButton: {
    PC: '',
    MOBILE: '//button[contains(@class, "simcard-calc__button") and text()="비교"]',
    APP: '',
  },

  // 요금제 상세 비교 모달
  planDetailCompareModal: {
    PC: '',
    MOBILE:
      '//div[contains(@class, "modal-content") and .//p[@class="title" and contains(text(), "비교함에 담았어요")]]',
    APP: '',
  },

  // 요금제 상세 비교 모달 비교함 버튼
  planDetailCompareModalCButton: {
    PC: '',
    MOBILE: '//div[contains(@class,"modal-content")]//button[contains(.,"비교함")]',
    APP: '',
  },
} as const;

// 전체 타입
export type UILocator = typeof mobileLocator;

// UIType 기반 필드 추출
export type UILocatorByUIType = {
  [K in keyof UILocator as UILocator[K] extends Record<UIType, string> ? K : never]: Record<
    UIType,
    string
  >;
};
