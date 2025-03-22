/**
 * Description : urlLocator.ts - 📌 공통 로케이터 - url
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import { Platform } from '@common/constants/ContextConstants';

// 테스트 BASE URL - LG UPLUS 공식 페이지
const baseUrls = {
  [Platform.PC_WEB]: 'https://www.lguplus.com',
  [Platform.MOBILE_WEB]: 'https://m.lguplus.com',
  [Platform.NATIVE_APP]: 'https://app.lguplus.com/apcm/main',
};

// URL 매핑 함수
const mappingUrls = (path: string, includeAppPlatforms = true) => {
  const urls = Object.fromEntries(
    Object.entries(baseUrls).map(([key, url]) => [key, `${url}${path}`]),
  );

  if (includeAppPlatforms) {
    return {
      ...urls,
      [Platform.ANDROID_APP]: urls[Platform.NATIVE_APP],
      [Platform.IOS_APP]: urls[Platform.NATIVE_APP],
    };
  }

  return urls;
};

export const urlLocator = {
  // 메인페이지
  main: baseUrls,

  // login 1.0
  login_: mappingUrls('/login'),

  // login 2.0 (OAuth)
  login_outh: mappingUrls('/login'),

  // login fallback
  login_fallback: mappingUrls('/login/fallback'),

  /**
   * GNB - 모바일
   */
  mobile: mappingUrls('/mobile'),

  // 휴대폰
  phone: mappingUrls('/mobile/device/phone'),

  // 요금제
  plan: mappingUrls('/mobile/plan/mplan/plan-all'),
  direct: mappingUrls('/mobile/plan/mplan/direct'),
  device_2nd: mappingUrls('/mobile/plan/mplan/2nd-device'),
  dual: mappingUrls('/mobile/plan/mplan/dual'),

  // 모바일 > 유심
  usim: {
    [Platform.PC_WEB]: `${baseUrls[Platform.PC_WEB]}/mobile/usim`,
    [Platform.MOBILE_WEB]: `${baseUrls[Platform.MOBILE_WEB]}/mobile/sim-card/usim`,
    [Platform.NATIVE_APP]: `${baseUrls[Platform.NATIVE_APP]}/mobile/sim-card/usim`,
    [Platform.ANDROID_APP]: `${baseUrls[Platform.NATIVE_APP]}/mobile/sim-card/usim`,
    [Platform.IOS_APP]: `${baseUrls[Platform.NATIVE_APP]}/mobile/sim-card/usim`,
  },

  smart_device: mappingUrls('/mobile/device/smart-device'),
  esim: mappingUrls('/mobile/esim'),

  /**
   * GNB - 인터넷/IPTV
   */
  iptv: mappingUrls('/internet-iptv'),

  /**
   * GNB - 마이페이지
   */
  mypage: mappingUrls('/mypage'),
  info: mappingUrls('/mypage/info'),
  price_plan: mappingUrls('/mypage/price-plan/mobile'),
  price_plan_change: mappingUrls('/mypage/price-plan/new-mobile'),
  sub_service: mappingUrls('/mypage/sub-service/mobile'),
  bilv: mappingUrls('/mypage/price-plan/bilv'),
  roam: mappingUrls('/mypage/roam'),
  micro_pay: mappingUrls('/mypage/micro-pay'),
  stop: mappingUrls('/mypage/info/stop'),
  cancel: mappingUrls('/mypage/info/cancel/detail'),
  member: mappingUrls('/mypage/info/member'),

  /**
   * GNB - 혜택/멤버십
   */
  benefit: mappingUrls('/benefit'),
  membership: mappingUrls('/benefit-membership'),
  benefit_membership: mappingUrls('/benefit-membership'),
  rank_info: mappingUrls('/benefit-membership/rank-info'),
  benefit_event: mappingUrls('/benefit-event/ongoing'),
  longBene: mappingUrls('/benefit-uplus/loyal-member-perks/longBene'),
  combined_discount: mappingUrls('/benefit-uplus/combined-discount'),
  price_discount: mappingUrls('/benefit-uplus/price-discount'),
  online_benefit: mappingUrls('/benefit-uplus/online-purchase-benefit'),

  /**
   * GNB - 고객지원
   */
  support: mappingUrls('/support'),
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
    [Platform.MOBILE_WEB]: `${baseUrls[Platform.MOBILE_WEB]}/search`,
    [Platform.NATIVE_APP]: `${baseUrls[Platform.NATIVE_APP]}/search`,
    [Platform.ANDROID_APP]: `${baseUrls[Platform.NATIVE_APP]}/search`,
    [Platform.IOS_APP]: `${baseUrls[Platform.NATIVE_APP]}/search`,
  },
  search_result: {
    [Platform.MOBILE_WEB]: `${baseUrls[Platform.MOBILE_WEB]}/search/result`,
    [Platform.NATIVE_APP]: `${baseUrls[Platform.NATIVE_APP]}/search/result`,
    [Platform.ANDROID_APP]: `${baseUrls[Platform.NATIVE_APP]}/search/result`,
    [Platform.IOS_APP]: `${baseUrls[Platform.NATIVE_APP]}/search/result`,
  },
};
