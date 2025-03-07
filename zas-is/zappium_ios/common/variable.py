common_el={
    # slack 로그 전송할 채널
    # 'channel':'C04F5T84SLS', # 테스트 슬랙
    'channel':'C06599H0H08', # 테스트 soo 채널


    'mention_channel' : 'C04F5T84SLS',
    'mention_id' : '<@U041HBBLEMR>, <@U0550LN5MJ8>, <!subteam^S06UD11GD6H>',

    'url':'https://app.lguplus.com/apcm/main',
    'body':'html[lang="ko"]>body',
    'gnb_url' : 'https://app.lguplus.com/gnb',

    '메인_메뉴' : '.c-btn-menu',
    '전체펼침' : 'button.dep_all',
    '뒤로가기' : 'button.history_back',
    '이전화면' : '.c-btn-prev',

    'modal':'div.modal-content',
    '모달창_체크박스' : 'div.modal-body input[type=checkbox]',
    '모달창_닫기' : 'div.modal-content .c-btn-close',
    '모달창_버튼' : 'div.modal-content button',
    'modal_하단버튼':'div.modal-content footer button',
    '딤드' : 'div#dimmedOverlay',
    '모달창_버튼_ins' : 'div.ins-content-wrapper a[id*="ins-editable-button"]',
    'ins_overlay':"//div[contains(@class, 'ins-custom-overlay')]",
    'ins_close_button':"//div[contains(@class, 'ins-close-button') and text()='닫기']",

    'app' :'com.lguplus.mobile.cs',
        
#_#_#_#_#_#_#_#_#_# 주석처리 된 것 #_#_#_#_#_#_#_#_#_#

    # 'back':'button.c-btn-prev',
    # 'modal_close':'div.modal-content button.c-btn-close',

}

login_el = {
    'url' : 'https://app.lguplus.com/apcm/login',
    '로그인 여부':'div.loginBox',

    'ID로그인_btn' : '.nm-app-login-way li:nth-of-type(1)',

    'login_btn' : '.loginList > li:nth-of-type(1) > a',
    'logout_btn' : '.loginList > li:nth-of-type(2) > a',

    'uplus_login_img' : 'img[alt="u+ID"]',
    'uplus_id_input':'input[type="text"]',
    'uplus_pw_input':'input[type="password"]',
    'uplus_login_btn':'button.nm-login-btn',
    'uplus_입력한문자삭제' : 'button[title="입력한 문자 삭제"]',
    # 'uplus_id_저장' : '.nm-login-remember',

    'naver_login_img' : 'img[alt="네이버"]',
    'naver_id_input' : '#id',
    'naver_pw_input' : '#pw',
    'naver_login_btn' : 'btn_check',
    'naver_입력한문자삭제' : '#id_clear',

    'kakao_login_img' : 'img[alt="카카오"]',
    'kakao_id_input' : '#loginId--1',
    'kakao_pw_input' : '#password--2',
    'kakao_login_btn' : '#mainContent > div > div > form > div.confirm_btn > button.btn_g.highlight.submit',
    'kakao_입력한문자삭제' : '.btn_clear',

}

