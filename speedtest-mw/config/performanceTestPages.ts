import { urls } from "../config/url";

export interface TestPage {
  page_id: string;
  url: string;
  measurements: number[];
}

export interface CarrierPages {
  [key: string]: TestPage;
}

export interface PerformanceTestPages {
  lg: CarrierPages;
  skt: CarrierPages;
  kt: CarrierPages;
}

export const performanceTestPages: PerformanceTestPages = {
  lg: {
    메인: { page_id: "MW_LG_1", url: urls.lg.main, measurements: [] },
    검색: { page_id: "MW_LG_2", url: urls.lg.search, measurements: [] },
    gnb: { page_id: "MW_LG_3", url: urls.lg.gnb, measurements: [] },
    모바일요금제: { page_id: "MW_LG_4", url: urls.lg.mobilePlan, measurements: [] },
    모바일: { page_id: "MW_LG_5", url: urls.lg.mobile, measurements: [] },
    인터넷IPTV: { page_id: "MW_LG_6", url: urls.lg.internetIptv, measurements: [] },
    혜택_멤버십: { page_id: "MW_LG_7", url: urls.lg.benefits, measurements: [] },
    고객지원: { page_id: "MW_LG_8", url: urls.lg.support, measurements: [] },
    다이렉트: { page_id: "MW_LG_9", url: urls.lg.direct, measurements: [] },
    해외로밍: { page_id: "MW_LG_10", url: urls.lg.roaming, measurements: [] },
  },
  skt: {
    메인: { page_id: "MW_SKT_1", url: urls.skt.main, measurements: [] },
    검색: { page_id: "MW_SKT_2", url: urls.skt.search, measurements: [] },
    gnb: { page_id: "MW_SKT_3", url: urls.skt.gnb, measurements: [] },
    모바일요금제: { page_id: "MW_SKT_4", url: urls.skt.mobilePlan, measurements: [] },
    모바일: { page_id: "MW_SKT_5", url: urls.skt.mobile, measurements: [] },
    인터넷IPTV: { page_id: "MW_SKT_6", url: urls.skt.internetIptv, measurements: [] },
    혜택_멤버십: { page_id: "MW_SKT_7", url: urls.skt.benefits, measurements: [] },
    고객지원: { page_id: "MW_SKT_8", url: urls.skt.support, measurements: [] },
    다이렉트: { page_id: "MW_SKT_9", url: urls.skt.direct, measurements: [] },
    해외로밍: { page_id: "MW_SKT_10", url: urls.skt.roaming, measurements: [] },
  },
  kt: {
    메인: { page_id: "MW_KT_1", url: urls.kt.main, measurements: [] },
    검색: { page_id: "MW_KT_2", url: urls.kt.search, measurements: [] },
    gnb: { page_id: "MW_KT_3", url: urls.kt.gnb, measurements: [] },
    모바일요금제: { page_id: "MW_KT_4", url: urls.kt.mobilePlan, measurements: [] },
    모바일: { page_id: "MW_KT_5", url: urls.kt.mobile, measurements: [] },
    인터넷IPTV: { page_id: "MW_KT_6", url: urls.kt.internetIptv, measurements: [] },
    혜택_멤버십: { page_id: "MW_KT_7", url: urls.kt.benefits, measurements: [] },
    고객지원: { page_id: "MW_KT_8", url: urls.kt.support, measurements: [] },
    다이렉트: { page_id: "MW_KT_9", url: urls.kt.direct, measurements: [] },
    해외로밍: { page_id: "MW_KT_10", url: urls.kt.roaming, measurements: [] },
  },
};
