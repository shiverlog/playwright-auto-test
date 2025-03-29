import { carrierPages } from './carrierPages';

// 각 페이지의 성능 측정을 위한 인터페이스
export interface TestPage {
  page_id: string;
  url: string;
  measurements: number[];
}
// CarrierPages 객체
export interface CarrierPages {
  [key: string]: TestPage;
}
// carrierPages에서 가져온 값을 사용하여 각 통신사의 페이지 정보를 설정
export const performanceTestPages = {
  lg: carrierPages.lg,
  skt: carrierPages.skt,
  kt: carrierPages.kt,
};