mainpage_el = {
    '개인화':'div.uage-section__info',

    '부가서비스_약정_할부 버튼':'div.extra-service button',
    '부가서비스_약정_할부 콘텐츠':'div.extra-service__content',
    '부가서비스_약정_할부 링크':'div.extra-service__content a',
    '부가서비스 조회/변경_url':'https://app.lguplus.com/mypage/sub-service/mobile',

    '퀵메뉴':'div.shortcut-menu',

    '내가 받은 혜택':'section.benefits-section a.benefits-info__unit',
    'report_url' : 'https://app.lguplus.com/apcm/benefit/report',

    '멤버십':'section.benefits-section button.benefits-info__membership',
    '멤버십_바코드':'div.modal-content div[role] svg',

    '나의 멤버십_태그명':'section.mymembership-section a[data-gtm-click-text*="멤버십"] div.tag span',
    '나의 멤버십_링크':'section.mymembership-section a[data-gtm-click-text*="멤버십"]',
    '나의 멤버십_url':'https://app.lguplus.com/benefit-membership/rank-info',
    '나의 멤버십_등급':'section.section-grade',

    '혜택_list':'section.benefits-section div.benefits-list',
    '혜택_list_링크':'section.benefits-section div.benefits-list ul button',
    '혜택_더보기':'section.benefits-section div.benefits-list a',
    '나의 혜택 모아보기_url':'/apcm/benefit/report?tab=2',
    '나의 혜택 모아보기':'div.app-p-mypage-new',

    'KV':'section[section-group-id="AppMainKVSection"]',
    'KV_링크':'section[section-group-id="AppMainKVSection"] div.swiper-slide a:first-child',
    '이벤트_title':'section[section-group-id="MainEventSection"] header a',
    '이벤트_콘텐츠':'section[section-group-id="MainEventSection"] div a',

    '추천모바일':'section[section-group-id="MainMobileSectionIOS"]',
    '추천모바일_title':'section[section-group-id="MainMobileSectionIOS"] header a',
    '추천모바일_콘텐츠':'section[section-group-id="MainMobileSectionIOS"] div a',
    '추천모바일_콘텐츠_title':'section[section-group-id="MainMobileSectionIOS"] div a header p:first-child',
    '추천모바일_콘텐츠_더보기':'section[section-group-id="MainMobileSectionIOS"] div:last-child >a',

    '상품상세_title':'p.device-kv-wrap__info--title',

    '추천요금제':'section[section-group-id="MainPricePlanSection"]',
    '추천요금제_title':'section[section-group-id="MainPricePlanSection"] h3 a',
    '추천요금제_콘텐츠':'section[section-group-id="MainPricePlanSection"] div a',
    '추천요금제_콘텐츠_title':'section[section-group-id="MainPricePlanSection"] div a p.sub-title',
    '추천요금제_콘텐츠_더보기':'section[section-group-id="MainPricePlanSection"] div:last-child > a',

    '추천홈상품':'section[section-group-id="MainHomeSection"]',
    '추천홈상품_title':'section[section-group-id="MainHomeSection"] header a',
    '인터넷iptv_url':'https://app.lguplus.com/internet-iptv/internet-iptv-package/plan',
    '추천홈상품_콘텐츠':'section[section-group-id="MainHomeSection"] div a',
    '추천홈상품_콘텐츠_title':'section[section-group-id="MainHomeSection"] div a p.brand-payment',
    'iptv상품상세_title':'div.product-info__item strong.product-name', 
    'iptv상품상세_url':'https://app.lguplus.com/signup/step1/package',
    
#_#_#_#_#_#_#_#_#_# 주석처리 된 것 #_#_#_#_#_#_#_#_#_#

    # '개인화_상품 조회 변경':'div.uage-section__info button[title="다른 상품 조회 선택"]',
    # '개인화_모달_상품':'div.modal-content div.c-radio-box-3 input',
    # '이용중인 나의 상품 정보_url':'https://app.lguplus.com/apcm/main',
    # '할인반환금 정보_url':'https://app.lguplus.com/mypage/cancellation-fees',

}


search_el = {
    '검색결과_검색창' : '.c-inpform.is-clear div.c-inpitem .c-inp',
    '입력한문자삭제_btn':'div.modal-content button[title="입력한 문자 삭제"]',

    'search_btn' : '.header-utill button.c-btn-search',
    '검색창_input' : 'div.c-inpform.is-clear div.c-inpitem input',
    '검색어해시태그' : 'div.c-tag-wrap a',

    '검색결과_url' : 'https://app.lguplus.com/search/result',
}

