import { speedtestUrls } from './speedtestUrls.js';

export interface TestPage {
  page_id: string;
  url: string;
  measurements: number[];
}

export interface CarrierPages {
  [key: string]: TestPage;
}

export const carrierPages = {
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
