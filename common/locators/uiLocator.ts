import { UI } from '@common/constants/LocatorEnum';

export const overlayLocator = {
  body: "html[lang=\"ko\"]>body",
  딤드: "div#dimmedOverlay",
  ins_overlay: "//div[contains(@class, 'ins-custom-overlay')]",
  ins_close_button: "//div[contains(@class, 'ins-close-button') and text()='닫기']",
  컨텐츠: "div.modal-content",
  헤더: "header.modal-header",
  바디: "div.modal-body",
  닫기: "div.modal-content button.c-btn-close",
  title: "*[class=\"modal-title\"]",
  modal_close_con: ".share_pop_cont",
  modal_close_close: ".ui_modal_close",
  modal: "div.modal-content",
  체크박스: "div.modal-body input[type=checkbox]",
  버튼: "div.modal-content button",
  버튼_ins: "div.ins-content-wrapper a[id*=\"ins-editable-button\"]",
  하단버튼: "div.modal-content footer button",
}

export const appMenuLocator = {
  GNB_list: "ul.header-gnb-list",
    메인_메뉴: ".c-btn-menu",
    전체펼침: "button.dep_all",
    뒤로가기: "button.history_back",
    이전화면: ".c-btn-prev",
    다음버튼: "//android.widget.Button[@text='다음']",
    허용: "com.android.permissioncontroller:id/permission_allow_button",
    모두허용: "com.android.permissioncontroller:id/permission_allow_all_button",
    앱_사용중에만_허용: "com.android.permissioncontroller:id/permission_allow_foreground_only_button",
    동의: "com.lguplus.mobile.cs:id/agreeButton",
    로그인하지_않고_입장할게요: "//android.widget.Button[@text='로그인하지 않고 입장할게요']",
    로그인없이_입장하기: "//android.widget.Button[@text='로그인없이 입장하기']",
    닫기_버튼: "//android.widget.Button[@text='닫기']",
    withoutLogin: "button[class='withoutLogin']",
}