mypage = {
    'mypage' : '//button[contains(.,"마이페이지")]',
    'direct' : '.menu >ul > li > div > a',
    'mypage_url' : 'https://app.lguplus.com/mypage',

    '청구서_드롭다운' : 'button.c-btn-dropdown',
    '청구서_list' : '.modal-content div.c-radio-box-3 li.service-type',
    '사용현황_청구서_list' : '.modal-content .c-radio-box-3 .text-radio .tit:nth-of-type(1)',
    '청구서_radio_btn' : 'input[type="radio"]',
    '청구서_하단_확인_버튼' : 'footer > div > button',
    '청구서_text' : '.c-btn-dropdown>strong',
    '청구서_text2' : '.c-btn-dropdown>span',
    
    '모바일_정보' : 'li.used-data > div',
    '청구_및_납부_정보' : 'li.charged > div',
    '주문정보' : '//div[contains(.,"주문정보") and contains(@class,"c-section")]',
    '가입서비스' : '//div[contains(.,"가입 서비스") and contains(@class,"c-section")]',
    '멤버십_정보' : '//div[contains(.,"멤버십") and contains(@class,"p-mypage-main-membership")]',

    '요금/납부_이동' : '.submain-section > div:nth-of-type(2) > div:nth-of-type(2) .c-goto-block',
    '납부_정보' : 'div.info-box',
    '청구_납부내역_tab' : 'div.m-tabs a[role="tab"]',
    '내역_list' : 'div.tab-panel li.line-item',

    'bill_direct': '//a[contains(.,"요금/납부 조회")]',
    'bill_url':'https://app.lguplus.com/mypage/payinfo',

    'use_direct' : '//a[contains(.,"사용내역 조회")]' , 
    'use_url' : 'https://app.lguplus.com/mypage/bilv',

    '실시간요금조회' : 'ul[role="tablist"]>li:nth-of-type(1)>a',
    '실시간이용요금_정보' : '//*[@class="list-box-usedinfo"]/li/ul/li/p',
    'top_bill' : '//*[@class="p-mypage"]/div/div[1]/div/p[1]/em',
    'bottom_bill' : '//*[@class="list-box-usedinfo"]/li[3]/ul/li/p',

    '내역_정보' : 'div.c-section-md',
    '사용내역_정보_상세' : 'div.c-section-xs',

    '월별사용량조회' : 'ul[role="tablist"]>li:nth-of-type(2)>a',
    '월별사용량조회_data_col' : 'table.table >thead',
    '월_정보' : 'span.monthly > i',
    '이전_월_버튼' : 'button.c-btn-month-prev',

    '월별사용량_상세조회_버튼' : 'div.c-section-md >div.c-btn-group >button',
    '월별사용량_상세조회_tab' : 'div.modal-content ul[role="tablist"]',
    '월별사용량_상세_날짜' : 'div.modal-content span.monthly',
    '월별사용량_상세_확인_버튼' : 'div.modal-content div.c-btn-group>button',

    '통화상세내역' : 'ul[role="tablist"]>li:nth-of-type(3)>a',
    '조회_버튼' : 'div.c-btn-group >a',
    '통화상세내역_조회' : 'div.modal-content >div.modal-body',
    '통화상세내역_조회_확인_버튼' : 'div.modal-content div.c-btn-group>button.c-btn-solidbox-1',

    '인터넷_통화상세내역_조회' : '//*[@class="swiper-wrapper"]/li[1]/a',
    '인터넷_통화상세내역' : 'div.mypage-usedinfo-callhistory',
    
    '기가인터넷사용량' : '//*[@class="swiper-wrapper"]/li[2]/a',
    '기가인터넷_사용_정보' : 'div.mypage-usedinfo >div.c-section-md:not(.use-amount)',

    'IPTV사용내역' : '//a[contains(@role,"tab") and contains(.,"IPTV컨텐츠")]',
    'IPTV사용_정보' : 'div.used-info >div.c-section-md:nth-of-type(1)',
    'IPTV_본인인증' : 'div.used-info >div.c-section-md:nth-of-type(2) div.component__inner',
    'IPTV_본인인증_버튼' : 'div.used-info >div.c-section-md:nth-of-type(2) div.component__inner label',

    '멤버십_정보' : 'div.submain-section.mypage-membership > div.c-section-md',
    '월별_할인_혜택_이용정보' : 'div.tab-panel > div > div.c-section-md:nth-of-type(1)',
    '기간별_이용내역_조회' : 'div.tab-panel > div > div.c-section-md:nth-of-type(2)',
    '기간별_이용내역_조회_버튼' : 'div.tab-panel > div > div.c-section-md:nth-of-type(2) > div.c-btn-group>a',
    '기간별_이용내역_정보' : 'div[style=""]',

    '멤버십_변경내역_tab' : 'ul[role="tablist"] >li:nth-of-type(2)',
    '멤버십_등급_변경내역' : 'div.tab-panel div.c-section-md:nth-of-type(1)',
    '멤버십 카드 발급내역':'div.tab-panel div.c-section-md:nth-of-type(2)',
    '멤버십 카드 발급내역_자세히보기':'div.tab-panel  div.c-section-md:nth-of-type(2) >div>button',
    '멤버십 카드 발급내역_자세히보기_팝업':'div.modal-content div.c-section-md',
    
#_#_#_#_#_#_#_#_#_# 주석처리 된 것 #_#_#_#_#_#_#_#_#_#

    # '나만의 콕 혜택 신청내역':'div.tab-panel div.c-section-md:nth-of-type(3)',

}         

