/**
 * Description : mypageLocator.ts - 📌  UI 처리를 위한 Locator 정의
 * Author : Shiwoo Min
 * Date : 2025-04-20
 */
import { UIType } from '@common/types/platform-types';

/**
 * UI 관련 로케이터
 */
export const mypageLocator = {
  // 검색 > 인기검색어
  rankingKeyword: {
    PC: '//div[contains(@class, "c-keyword-wrap") and .//p[@class="h4" and text()="인기 검색어"]]',
    MOBILE: '//section[@section-group-id="WebMainKVSection"]',
    APP: '',
  },

  // 검색 > 인기검색어 > 검색어
  keyword: {
    PC: '//div[@class="keyword-group ranking-keyword"]//a[@class="r-link"]',
    MOBILE:
      '//div[contains(@class, "c-keyword-wrap") and .//p[@class="h4" and text()="인기 검색어"]]//a',
    APP: '',
  },

  // 검색 > 인기검색어 > 검색어 인풋
  searchInput: {
    PC: '//input[@title="검색어를 입력해주세요." and contains(@class, "c-inp")]',
    MOBILE: '//input[@title="검색어 입력"]',
    APP: '',
  },

  // 검색 > 해시태그
  hashtag: {
    PC: '',
    MOBILE: '//div[contains(@class, "c-tag-wrap")]//a[contains(@class, "c-tag")]',
    APP: '',
  },

  // 검색결과 > 검색 탭 섹션
  searchTabSection: {
    PC: '',
    MOBILE: '//div[@class="section-channel"]',
    APP: '',
  },

  // 검색결과 > 검색 탭(개인/기업)
  searchTab: {
    PC: '//div[contains(@class, "section-channel") or contains(@class, "search-result-tab-area")]//span[contains(text(), "개인") or contains(text(), "기업")]',
    MOBILE:
      '//div[@class="section-channel"]//span[contains(text(), "개인") or contains(text(), "기업")]',
    APP: '',
  },

  // 검색결과 총 ** 건 갯수
  searchResultNum: {
    PC: '//span[contains(@class, "result-num") and contains(text(), "건")]',
    MOBILE: '',
    APP: '',
  },

  // 검색결과 검색어
  searchTerm: {
    PC: '//span[contains(@class, "search-term") and contains(@class, "cl-def")]',
    MOBILE: '',
    APP: '',
  },

  // 검색버튼
  searchButton: {
    PC: '//button[contains(@class, "c-ibtn-find")]',
    MOBILE: '',
    APP: '',
  },

  // 검색 클리어 버튼
  searchClearButton: {
    PC: '//button[@class="c-btn-clear" and @title="입력한 문자 삭제"]',
    MOBILE: '',
    APP: '',
  },

  // 검색모달
  searchModal: '//div[contains(@class, "modal-dialog") and contains(@class, "lay-search-area2")]',

  // 요금/혜택 정보를 한눈에 확인하세요 섹션 타이틀
  mainGradeInfoMypage: {
    PC: '',
    MOBILE: '//a[contains(@data-gtm-click-text, "마이페이지")]/span[2]',
    APP: '',
  },
} as const;

// 전체 타입
export type UILocator = typeof mypageLocator;

// UIType 기반 필드 추출
export type UILocatorByUIType = {
  [K in keyof UILocator as UILocator[K] extends Record<UIType, string> ? K : never]: Record<
    UIType,
    string
  >;
};
