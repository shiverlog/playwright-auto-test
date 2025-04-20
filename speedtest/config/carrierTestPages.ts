/**
 * Description : carrierTestPages.ts - 📌 리다이렉션 확인 URL
 * Author : Shiwoo Min
 * Date : 2025-04-18
 */
import { speedtestUrls } from '@speedtest/config/speedtestUrls.js';

// 인터페이스는 speedtest에서만 쓰이므로, 코드 안에 기재
export interface TestPage {
  page_id: string;
  url: string;
  measurements: number[];
}

// 각 통신사에서 제공하는 페이지 키
export type CarrierPageKey =
  | '메인'
  | '검색'
  | 'gnb'
  | '모바일요금제'
  | '모바일'
  | '인터넷IPTV'
  | '혜택_멤버십'
  | '고객지원'
  | '다이렉트'
  | '해외로밍';

/**
 * 각 통신사 타입
 */
export type Carrier = 'lg' | 'skt' | 'kt';

/**
 * 통신사별 페이지 맵
 */
export type CarrierPerformancePages = {
  [C in Carrier]: {
    [P in CarrierPageKey]: TestPage;
  };
};

/**
 * 최종 데이터 객체
 */
export const carrierPerformancePages: CarrierPerformancePages = {
  lg: {
    메인: { page_id: 'MW_LG_1', url: speedtestUrls.lg.main, measurements: [] },
    검색: { page_id: 'MW_LG_2', url: speedtestUrls.lg.search, measurements: [] },
    gnb: { page_id: 'MW_LG_3', url: speedtestUrls.lg.gnb, measurements: [] },
    모바일요금제: { page_id: 'MW_LG_4', url: speedtestUrls.lg.mobilePlan, measurements: [] },
    모바일: { page_id: 'MW_LG_5', url: speedtestUrls.lg.mobile, measurements: [] },
    인터넷IPTV: { page_id: 'MW_LG_6', url: speedtestUrls.lg.internetIptv, measurements: [] },
    혜택_멤버십: { page_id: 'MW_LG_7', url: speedtestUrls.lg.benefits, measurements: [] },
    고객지원: { page_id: 'MW_LG_8', url: speedtestUrls.lg.support, measurements: [] },
    다이렉트: { page_id: 'MW_LG_9', url: speedtestUrls.lg.direct, measurements: [] },
    해외로밍: { page_id: 'MW_LG_10', url: speedtestUrls.lg.roaming, measurements: [] },
  },
  skt: {
    메인: { page_id: 'MW_SKT_1', url: speedtestUrls.skt.main, measurements: [] },
    검색: { page_id: 'MW_SKT_2', url: speedtestUrls.skt.search, measurements: [] },
    gnb: { page_id: 'MW_SKT_3', url: speedtestUrls.skt.gnb, measurements: [] },
    모바일요금제: { page_id: 'MW_SKT_4', url: speedtestUrls.skt.mobilePlan, measurements: [] },
    모바일: { page_id: 'MW_SKT_5', url: speedtestUrls.skt.mobile, measurements: [] },
    인터넷IPTV: { page_id: 'MW_SKT_6', url: speedtestUrls.skt.internetIptv, measurements: [] },
    혜택_멤버십: { page_id: 'MW_SKT_7', url: speedtestUrls.skt.benefits, measurements: [] },
    고객지원: { page_id: 'MW_SKT_8', url: speedtestUrls.skt.support, measurements: [] },
    다이렉트: { page_id: 'MW_SKT_9', url: speedtestUrls.skt.direct, measurements: [] },
    해외로밍: { page_id: 'MW_SKT_10', url: speedtestUrls.skt.roaming, measurements: [] },
  },
  kt: {
    메인: { page_id: 'MW_KT_1', url: speedtestUrls.kt.main, measurements: [] },
    검색: { page_id: 'MW_KT_2', url: speedtestUrls.kt.search, measurements: [] },
    gnb: { page_id: 'MW_KT_3', url: speedtestUrls.kt.gnb, measurements: [] },
    모바일요금제: { page_id: 'MW_KT_4', url: speedtestUrls.kt.mobilePlan, measurements: [] },
    모바일: { page_id: 'MW_KT_5', url: speedtestUrls.kt.mobile, measurements: [] },
    인터넷IPTV: { page_id: 'MW_KT_6', url: speedtestUrls.kt.internetIptv, measurements: [] },
    혜택_멤버십: { page_id: 'MW_KT_7', url: speedtestUrls.kt.benefits, measurements: [] },
    고객지원: { page_id: 'MW_KT_8', url: speedtestUrls.kt.support, measurements: [] },
    다이렉트: { page_id: 'MW_KT_9', url: speedtestUrls.kt.direct, measurements: [] },
    해외로밍: { page_id: 'MW_KT_10', url: speedtestUrls.kt.roaming, measurements: [] },
  },
};