mobile_el = {
    'mobile' : '//button[contains(.,"모바일")]',
    'direct' : '.menu >ul > li > div > a',
    'url' : 'https://app.lguplus.com/mobile',

    'KV_링크':'div[section-group-id="MoSubMainMobileKVSection"] div a',
    '테마배너':'div[section-group-id="MoSubMainMobileThemeSection"]',
    '테마배너_링크':'div[section-group-id="MoSubMainMobileThemeSection"] li a',

    '이벤트':'div[section-group-id="MoSubMainMobileEventSection"]',
    '이벤트_title':'div[section-group-id="MoSubMainMobileEventSection"] div.section-title a',
    '이벤트_콘텐츠':'div[section-group-id="MoSubMainMobileEventSection"] div.swiper-slide a',

    '휴대폰_title':'div[section-group-id="MoSubMainMobileDeviceSection"] div.section-title a',
    '모바일기기_휴대폰_url' : 'https://app.lguplus.com/mobile/device/phone',
    '휴대폰_탭':'div[section-group-id="MoSubMainMobileDeviceSection"] div.m-tabs',
    '휴대폰_탭_링크':'div[section-group-id="MoSubMainMobileDeviceSection"] div.m-tabs a',
    '휴대폰_panel':'div[section-group-id="MoSubMainMobileDeviceSection"] div.tab-panel:not([style^="display"])',
    '휴대폰_panel_주문하기':'div[section-group-id="MoSubMainMobileDeviceSection"] div.tab-panel:not([style^="display"]) div.swiper-slide-active div.card-bottom button',
    '휴대폰_panel_상품명':'div[section-group-id="MoSubMainMobileDeviceSection"] div.tab-panel:not([style^="display"]) div.card-title p.big-title',
    '기기상품상세_title':'p.device-kv-wrap__info--title',

    '추천 요금제':'section[section-group-id="MoSubMainMobileRecommendPlan"]',
    '추천 요금제_title':'section[section-group-id="MoSubMainMobileRecommendPlan"] header.title a',
    '모바일요금제_요금제_url':'https://app.lguplus.com/mobile/plan/mplan/plan-all',
    '추천 요금졔_panel':'section[section-group-id="MoSubMainMobileRecommendPlan"] div.slide-wrap',
    '추천 요금제_링크':'section[section-group-id="MoSubMainMobileRecommendPlan"] div.slide-wrap a',
    '요금제상품상세_title':'p.h1', 
    '요금제상품상세_price':'p.amount-pay',

    '휴대폰결합상품':'div[section-group-id="MoSubMainMobileCombinedSection"]',
    '가입상담신청_btn':'div[section-group-id="MoSubMainMobileCombinedSection"] a[data-gtm-click-text^="가입상담"]',
    '휴대폰결합상품_select':'div[section-group-id="MoSubMainMobileCombinedSection"] select',
    '휴대폰결합상품_value':'div[section-group-id="MoSubMainMobileCombinedSection"] div.each-price-area span',

    '가입상담신청_팝업_타이틀' : '*[class="modal-title"]',
    '가입상담신청_팝업_고객명' : 'input[name="userName"]',
    '가입상담신청_팝업_휴대폰번호' : 'input[name="phNum"]',
    '가입상담신청_팝업_개인정보_동의' : 'input[id="agree"]',
    '가입상담신청_팝업_data_load' : 'div.calculatorBox>dl>dd>ul>li>span',
    '가입상담신청_팝업_data' : 'div.calculatorBox>dl>dd>ul>li:nth-of-type(2)',

    '태블릿':'div[section-group-id="MoSubMainMobile2ndDeviceSection"]',
    '태블릿_title':'div[section-group-id="MoSubMainMobile2ndDeviceSection"] div.section-title a',
    '모바일기기_태블릿_url':'https://app.lguplus.com/mobile/device/smart-device',
    '태블릿_탭_링크':'div[section-group-id="MoSubMainMobile2ndDeviceSection"] ul[role="tablist"] a',

    '태블릿_panel':'div[section-group-id="MoSubMainMobile2ndDeviceSection"] div.tab-panel:not([style^="display"])',
    '태블릿_panel_주문하기':'div[section-group-id="MoSubMainMobile2ndDeviceSection"] div.tab-panel:not([style^="display"]) div.swiper-slide-active div.card-bottom button',
    '태블릿_panel_상품명':'div[section-group-id="MoSubMainMobile2ndDeviceSection"] div.tab-panel:not([style^="display"]) div.card-title p.big-title',

    '하위메뉴_panel_콘텐츠':'div[section-group-id="MoSubMainMobileBottomMenuSection"] div.tab-panel:not([style^="display"]) div.info-txt img',
    '하위메뉴_탭_링크':'div[section-group-id="MoSubMainMobileBottomMenuSection"] div.m-tabs a',
    
    '구매후기':'div[section-group-id="MoSubMainMobileReviewSection"]',
    '구매후기_tab_list':'div[section-group-id="MoSubMainMobileReviewSection"] div.m-tabs a',
    '구매후기_콘텐츠':'div[section-group-id="MoSubMainMobileReviewSection"] div.tab-panel:not([style^="display"]) a',

    '모바일요금제_5G/LTE':'a[data-gtm-click-text*="모바일 요금제|5G/LTE"]',

    '사용중인_요금제_정보':'div.tab-panel div.accordion:nth-of-type(1)',
    '사용중인_요금제_정보_btn':'div.tab-panel div.accordion:nth-of-type(1) div[role="button"]',
    '사용중인_요금제명':'p.c-acc-price em',

    '5G/LTE_tab':'ul[role="tablist"] a[data-gtm-click-text*="5G/LTE"]',
    '온라인단독_tab':'ul[role="tablist"] a[data-gtm-click-text*="온라인"]',
    '태블릿/스마트워치_tab':'ul[role="tablist"] a[data-gtm-click-text*="태블릿"]',
    '듀얼넘버_tab':'ul[role="tablist"] a[data-gtm-click-text*="듀얼넘버"]',
    
    '5G/LTE_url':'https://app.lguplus.com/mobile/plan/mplan/plan-all',
    '온라인단독_url':'https://app.lguplus.com/mobile/plan/mplan/direct',
    '태블릿/스마트워치_url':'https://app.lguplus.com/mobile/plan/mplan/2nd-device',
    '듀얼넘버_url':'https://app.lguplus.com/mobile/plan/mplan/dual',

    '요금제_비교하기':'button[data-gtm-click-text*="비교하기"]',
    '요금제_list_요금제명':'p.tit1',
    '요금제_list_가격':'p.txt_price1',
    '요금제_list_할인가격':'div.txt_price2 span:not(.blind)',
    '요금제_비교하기_팝업_확인' : 'div.modal-content button.c-btn-solid-1',

    '요금제비교함' : 'div.plan_inner_pad1',
    '요금제비교함_요금제명' : 'div.cont:last-child',
    '요금제비교함_가격' : 'div.plan_inner_pad1>ul:nth-of-type(1) li:last-child',
    '요금제비교함_할인가격' : 'div.plan_inner_pad1>ul:nth-of-type(2) li:last-child',
    '요금제비교함_드롭다운' : 'div.cont button:not([disabled])',
    '요금제비교함_드롭다운_list' : 'div.modal-content ul.plan-select-pop li input',
    '요금제비교함_드롭다운_추가하기' : 'div.modal-content button.c-btn-solid-1-m',
    '요금제비교함_신청하기_버튼' : '.c-btn-group button',

    '요금제_변경하기':'button[data-gtm-click-text*="변경하기"]',
    '요금제조회변경_url':'https://app.lguplus.com/mypage/price-plan/new-mobile',
    '혜택_선택_list' : '.c-card-radio-1 img',
    '혜택_title' : '.title-wrap .title',
    '다음_버튼' : '.modal-footer button',
    '요금제_변경_data' : 'tbody tr td:last-child',

    'mobile_device_phone' : '.dep2li:nth-of-type(1) ul li:nth-of-type(1)',
    'phone_url' : 'https://m.lguplus.com/mobile/device/phone',
    '신청하기_btn' : 'button[data-gtm-event-label*="신청하기"]',
    'phone_info' : 'div.device-kv-wrap__info',
    'phone_info2' : 'p.device-kv-wrap__info--prod-num',
    'phone_name' : 'p.device-kv-wrap__info--title',
    
    '장바구니_가입유형' : "//div[contains(@class,'component') and not(contains(@aria-hidden,'true')) and contains(.,'가입 유형')]//input",
    '장바구니_요금제' : "//div[contains(@class,'component') and not(contains(@aria-hidden,'true')) and contains(.,'요금제')]//input[contains(@data-gtm-event-action,'요금제')]",
    '장바구니_요금제_특별혜택' : ".card-benefit .c-card-radio",    
    '장바구니_할인방법' : "//div[contains(@class,'component') and not(contains(@aria-hidden,'true')) and contains(.,'할인 방법')]//input",
    '장바구니_납부기간' : "//div[contains(@class,'component') and not(contains(@aria-hidden,'true')) and contains(.,'몇 개월 할부')]//descendant::li[not(contains(@style,'display: none;'))]//input",
    '장바구니_배송방법' : "//div[contains(@class,'component') and not(contains(@aria-hidden,'true')) and contains(.,'배송 방법')]//input",
    '장바구니_멤버십혜택' : 'input[data-gtm-click-location="멤버십 혜택 선택 영역"]',
    '장바구니_사은품' : "//div[contains(@class,'component') and not(contains(@aria-hidden,'true')) and contains(.,'사은품')]//input",
    '장바구니_추가혜택' : "//div[contains(@class,'component') and not(contains(@aria-hidden,'true')) and contains(.,'이용할 혜택')]//input",
    '장바구니_제휴카드' : "//div[contains(@class,'component') and not(contains(@aria-hidden,'true')) and contains(.,'제휴카드')]//input",
    '장바구니_추가할인' : "//div[contains(@class,'component') and not(contains(@aria-hidden,'true')) and contains(.,'추가 할인')]//input",
    'phone_price' : 'div.simcard-fixed-box p.price',

    '장바구니_btn' : 'button[data-gtm-event-label*="장바구니"]',
    '장바구니로_이동_btn' : 'button[aria-label="장바구니 바로가기"]',
    '장바구니_url' : 'https://app.lguplus.com/cart',
    '장바구니_상품_영역' : "div.c-card-cart",
    '상세내역_확인btn' : '#cSection .c-btn-group button:nth-of-type(3)',
    '장바구니_삭제_버튼' : '.c-card-cart .cart-box button.c-btn-del',
    '삭제_확인_버튼' : '.c-btn-outline-1-m',

}

