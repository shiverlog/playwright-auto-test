/**
 * Description : urlLocator.ts - 📌 공통 로케이터 - url
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import { Platform } from '@common/constants/LocatorEnum';

// 테스트 BASE URL - LG UPLUS 공식 페이지
const baseUrls = {
  [Platform.PC_WEB]: 'https://www.lguplus.com',
  [Platform.MOBILE_WEB]: 'https://m.lguplus.com',
  [Platform.APP]: 'https://app.lguplus.com/apcm/main',
};

// URL 매핑 함수
const mappingUrls = (path: string, includeAppPlatforms = true) => {
  const urls = Object.fromEntries(
    Object.entries(baseUrls).map(([key, url]) => [key, `${url}${path}`]),
  );

  if (includeAppPlatforms) {
    return {
      ...urls,
      // ANDROID Default
      [Platform.ANDROID]: urls[Platform.APP],
      // iOS Default
      [Platform.IOS]: urls[Platform.APP],
    };
  }
  return urls;
};

export const urlLocator = {
  // 메인페이지
  main: baseUrls,

  // login 1.0
  login_: Object.fromEntries(Object.entries(baseUrls).map(([key, url]) => [key, `${url}/login`])),

  // login 2.0
  login_outh: Object.fromEntries(
    Object.entries(baseUrls).map(([key, url]) => [key, `${url}/login`]),
  ),

  // login fallback
  login_fallback: Object.fromEntries(
    Object.entries(baseUrls).map(([key, url]) => [key, `${url}/login/fallback`]),
  ),

  // 기본틀: {
  //   ...baseUrls,
  //   [Platform.PC_WEB]: `${baseUrls[Platform.PC_WEB]}/{path}`,
  //   [Platform.MOBILE_WEB]: `${baseUrls[Platform.MOBILE_WEB]}/{path}`,
  //   [Platform.APP]: `${baseUrls[Platform.APP]}/{path}`,
  // },

  /**
   * GNB - 모바일
   */
  mobile: mappingUrls('/mobile'),

  // 휴대폰
  phone: mappingUrls('/mobile/device/phone'),
  // 요금제 > 5G/LTE
  plan: mappingUrls('/mobile/plan/mplan/plan-all'),
  // 요금제 > 온라인단독
  direct: mappingUrls('/mobile/plan/mplan/direct'),
  // 요금제 > 태블릿/스마트워치
  device_2nd: mappingUrls('/mobile/plan/mplan/2nd-device'),
  // 요금제 > 듀얼넘버 플러스
  dual: mappingUrls('/mobile/plan/mplan/dual'),
  // 모바일 > 유심
  usim: {
    ...baseUrls,
    [Platform.PC_WEB]: `${baseUrls[Platform.PC_WEB]}/mobile/usim`,
    [Platform.MOBILE_WEB]: `${baseUrls[Platform.MOBILE_WEB]}/mobile/sim-card/usim`,
    [Platform.APP]: `${baseUrls[Platform.APP]}/mobile/sim-card/usim`,
  },
  // 모바일 > 태블릿
  smart_device: mappingUrls('/mobile/device/smart-device'),

  // 요금제 > eSIM
  esim: mappingUrls('/mobile/esim'),

  /**
   * GNB - 인터넷/IPTV
   */
  iptv: mappingUrls('/internet-iptv'),

  /**
   * GNB - 마이페이지
   */
  mypage: mappingUrls('/mypage'),

  // 마이페이지 > 가입/사용 현황 > 가입 정보 조회/변경
  info: mappingUrls('/mypage/info'),
  // 마이페이지 > 가입/사용 현황 > 요금제 조회/변경
  price_plan: mappingUrls('/mypage/price-plan/mobile'),
  // 마이페이지 > 가입/사용 현황 > 요금제 조회/변경 > [변경하기]클릭
  price_plan_change: mappingUrls('/mypage/price-plan/new-mobile'),

  // 마이페이지 > 가입/사용 현황 > 부가서비스 조회/변경/해지
  sub_service: mappingUrls('/mypage/sub-service/mobile'),
  // 마이페이지 > 가입/사용 현황 > 사용내역 조회
  bilv: mappingUrls('/mypage/price-plan/bilv'),
  // 마이페이지 > 가입/사용 현황 > 해외로밍 조회
  roam: mappingUrls('/mypage/roam'),
  // 마이페이지 > 가입/사용 현황 > 휴대폰결제
  micro_pay: mappingUrls('/mypage/micro-pay'),
  // 마이페이지 > 가입/사용 현황 > 일시정지/해제
  stop: mappingUrls('mypage/info/stop'),
  // 마이페이지 > 가입/사용 현황 > 서비스 해지
  cancel: mappingUrls('/mypage/info/cancel/detail'),
  // 마이페이지 > 가입/사용 현황 > 회원정보
  member: mappingUrls('/mypage/info/member'),

  /**
   * GNB - 혜택/멤버십
   */
  benefit: mappingUrls('/benefit'),
  // 혜택/멤버십 > 멤버십 이용내역
  membership: mappingUrls('/benefit-membership'),
  // 혜택/멤버십 서브메인 > 멤버십
  benefit_membership: mappingUrls('/benefit-membership'),
  // 혜택/멤버십 서브메인 > 멤버십 등급
  rank_info: mappingUrls('/benefit-membership/rank-info'),
  // 혜택/멤버십 서브메인 > 이벤트
  benefit_event: mappingUrls('/benefit-event/ongoing'),
  // 혜택/멤버십 서브메인 > 모바일 장기고객 혜택
  longBene: mappingUrls('/benefit-uplus/loyal-member-perks/longBene'),
  // 혜택/멤버십 서브메인 > 결합할인
  combined_discount: mappingUrls('/benefit-uplus/combined-discount'),
  // 혜택/멤버십 서브메인 > 요금할인 혜택
  price_discount: mappingUrls('/benefit-uplus/price-discount'),
  // 혜택/멤버십 > 온라인 구매 혜택
  online_benefit: mappingUrls('/benefit-uplus/online-purchase-benefit'),

  /**
   * GNB - 고객지원
   */
  support: mappingUrls('/support'),

  // 고객지원 > 자주하는 질문
  faq: mappingUrls('/support/online/faq'),

  /**
   * GNB - 다이렉트
   */
  payinfo: mappingUrls('/direct'),

  /**
   * GNB - 장바구니
   */
  cart: mappingUrls('/cart'),

  /**
   * GNB - 서치
   */
  search: {
    ...baseUrls,
    [Platform.MOBILE_WEB]: `${baseUrls[Platform.MOBILE_WEB]}/search`,
    [Platform.APP]: `${baseUrls[Platform.APP]}/search`,
  },
  // 검색 결과
  search_result: {
    ...baseUrls,
    [Platform.MOBILE_WEB]: `${baseUrls[Platform.MOBILE_WEB]}/search/result`,
    [Platform.APP]: `${baseUrls[Platform.APP]}/search/result`,
  },
};
