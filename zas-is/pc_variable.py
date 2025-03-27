common_el={
    '팝업_컨텐츠' : 'div.modal-content',
    '팝업_헤더' : 'header.modal-header',
    '팝업_바디' : 'div.modal-body',
    '팝업_닫기' : 'div.modal-content button.c-btn-close',

    'GNB_list' : 'ul.header-gnb-list',

    'KV' : 'div.bo-modules-key-visual',

    'modal_close_con' : '.share_pop_cont',
    'modal_close_close' : '.ui_modal_close',

    'modal_ck2_box' : '.optional-box',
    'modal_ck2_input' : 'input[type="checkbox"]',
    'modal_ck2_btn' : 'button.c-btn-rect-3',

    'body':'html[lang="ko"]>body',
    '모달창_체크박스' : 'div.modal-body input[type=checkbox]',
    '모달창_닫기' : '.c-btn-close',
    '모달창_버튼' : 'div.modal-content button',
    'ins_overlay':"//div[contains(@class, 'ins-custom-overlay')]",
    'ins_close_button':"//div[contains(@class, 'ins-close-button') and text()='닫기']",

}

mypage = {
    'mypage' : '//*[@class="header-gnb-list"]/li/a[contains(.,"마이페이지")]',
    'payinfo' : '//*[@class="sub-menu-list"]/li/a[contains(.,"요금/납부")]',
    'mypage_url' : 'https://www.lguplus.com/mypage',
    'pay_info_url' : 'https://www.lguplus.com/mypage/payinfo',

    '청구서_영역' : 'div.c-my-info-type1',

    'mypage_bill_top' : 'div.c-content-wrap>div.c-page-section:nth-of-type(1) div>div.top-area',
    'mypage_bill' : 'div.c-content-wrap>div.c-page-section:nth-of-type(1) div:nth-of-type(1)> div.inner-con',
    'mypage_bill_membership' : 'div.c-content-wrap>div.c-page-section:nth-of-type(1) div:nth-of-type(2)> div.inner-con',
    'mypage_bill_ezpoint' : 'div.c-content-wrap>div.c-page-section:nth-of-type(1) div.bottom-area',

    'mypage_bill_more' : 'div.c-content-wrap>div.c-page-section div.top-area>button>span',
    'mypage_bill_more_btn' : 'div.c-content-wrap>div.c-page-section div.top-area>button',
    'mypage_bill_more_modal_data' : 'div.modal-content > .modal-body  table > tbody>tr[role="row"]',
    'mypage_bill_more_modal_ctn': 'div.modal-content > .modal-body span.color-def',

    '사용가능한_ez포인트' : 'div.point>a',
    'ezpoint_url' : 'https://www.lguplus.com/mypage/ez-point',
    'ez포인트_조회_페이지' : 'div.ez-point',

    '전체알림_영역' : 'div.c-content-wrap>div.c-page-section:nth-of-type(2)',
    '전체알림_타이틀' : 'div.c-content-wrap>div.c-page-section:nth-of-type(2) h3',

    '주문정보_영역' : 'div.c-content-wrap>div.c-page-section:nth-of-type(3)',
    '주문정보영역_xpath' : '//div[@class="c-page-section" and  contains(.,"주문정보")]',

    '가입서비스_영역' : 'div.c-content-wrap>div.c-page-section:nth-of-type(4)',
    '가입서비스_영역_탭메뉴' : 'div.c-content-wrap>div.c-page-section:nth-of-type(4) ul[role="tablist"]>li>a',
    '가입서비스_영역_컨텐츠' : 'div.c-content-wrap>div.c-page-section:nth-of-type(4) div.c-tabcontent-box > div',

    '넷플계정_쿠폰등록_영역' : 'div.c-content-wrap>div.c-page-section:nth-of-type(5)',

    '청구서_더보기_버튼' : 'div.c-content-wrap>div.c-page-section div.top-area>button',
    '청구서_더보기_팝업_데이터' : 'div.modal-content > .modal-body  table > tbody>tr[role="row"]',
    '청구서_더보기_팝업_데이터_카운트' : 'div.modal-content > .modal-body span.color-def',

    '청구서더보기_버튼' : 'div.c-header-box button',
    '청구서더보기_팝업_데이터_카운트' : 'div.modal-content p.total-num span',

    '요금바로 납부_버튼' : 'div.c-my-info-type1 > div.bottom-area>button:nth-of-type(1)',

    '납부방법변경_버튼' : 'div.c-my-info-type1 > div.bottom-area>button:nth-of-type(2)',

    '결제일변경_버튼' : 'div.c-my-info-type1 > div.bottom-area>button:nth-of-type(3)',

    '청구서받는방법변경_버튼' : 'div.c-my-info-type1 > div.bottom-area>button:nth-of-type(4)',
    '청구서받는방법변경_팝업_정보' : 'div.modal-body  div.c-section:nth-of-type(1)',
    '현재청구서받는방법_영역' : 'div.modal-body div.c-section:nth-of-type(2)',
    '청구서반송내역_영역' : 'div.modal-body div.c-section:nth-of-type(3)',
    '청구서받는방법및주소변경_영역' : 'div.modal-body div.c-section:nth-of-type(4)',
    '청구서받는방법_버튼들' : 'div.modal-body div.c-section:nth-of-type(4)>ul>li label',
    '청구서받는방법_우편청구서' : 'div.modal-body div.c-section:nth-of-type(5)',

    '가입서비스자세히보기_버튼' : '//div[@class="modal-content"]//button[contains(.,"가입서비스")]',
    '가입서비스자세히보기_컨텐츠' : '//div[@class="modal-content" and contains(.,"가입서비스 자세히 보기")]//div[contains(@class,"payinfo-service-info")]',

    '입금전용_계좌발급_버튼' : 'div.c-my-info-type1 > div.bottom-area>button:nth-of-type(5)',
    '청구서_납부방법변경_버튼' : '//div[@class="modal-content"]//button[contains(.,"납부방법")]',

    '청구내역_영역' : 'div.c-content-wrap>div.c-page-section:nth-of-type(2)',
    '청구내역_청구월' : 'div.c-content-wrap>div.c-page-section:nth-of-type(2) > div.payment-table tbody > tr a',
    '청구내역_영역2' : 'div.billInfoWrap',
    '청구내역_재발행_버튼' : 'div.c-content-wrap>div.c-page-section:nth-of-type(2) > div.payment-table tbody > tr >td:last-child>button',

    '부가세포함금액_텍스트' : 'div.c-content-wrap>div.c-page-section:nth-of-type(2) ul.c-bullet-type-circle',
    '납부내역_데이터' : 'div.c-content-wrap>div.c-page-section:nth-of-type(3) >div.payment-table>table >tbody tr',
    '납부확인서신청_버튼' : 'div.c-content-wrap>div.c-page-section:nth-of-type(3) div.t-btn-group>button:nth-of-type(1)',
    '현금영수증발행_버튼' : 'div.c-content-wrap>div.c-page-section:nth-of-type(3) div.t-btn-group>button:nth-of-type(2)',
    '납부내역_영수증_버튼' : 'div.c-content-wrap>div.c-page-section:nth-of-type(3) >div.payment-table>table >tbody tr button',
    '납부영수증_납부한금액' : 'div.payment>span',
    '납부영수증_납부일자' : 'dl.info > dd:nth-of-type(2)',
    '납부영수증_납부방법' : 'dl.info > dd:nth-of-type(1)',

    'bilv' : 'a[data-gtm-click-text="마이페이지|가입/사용 현황|사용내역 조회"]',
    'bilv_url' : 'https://www.lguplus.com/mypage/bilv',

    '사용내역_탭메뉴_버튼' : 'div.c-content-wrap ul[role="tablist"]>li>a',
    '사용요금' : 'div.c-tabcontent-box div.g-payment>div>dl strong',
    '사용요금_합계' : 'div.c-tabcontent-box div.c-custom-tb>table>tfoot>tr>td:last-child',
    '사용내역_탭메뉴_컨텐츠' : '.c-tabmenu-wrap > div.c-tabcontent-box',

    '월별사용량조회_조회월' : 'div.c-tabcontent-box span.txt-date > strong.txt-month',
    '월별사용량조회_이전월_버튼' : 'div.c-tabcontent-box div.fl-month-wrap button.c-prv-arr',
    '월별사용량상세조회_버튼' : 'div.c-tabcontent-box div.c-btn-group > button',
    '월별사용량상세조회_탭메뉴' : 'div.c-tabmenu-wrap > div.c-tabcontent-box ul[role="tablist"]>li>a',
    '월별사용량상세조회_탭메뉴_컨텐츠' : 'div.c-tabmenu-wrap > div.c-tabcontent-box div.c-tabcontent-box .c-content-wrap',
    '휴대폰_소액결제_이용내역' : 'iframe[title="휴대폰 소액결제 이용내역"]',

    '멤버십_영역' : 'div.c-content-wrap >div >div.my-membership-box',
    '멤버십_안내문자메시지수신설정_버튼' : 'div.c-header-box>button',
    '카드신청_및_재발급_버튼' : '//button[contains(.,"멤버십 카드")]',
    '등급안내_버튼' : '//button[contains(.,"등급 안내")]',

    '멤버십_탭메뉴' : 'div.c-tabmenu-wrap ul[role="tablist"]>li>a',
    '멤버십_월별정보' : 'div.c-tabmenu-wrap div.c-tabcontent-box div.c-page-section:nth-of-type(1)',
    '멤버십_기간별이용내역조회' : 'div.c-tabmenu-wrap div.c-tabcontent-box div.c-page-section:nth-of-type(2)',
    '멤버십_기간별이용내역조회_검색버튼' : 'div.c-tabmenu-wrap div.c-tabcontent-box div.c-page-section:nth-of-type(2) button',
    '멤버십_기간별이용내역조회_검색버튼영역' : 'div.c-tabmenu-wrap div.c-tabcontent-box div.c-page-section:nth-of-type(2) >div:last-child',

}