iptv_el = {
    'iptv' : '//button[contains(.,"IPTV")]',
    'direct' : '.menu >ul > li > div > a',
    'iptv_url' : 'https://app.lguplus.com/internet-iptv',

    'KV_링크':'div[section-group-id="MoSubMainInternetIptvKVSection"] a',
    '테마배너':'div[section-group-id="MoSubMainInternetIptvThemeSection"]',
    '테마배너_링크':'div[section-group-id="MoSubMainInternetIptvThemeSection"] ul a',

    '추천이벤트_링크':'div[section-group-id="MoSubMainInternetIptvEventSection"] a',

    '추천 결합상품':'div[section-group-id="MoSubMainInternetIptvRecommendPlan"]',
    '추천 결합상품_carousel':'div[section-group-id="MoSubMainInternetIptvRecommendPlan"] div.c-wrap-plus-product',
    '추천 결합상품_상품정보':'div[section-group-id="MoSubMainInternetIptvRecommendPlan"] div.swiper-slide-active div.item span',
    '추천 결합상품_가입상담 신청':'div[section-group-id="MoSubMainInternetIptvRecommendPlan"] div.swiper-slide-active button[data-gtm-event-label*="가입상담"]',
    'apply_consult':'div.modal-content div.c-noticebox-2',
    '가입상담_신청_팝업_헤더' : 'header.modal-header',
    '가입상담_신청_팝업_data_col' : 'div.modal-content table>tbody>tr>th',
    '가입상담_신청_팝업_data_row' : 'div.modal-content table>tbody>tr>td',
    '가입상담_신청_팝업_닫기' : '',

    '추천 결합상품_온라인가입':'div[section-group-id="MoSubMainInternetIptvRecommendPlan"] div.swiper-slide-active a[data-gtm-event-label*="온라인"]',
    '온라인가입_url':'/signup/package',
    '추천 결합상품_온라인가입_data' : 'div.product-info>div >strong',

    '혜택_콘텐츠':'div[section-group-id="MoSubMainInternetIptvBenefit1Section"]',
    '혜택_콘텐츠_링크':'div[section-group-id="MoSubMainInternetIptvBenefit1Section"] a',

}

