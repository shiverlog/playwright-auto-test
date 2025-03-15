/**
 * Description : HTMLConstants.ts - 📌 공통 HTML 요소 선택자 (버튼, 입력 필드, 모달 등)
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
export default class HTMLConstants {
  // 로딩 인디케이터
  static readonly LOADING_IMAGE = 'body>.loader';

  // 옵션 관련
  static readonly OPTION = 'option';
  static readonly SELECTED_OPTION = "option[selected='selected']";

  // 버튼 요소
  static readonly BUTTON = 'button';
  static readonly SUBMIT_BUTTON = "button[type='submit']";
  static readonly CANCEL_BUTTON = 'button.cancel';

  // 입력 필드
  static readonly INPUT = 'input';
  static readonly TEXT_INPUT = "input[type='text']";
  static readonly PASSWORD_INPUT = "input[type='password']";
  static readonly EMAIL_INPUT = "input[type='email']";
  static readonly CHECKBOX = "input[type='checkbox']";
  static readonly RADIO_BUTTON = "input[type='radio']";
  static readonly TEXTAREA = 'textarea';

  // 링크 & 네비게이션
  static readonly LINK = 'a';
  static readonly NAV_LINK = 'nav a';

  // 폼 요소
  static readonly FORM = 'form';
  static readonly FORM_GROUP = '.form-group';

  // 모달 & 알림창
  static readonly MODAL = '.modal';
  static readonly ALERT_BOX = '.alert';
  static readonly CONFIRM_DIALOG = '.confirm-dialog';

  // 테이블 관련 요소
  static readonly TABLE = 'table';
  static readonly TABLE_ROW = 'table tr';
  static readonly TABLE_CELL = 'table td';

  // 토스트 메시지 (성공, 오류, 경고)
  static readonly TOAST_MESSAGE = '.toast-message';
  static readonly SUCCESS_MESSAGE = '.toast-message.success';
  static readonly ERROR_MESSAGE = '.toast-message.error';
}
