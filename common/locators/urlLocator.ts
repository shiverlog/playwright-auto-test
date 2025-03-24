import { Platform as PLATFORM } from '@common/constants/ContextConstants';

// 타입만 따로 추출
export type Platform = typeof PLATFORM[keyof typeof PLATFORM];

// 필수 플랫폼만 정의
export const baseUrls = {
  [PLATFORM.PC_WEB]: 'https://www.lguplus.com',
  [PLATFORM.MOBILE_WEB]: 'https://m.lguplus.com',
  [PLATFORM.NATIVE_APP]: 'https://app.lguplus.com/apcm/main',
} as const;

// URL 매핑 함수: ANDROID/IOS는 내부에서 처리
const mappingUrls = (
  path: string,
  includeAppPlatforms = true
): Record<Platform, string> => {
  const urls: Partial<Record<Platform, string>> = {
    [PLATFORM.PC_WEB]: `${baseUrls[PLATFORM.PC_WEB]}${path}`,
    [PLATFORM.MOBILE_WEB]: `${baseUrls[PLATFORM.MOBILE_WEB]}${path}`,
    [PLATFORM.NATIVE_APP]: `${baseUrls[PLATFORM.NATIVE_APP]}${path}`,
  };

  if (includeAppPlatforms) {
    urls[PLATFORM.ANDROID_APP] = urls[PLATFORM.NATIVE_APP]!;
    urls[PLATFORM.IOS_APP] = urls[PLATFORM.NATIVE_APP]!;
  }

  return urls as Record<Platform, string>;
};

// 최종 URL 매핑 객체
export const urlLocator = {
  main: baseUrls,

  // 로그인
  login_: mappingUrls('/login'),
  login_outh: mappingUrls('/login'),
  login_fallback: mappingUrls('/login/fallback'),

  // GNB - 모바일
  mobile: mappingUrls('/mobile'),

  // 디바이스 관련
  phone: mappingUrls('/mobile/device/phone'),
  plan: mappingUrls('/mobile/plan/mplan/plan-all'),
  direct: mappingUrls('/mobile/plan/mplan/direct'),
  device_2nd: mappingUrls('/mobile/plan/mplan/2nd-device'),
  dual: mappingUrls('/mobile/plan/mplan/dual'),
  smart_device: mappingUrls('/mobile/device/smart-device'),
  esim: mappingUrls('/mobile/esim'),

  usim: {
    [PLATFORM.PC_WEB]: `${baseUrls[PLATFORM.PC_WEB]}/mobile/usim`,
    [PLATFORM.MOBILE_WEB]: `${baseUrls[PLATFORM.MOBILE_WEB]}/mobile/sim-card/usim`,
    [PLATFORM.NATIVE_APP]: `${baseUrls[PLATFORM.NATIVE_APP]}/mobile/sim-card/usim`,
  } as Record<Platform, string>,

  // GNB - 인터넷/IPTV
  iptv: mappingUrls('/internet-iptv'),

  // 마이페이지
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

  // 혜택/멤버십
  benefit: mappingUrls('/benefit'),
  membership: mappingUrls('/benefit-membership'),
  benefit_membership: mappingUrls('/benefit-membership'),
  rank_info: mappingUrls('/benefit-membership/rank-info'),
  benefit_event: mappingUrls('/benefit-event/ongoing'),
  longBene: mappingUrls('/benefit-uplus/loyal-member-perks/longBene'),
  combined_discount: mappingUrls('/benefit-uplus/combined-discount'),
  price_discount: mappingUrls('/benefit-uplus/price-discount'),
  online_benefit: mappingUrls('/benefit-uplus/online-purchase-benefit'),

  // 고객지원
  support: mappingUrls('/support'),
  faq: mappingUrls('/support/online/faq'),

  // 다이렉트
  payinfo: mappingUrls('/direct'),

  // 장바구니
  cart: mappingUrls('/cart'),

  // 검색
  search: {
    [PLATFORM.MOBILE_WEB]: `${baseUrls[PLATFORM.MOBILE_WEB]}/search`,
    [PLATFORM.NATIVE_APP]: `${baseUrls[PLATFORM.NATIVE_APP]}/search`,
  } as Record<Platform, string>,

  search_result: {
    [PLATFORM.MOBILE_WEB]: `${baseUrls[PLATFORM.MOBILE_WEB]}/search/result`,
    [PLATFORM.NATIVE_APP]: `${baseUrls[PLATFORM.NATIVE_APP]}/search/result`,
  } as Record<Platform, string>,
};