mobile_el = {
    '테마배너' : '.bo-modules-quick-menu',
    '테마배너_링크' : '.bo-modules-quick-menu ul li a',

    'mobile' : '//*[@class="header-gnb-list"]/li/a[contains(.,"모바일")]',
    'url' : 'https://www.lguplus.com/mobile',

    'KV' : 'div.bo-modules-key-visual img',

    '이벤트list' : '.event-section-ul > li >a',
    '이벤트_전체보기' : '.bo-modules-mobile-event-list a.all-view-btn',
    '이벤트상세_전체영역' : 'div.p-benefit-event',
    '진행중인 이벤트_url' : 'https://www.lguplus.com/benefit-event/ongoing',

    '휴대폰_tab' : 'div[location="모바일 서브메인|휴대폰"] .c-tab-default ul[role="tablist"]>li a',
    '휴대폰_panel_주문하기' : 'div[location="모바일 서브메인|휴대폰"] div.btn-wrap > button',
    '휴대폰_panel_상품명' : 'div[location="모바일 서브메인|휴대폰"] .slick-slider.slick-initialized .device-item .card-title .big-title',
    '휴대폰_상세_상품명' : 'h2.title-main',

    '추천요금제_리스트' : '.plan-item button',
    '추천요금제_더보기' : '.bo-modules-mobile-recommand-plan .all-view-btn',
    '요금제상품상세_title' : '.part-header-sec01 .tit',
    '요금제상품상세_price' : '.part-header-sec02 .price',
    '상세_요금제비교하기' : 'button[data-gtm-click-text*="비교하기"]',
    '요금제비교함_팝업' : '//div[contains(@class,"modal-content")]//button[contains(.,"비교함")]',
    '요금제비교함_url':'https://www.lguplus.com/plan/all-list/compare',

    '결합 할인_상담 신청 버튼' : '.total-result-wrap button',
    '결합 할인_드롭다운' : '.c-select-btn a',
    '결합 할인_드롭다운_data' : '.c-select-option li',
    '결합 할인_드롭다운_결과' : '.result-wrap .result-txt',
    '결합 할인_드롭다운_결과_total' : '.total-result-wrap .price-txt span',

    '가입상담신청_팝업_타이틀' : '*[class="modal-title"]',
    '가입상담신청_팝업_이름입력창' : 'input[name="userName"]',
    '가입상담신청_팝업_금액_로딩' : 'div.calculatorBox>dl>dd>ul>li>span',
    '가입상담신청_팝업_금액' : 'div.calculatorBox>dl>dd>ul>li:nth-of-type(2)',
    '가입상담신청_팝업_결합할인' : 'div.calculatorBox dl.result',
    '가입상담신청_팝업_닫기버튼' : 'button.close',
    '가입상담신청_팝업_휴대폰번호' : 'input[name="phNum"]',
    '가입상담신청_팝업_개인정보동의' : 'input[id="agree"]',

    '태블릿_tab' : 'div[location="모바일 서브메인|2nd 디바이스"] .c-tab-default ul[role="tablist"]>li a',
    '태블릿_panel_주문하기' : 'div[location="모바일 서브메인|2nd 디바이스"] div.btn-wrap > button',
    '태블릿_panel_상품명' : 'div[location="모바일 서브메인|2nd 디바이스"] .slick-slider.slick-initialized .device-item .card-title .big-title',

    '모바일이벤트_탭메뉴' : '.par-tabcont-area ul[role="tablist"] li',
    '구매후기' : 'div[location="모바일 서브메인|구매후기"]',
    '구매후기_컨텐츠' : '.review-area .review-ul li .review-wrap a',

    'mobile_plan' : 'a[data-gtm-click-text*="모바일 요금제|5G/LTE"]',
    '사용중인_요금제_정보' : 'div.user-info',
    '사용중인_요금제명' : '.key-area div:nth-child(1) dd',

    '5G/LTE_tab':'ul[role="tablist"] a[data-gtm-click-text*="5G/LTE"]',
    '온라인단독_tab':'ul[role="tablist"] a[data-gtm-click-text*="온라인"]',
    '태블릿/스마트워치_tab':'ul[role="tablist"] a[data-gtm-click-text*="태블릿"]',
    '듀얼넘버_tab':'ul[role="tablist"] a[data-gtm-click-text*="듀얼넘버"]',

    '5G/LTE_url':'https://www.lguplus.com/mobile/plan/mplan/plan-all',
    '온라인단독_url':'https://www.lguplus.com/mobile/plan/mplan/direct',
    '태블릿/스마트워치_url':'https://www.lguplus.com/mobile/plan/mplan/2nd-device',
    '듀얼넘버_url':'https://www.lguplus.com/mobile/plan/mplan/dual',

    '요금제_비교하기' : 'ul.plan-list li div.btn-area button[data-gtm-click-text*="비교하기"]',
    '요금제_list_요금제명' : 'ul.plan-list li p button',
    '요금제_list_가격' : 'ul.plan-list li span.price',
    '요금제_list_할인가격' : 'ul.plan-list span.sale-price',
    '요금제비교함' : 'div.middlearea',
    '요금제비교함_요금제명' : 'div.compare-head>ul>li.active',
    '요금제비교함_가격' : 'div.compare-body>div:first-child >div.active',
    '요금제비교함_할인가격' : 'div.compare-body div.active p.price',
    '요금제비교함_드롭다운' : 'div.compare-head>ul>li.active button.btn-dropdown',
    '요금제비교함_드롭다운_list' : 'div.c-selform-custom.is-active li a',

    '요금제_변경하기' : '.btn-area button:nth-of-type(2)',
    '혜택_선택_list' : '.modal-content .text-radio img',
    '혜택_title' : '.modal-header h1',
    '다음_버튼' : '.modal-content .btn-next',
    '요금제_조회/변경_url':'https://www.lguplus.com/mypage/price-plan/new-mobile',
    '요금제_변경_data' : 'tbody tr td:last-child',
    '요금제조회변경_url':'https://www.lguplus.com/mypage/price-plan/new-mobile',

    'mobile_device' : '.m1 div > ul > li:nth-child(1) ul li:nth-child(1) a',
    'phone_url' : 'https://www.lguplus.com/mobile/device/phone',
    '신청하기_btn' : 'button[data-gtm-event-label*="주문하기"]',
    'phone_info' : 'div.device-info-area',
    'phone_name' : 'h2.title-main .title-main__prod-name',

    '장바구니_가입유형' : "//div[contains(@class,'c-section') and contains(.,'가입 유형')]//input",
    '장바구니_요금제' : "//h3[contains(.,'요금제')]/ancestor::div//input[@name='fee-select']",
    '장바구니_요금제명' : "//h3[contains(.,'요금제')]/ancestor::div//div//a[@class='btn-detail']",
    '장바구니_요금제_특별혜택' : ".benefit-list .c-checkbox input[type='checkbox']",
    '장바구니_할인방법' : "//h3[contains(.,'할인 방법')]/ancestor::div//input[@name='puan-select' or @name='sale-select']",
    '장바구니_납부기간' : "//h3[contains(.,'할인 방법')]/ancestor::div//input[@name='month-credit']",
    '장바구니_제휴카드' : "//div[contains(@class,'c-section') and contains(.,'제휴카드')]//input",
    '장바구니_추가할인' : "//div[contains(@class,'c-section') and contains(.,'추가 할인 혜택')]//input",
    '장바구니_멤버십혜택' : "//div[contains(@class,'c-section') and contains(.,'VIP 멤버십 혜택')]//input",
    '장바구니_사은품' : "//span[contains(.,'사은품')]/ancestor::div//input[@name='radio-gift']",
    '장바구니_쇼핑쿠폰팩' : "//h3[contains(., '매월 이용할 혜택')]/ancestor::div[2]//ul[@class='gift-choice-list']//input[not(@disabled)]",
    'phone_price' : 'div.calculation-box div.title-area div:first-child span.price',

    '장바구니_btn' : 'button[data-gtm-event-label*="장바구니"]',
    '장바구니로_이동_btn' : '//div[@class="modal-content"]//button[contains(.,"장바구니")]',
    '장바구니_url' : 'https://www.lguplus.com/cart',
    '장바구니_상품_영역' : "div.products-contianer",

    '장바구니_삭제_버튼' : '.products-tbl:nth-of-type(1) .btn-del',
    '삭제_확인_버튼' : '.c-btn-group .c-btn-solid-1-m',
}