benefit_el = {
    'benefit' : '//button[contains(.,"혜택/멤버십")]',
    'direct' : '.menu >ul > li > div > a',
    'url' : 'https://app.lguplus.com/benefit',

    'KV_링크' : 'div[section-group-id="MoSubMainBenefitKVSection"] a',

    '테마배너':'div[section-group-id="MoSubMainBenefitThemeSection"]',
    '테마배너_링크':'div[section-group-id="MoSubMainBenefitThemeSection"] li a',

    '제휴사 혜택_title':'div[section-group-id="MoSubMainBenefitAffiliateSection"] div.section-title a',
    '멤버십 혜택_url':'https://app.lguplus.com/benefit-membership',
    '제휴사 혜택_탭_링크':'div[section-group-id="MoSubMainBenefitAffiliateSection"] div.m-tabs a',
    '제휴사 혜택_panel_링크':'div[section-group-id="MoSubMainBenefitAffiliateSection"] div.tab-panel a',
    '제휴사 혜택_전체보기':'div[section-group-id="MoSubMainBenefitAffiliateSection"] div.c-btn-group a',

    '온라인 가입 혜택_title':'div[section-group-id="MoSubMainBenefitOnlineOnlySection"] div.section-title a',
    '온라인 가입 혜택_콘텐츠_링크':'div[section-group-id="MoSubMainBenefitOnlineOnlySection"] div.m-swiper a',
    '온라인 가입 혜택_url':'https://app.lguplus.com/benefit-uplus/online-purchase-benefit/ORN0030748',

    '이벤트_title':'div[section-group-id="MoSubMainBenefitEventSection"] div.section-title a',
    '진행 중인 이벤트_url':'https://app.lguplus.com/benefit-event/ongoing',
    '이벤트_콘텐츠_링크':'div[section-group-id="MoSubMainBenefitEventSection"] ul a',

    'membership' : 'div.mypage-membership',
    'membership_direct' :'//a[contains(.,"멤버십 이용")]', 
    'membership_url':'https://app.lguplus.com/benefit/membership',

}

