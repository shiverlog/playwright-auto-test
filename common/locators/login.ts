import { UI } from '@common/constants/LocatorEnum';

export const authLocator = {
  //
  myinfo_icon: {
    [UI.PC]: 'a.icon-myInfo-1',
  },
  main_login_btn: {
    [UI.PC]: 'div.myInfo-list.is-show a.c-btn-solid-1-m',
  },
  login_btn: '.loginList > li:nth-of-type(1) > a',
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
  clear_btn: "button[title='입력한 문자 삭제']",

  // kakao 로그인

  // naver 로그인
};