iptv_el = {
    'iptv' : '//*[@class="header-gnb-list"]/li/a[contains(.,"인터넷/IPTV")]',
    'iptv_url' : 'https://www.lguplus.com/internet-iptv',

    'KVRTB':'div.bo-modules-key-visual img',

    '유플러스혜택받고_가입_이벤트영역' : '.bo-modules-internet-event-list div.middlearea > ul.event-section-ul li',

    '결합상품_영역' : 'div.section-box-plus',
    '결합 상품_list':'div.section-box-plus div.plus-product-wrap div.plus-cont',
    '가입상담신청_버튼' : '//div[contains(@class,"plus-product-wrap")]//div[@class="swiper-wrapper"]/div//button[contains(.,"가입상담")]',
    'apply_consult' : '//*[@class="c-body-content"]/div/div[1]/div',
    '가입상담_팝업_상품영역' : 'div.modal-content div.c-select-section',
    '가입상담_팝업_key':'div.modal-content div.c-select-section tbody>tr:first-child>td',
    '가입상담_팝업_value':'div.modal-content div.c-select-section tbody>tr:last-child>td',
    '온라인1분가입_버튼' : 'section[section-group-id="PcSubMainInternetIptvRecommendPlan"] a[data-gtm-event-label*="온라인"]',
    'online_url' : 'https://www.lguplus.com/signup/package',
    '온라인1분가입_상세' : 'div.p-internet',
    '가입상품명' : 'div.join-product-area>ul>li p.tit',

    '더나은일상_소식영역' : '.bo-modules-internet-benefit-list .event-section-ul li',

}