support_el = {
    'support' : '//button[contains(.,"고객지원")]',
    'direct' : '.menu >ul > li > div > a',
    'url' : 'https://app.lguplus.com/support',

    '고객지원_검색_영역' : 'div.section-wide.bg-gray8',
    '고객지원_검색창' : 'div.section-wide input[placeholder="자주 찾는 검색어"]',
    '고객지원_자주찾는_검색어_list' : 'div.section-wide div.support-main-search-tag a',
    '고객지원_검색_버튼' : 'button.c-btn-find-1',

    '키워드로_찾기_tab' : 'div.tabs>ul[role="tablist"]>li:nth-of-type(1)>a',
    '포함_검색어' : 'span.cl-def',
    '자주하는질문_list' : 'div.accordion.c-accordion>div>div[role="button"]',
    '답변_내용' : 'div.collapse.show',

    '도움이_될_내용' : 'div.submain-section > div.c-section-xs > div.section-wide.login-after',
    '도움이_될_내용_list' : 'div.submain-section > div.c-section-xs > div.section-wide.login-after ul a',

    '스스로_해결_가이드' : 'div.submain-section > div.c-section-xs > div.c-section-md',
    '스스로_해결_가이드_title' : 'div.submain-section > div.c-section-xs > div.c-section-md > p',
    '스스로_해결_가이드_list' : 'div.submain-section > div.c-section-xs > div.c-section-md div.swiper-wrapper a',

}

