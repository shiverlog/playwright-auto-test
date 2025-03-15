import { UI } from '@common/constants/LocatorEnum';

export const searchLocator = {
  search_btn: {
    [UI.PC]: '#search_button',
    [UI.MOBILE]: '.header-utill button.c-btn-search',
  },
  ranking-keyword: {
    [UI.PC]: "//div[contains(@class, 'keyword-group') and contains(@class, 'ranking-keyword')]",
    [UI.MOBILE]: "//div[contains(@class, 'c-keyword-wrap') and .//p[@class='h4' and text()='인기 검색어']]",
  },
  keyword: {
    [UI.PC]: "//div[@class='keyword-group ranking-keyword']//a[@class='r-link']",
    [UI.MOBILE]: "//div[contains(@class, 'c-keyword-wrap') and .//p[@class='h4' and text()='인기 검색어']]//a",
  },
  search_input: {
    [UI.PC]: '.c-inpform.is-clear > input',
    [UI.MOBILE]: 'div.c-inpform.is-clear div.c-inpitem input',
  },
  search_result: {
    [UI.PC]: '.search-term.cl-def',
    [UI.MOBILE]: '.c-inpform.is-clear div.c-inpitem .c-inp',
  },
  keword_hashtag: {
    [UI.MOBILE]: 'div.c-tag-wrap a',
  }
};

'검색결과_검색창' : '.c-inpform.is-clear div.c-inpitem .c-inp',
    '입력한문자삭제_btn':'div.modal-content button[title="입력한 문자 삭제"]',

    'search_btn' : '.header-utill button.c-btn-search',
    '검색창_input' : 'div.c-inpform.is-clear div.c-inpitem input',
    '검색어해시태그' : 'div.c-tag-wrap a',


  검색창_검색버튼: 'button.c-ibtn-find',
  검색창_비우기: 'button.c-btn-clear',
  검색_모달창_판단: 'html[lang="ko"] > body',
  검색결과_건수: 'span.result-num',
  검색결과_탭: 'div.search-result-tab-area',


  검색결과_섹션: "//div[@class='section-channel']",
  검색결과_탭:
    "//div[@class='section-channel']//span[contains(text(), '개인') or contains(text(), '기업')]",
  입력한문자삭제_btn: 'div.modal-content button[title="입력한 문자 삭제"]',