benefit_el = {
    'benefit' : '//*[@class="header-gnb-list"]/li/a[contains(.,"혜택/멤버십")]',
    'url' : 'https://www.lguplus.com/benefit',

    '멤버십_이용내역' : 'ul.sub-menu-item a[data-gtm-click-text*="멤버십 이용내역"]',
    '멤버십혜택_영역' : 'div.par-tabcont-area',
    '멤버십혜택_탭메뉴' : 'div.par-tabcont-area ul[role="tablist"]',
    '제휴사전체보기_버튼' : 'div.par-tabcont-area div.all-more a',
    '제휴사전체보기_전체영역' : 'div.membership-gift-data',
    'membership_url' : 'https://www.lguplus.com/benefit/membership',

    '온라인_가입할인_혜택' : '.bo-modules-internet-event-list .event-section-ul',
    '온라인_가입할인_혜택_컨텐츠' : '.bo-modules-internet-event-list .event-section-ul li',
    '혜택모두보기_버튼' : '.bo-modules-benefit-online-product .middlearea > a',
    '혜택모두보기_상세' : 'div.uplus-_combined-phone-discount',
    'online' : 'https://www.lguplus.com/benefit-uplus/online-purchase-benefit',

    'uth_benefit' : '//*[@class="sub-menu-list"]//li/a[contains(.,"유쓰 혜택")]',

}

