import { UIType } from '@common/types/platform-types';

// Type 미지정시, 공통부분으로 로직 처리
export const getLocatorByUIType = (
  locatorGroup: Record<string, string | Record<UIType, string>>,
  uiType: UIType,
): Record<string, string> => {
  return Object.entries(locatorGroup).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === 'string') {
      acc[key] = value; // 공통
    } else if (value[uiType]) {
      acc[key] = value[uiType];
    }
    return acc;
  }, {});
};

// 로그인 관련 로케이터
export const authLocator = {
  //
  myinfo_icon: {
    [UIType.PC]: 'a.icon-myInfo-1',
  },
  myinfo_top: {
    [UIType.PC]: 'div.myInfo-list div.myInfo-top',
  },
  login_box: {
    [UIType.APP]: 'div.loginBox',
  },
  main_login_btn: {
    [UIType.PC]: 'div.myInfo-list.is-show a.c-btn-solid-1-m',
  },
  login_btn: {
    [UIType.PC]: '.loginList > li:nth-of-type(1) > a',
    [UIType.APP]: '.nm-app-login-way li:nth-of-type(1)',
  },
  logout_btn: '.loginList > li:nth-of-type(2) > a',

  // 로그인 방법 - 이미지
  social_kakao_img: "img[alt*='카카오']",
  social_naver_img: "img[alt*='네이버']",
  social_toss_img: "img[alt*='토스']",
  uplus_img: "img[alt*='u+ID']",
  mylg_img: "img[alt*='myLGID']",
  social_apple_img: "img[alt*='애플']",

  // uplus 로그인
  uplus_id_input: "input[type='text']",
  uplus_pw_input: "input[type='password']",
  uplus_login_btn: 'button.nm-login-btn',
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
};
