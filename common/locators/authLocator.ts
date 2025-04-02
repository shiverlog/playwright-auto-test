import { UIType } from '@common/constants/ContextConstants';

/**
 * 로그인 관련 로케이터
 */
export const authLocator = {
  // 디바이스 타입별 셀렉터
  myinfo_icon: {
    PC: 'a.icon-myInfo-1',
    MOBILE: '',
    APP: '',
  },
  myinfo_top: {
    PC: 'div.myInfo-list div.myInfo-top',
    MOBILE: '',
    APP: '',
  },
  login_box: {
    APP: 'div.loginBox',
    PC: '',
    MOBILE: '',
  },
  main_login_btn: {
    PC: 'div.myInfo-list.is-show a.c-btn-solid-1-m',
    MOBILE: '',
    APP: '',
  },
  login_btn: {
    PC: '.loginList > li:nth-of-type(1) > a',
    APP: '.nm-app-login-way li:nth-of-type(1)',
    MOBILE: '',
  },

  // 공통 단일 셀렉터
  logout_btn: '.loginList > li:nth-of-type(2) > a',
  social_kakao_img: "img[alt*='카카오']",
  social_naver_img: "img[alt*='네이버']",
  social_toss_img: "img[alt*='토스']",
  uplus_img: "img[alt*='u+ID']",
  mylg_img: "img[alt*='myLGID']",
  social_apple_img: "img[alt*='애플']",

  // 로그인 버튼
  uplus_login_btn: 'button:has(img[alt="u+ID"])',

  uplus_id_input: "input[type='text']",
  uplus_pw_input: "input[type='password']",
  uplus_login_submit_btn: 'button.nm-login-btn',
  uplus_clear_btn: "button[title='입력한 문자 삭제']",
  uplus_save_btn: '.c-btn-rect-1',

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