support_el = {
    'support' : '//*[@class="header-gnb-list"]/li/a[contains(.,"고객지원")]',
    'url' : 'https://www.lguplus.com/support',

    '고객지원_검색영역' : 'div.top-search-wrap',
    '고객지원_검색_플래이스홀더' : 'div.top-search-wrap input[placeholder="자주 찾는 검색어"]',
    '자주찾는검색어' : 'div.top-search-wrap div.search-keyword>div a',
    '고객지원_검색인풋창' : 'div.top-search-wrap input',

    '자주하는질문_메뉴탭' : 'div.c-tabmenu-wrap ul[role="tablist"]',
    '검색어_텍스트' : 'p.faq-title>span',
    '검색결과_리스트' : 'div.accordion div[role="button"]',
    '검색결과' : 'div.collapse.show',
    '검색결과_전체영역' : 'div.store-address',
    '자주하는질문키워드' : 'div.search-keyword >div.keyword-link a',

    '도움이될내용' : 'div.cs-intro-1-wrap:not([style="display: none;"])',
    '도움이될내용_버튼' : 'div.cs-intro-1-wrap:not([style="display: none;"]) button',
    '스스로해결가이드' : 'div.cs-intro-2-wrap>div',
    '스스로해결가이드_더보기' : 'div.cs-intro-2-wrap div.middlearea>a',
    '스스로해결가이드_상세_전체영역' : 'div.self-troubleshoot-guide',
    'self_guide_url' : 'https://www.lguplus.com/support/self-troubleshoot/guide',

    '이용가이드영역' : 'div.cs-intro-3-wrap',
    '서비스가입안내' : 'div.cs-intro-3-wrap div.cs-intro-guide >div.cs-intro-guide-box:nth-of-type(1)',
    '서비스조회' : 'div.cs-intro-3-wrap div.cs-intro-guide >div.cs-intro-guide-box:nth-of-type(2)',
    '서비스변경_일시정지_해지' : 'div.cs-intro-3-wrap div.cs-intro-guide >div.cs-intro-guide-box:nth-of-type(3)',
    '매뉴얼다운로드' : 'div.cs-intro-3-wrap div.cs-intro-guide >div.cs-intro-guide-box:nth-of-type(4)',

    '안내영역' : 'div.cs-intro-5-wrap',

}

