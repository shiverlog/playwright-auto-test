import { UIType } from '@common/types/platform-types';

/**
 * 로그인 관련 로케이터
 */
export const authLocator = {
  // 메인 나의 정보 아이콘
  myInfoIcon: {
    PC: 'a.icon-myInfo-1',
    MOBILE: '',
    APP: '',
  },
  //
  myinfoTop: {
    PC: 'div.myInfo-list div.myInfo-top',
    MOBILE: '',
    APP: '',
  },
  // APP 스플래쉬 버튼
  guestButton: {
    PC: '',
    MOBILE: '',
    APP: '//button[text()="로그인하지 않고 입장할게요"]',
  },
  //button[text()='로그인하지 않고 입장할게요']
  myLoginWay: {
    PC: '',
    MOBILE: '',
    APP: '//ul[@class="nm-app-login-way"]//button[text()="ID 로그인"]',
  },
  // 메인 로그인 버튼(모바일은 햄버거 버튼 클릭 후 로그인 링크)
  mainLoginButton: {
    PC: 'div.myInfo-list.is-show a.c-btn-solid-1-m',
    MOBILE: '//a[@data-gtm-click-text="로그인"]',
    APP: '',
  },
  // 로그인 페이지
  loginTitle: {
    PC: '//h2[contains(text(), "로그인")]',
    MOBILE: '//h2[contains(@class, "header-title") and contains(., "로그인")]',
    APP: '//h2[contains(@class, "header-title") and contains(normalize-space(.), "로그인")]',
  },
  // u+ 로그인 페이지
  uplusLoginTitle: {
    PC: '//h2[contains(normalize-space(), "U+ID 로그인")]',
    MOBILE: '//h2[contains(normalize-space(), "U+ ID 로그인")]',
    APP: '//h2[contains(normalize-space(), "U+ ID 로그인")]',
  },

  logoutButton: '.loginList > li:nth-of-type(2) > a',
  socialKakaoImg: "img[alt*='카카오']",
  socialNaverImg: "img[alt*='네이버']",
  socialTossImg: "img[alt*='토스']",
  uplusImg: "img[alt*='u+ID']",
  mylgImg: "img[alt*='myLGID']",
  socialAppleImg: "img[alt*='애플']",
  idTooltip: '.c-tooltip',

  // uplus 로그인 버튼
  uplusLoginButton: 'button:has(img[alt="u+ID"])',
  uplusIdInput: "input[type='text']",
  uplusPwInput: "input[type='password']",
  uplusLoginSubmitButton: 'button.nm-login-btn',
  uplusClearButton: 'button[title="입력한 문자 삭제"]',
  uplusSaveButton: '//label[contains(., "ID 저장")]',

  // kakao 로그인
  kakao_id_input: '#loginId--1',
  kakao_pw_input: '#password--2',
  kakao_login_btn:
    '#mainContent > div > div > form > div.confirm_btn > button.btn_g.highlight.submit',
  kakao_clear_btn: '.btn_clear',

  // naver 로그인
  naver_id_input: '#id',
  naver_pw_input: '#pw',
  naver_login_btn: 'div.btn_login_wrap .btn_login',
  naver_clear_btn: '#id_clear',
  main_logout_btn: '.btn-logout c-btn-outline-2-s',
} as const;

// 전체 타입
export type AuthLocator = typeof authLocator;

// UIType 기반 필드 추출
export type AuthLocatorByUIType = {
  [K in keyof AuthLocator as AuthLocator[K] extends Record<UIType, string> ? K : never]: Record<
    UIType,
    string
  >;
};