direct_el = {
    'direct' : '//button[contains(.,"다이렉트")]',
    'url':'https://app.lguplus.com/direct',

    'kv_list':'div.direct-kv img',
    'con_01':'div.direct-usim',
    'con_02':"div[moduleid='PlanCombineCarousel03']",
    'con_02_title':"div[moduleid='PlanCombineCarousel03'] p.plan-name",
    'con_02_price':"div[moduleid='PlanCombineCarousel03'] p.plan-price",
    'con_02_가입하기':"div[moduleid='PlanCombineCarousel03'] a[data-gtm-event-name='order_button_click']",
    
    '전용요금제_가입하기_url':'https://app.lguplus.com/mobile/usim-detail',
    'con_03':'div.direct-benefit-info',
    'con_03_li':'div.direct-benefit-info ul li',
    'con_04':'div.direct-review',
    'con_04_li':'div.direct-review ul li',
    'con_05':'div[moduleid="BannerImageCarousel05"]',
    'con_05_li':'div[moduleid="BannerImageCarousel05"] ul li',
    'con_06':'div[moduleid="BannerImageList01"]',
    'con_06_li':'div[moduleid="BannerImageList01"] ul li',

}

ujam_el = {
    'ujam' : 'a[data-gtm-click-text="혜택/멤버십|서비스+|유잼"]',
    'url' : 'https://app.lguplus.com/ujam',

}

udoc_el = {
    'start' : '//button[contains(.,"유독")]',
    'url' : 'https://app.lguplus.com/pogg/main',

}