direct_el = {
    'direct' : '//*[@class="header-gnb-list"]/li/a[contains(.,"다이렉트샵")]',
    'url' : 'https://www.lguplus.com/direct',

    '배너_이미지' : 'div.direct-kv img',

    'con_01' : 'div.direct-usim',
    '다이렉트_컨텐츠1' : 'div.direct-usim div.btn-area a',

    'con_02' : 'div.bo-modules-plan-list .middlearea .section ul.data-list',
    '다이렉트_컨텐츠2_tit' : 'div.bo-modules-plan-list .middlearea .section ul.data-list > li .plan-name',
    '다이렉트_컨텐츠2_price' : 'div.bo-modules-plan-list .middlearea .section ul.data-list > li .plan-origin-price > del',
    '다이렉트_컨텐츠2_가입버튼' : 'div.bo-modules-plan-list .middlearea .section ul.data-list > li > div.btn-area > a',
    '다이렉트_컨텐츠2_전체보기' : '.bo-modules-plan-list div.middlearea > div.section > div.btn-area >a.btn-view-all',
    '다이렉트_컨텐츠2_계산영역' : 'div.calcu-list',

    '전용요금제_가입하기_url' : 'https://www.lguplus.com/mobile',
    '전용요금제_가입하기_전체영역' : 'div.middlearea-contents',

    '다이렉트_컨텐츠3' : 'div.direct-benefit-info ul.direct-benefit-list li',
    '다이렉트_컨텐츠4' : 'ul.swiper-wrapper li',
    '다이렉트_컨텐츠5' : '.banner-list li a',

}

ujam_el = {
    'ujam' : 'a[data-gtm-click-text="혜택/멤버십|서비스+|유잼"]',
    'ujam_con_all' : '.u-zam__detail'

}

udoc_el = {
    'udoc' : '//*[@class="header-gnb-list"]/li/a[contains(.,"유독")]',
}
