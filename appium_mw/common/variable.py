common_el={
    # slack 로그 전송할 채널
    # 'channel':'C04GM3KA43G', # 테스트 운영
    # 'channel':'C04F5T84SLS', # 테스트 슬랙
    'channel':'C06599H0H08', # 테스트 soo 채널
    # 'channel' : 'C066G4NNRGW', # test 


    'mention_channel' : 'C04F5T84SLS',
    'mention_id' : '<@U041HBBLEMR>, <@U0550LN5MJ8>, <!subteam^S06UD11GD6H>',

    'gnb_url':'https://m.lguplus.com/gnb',
    'home_url':'https://m.lguplus.com/main',

    'popup_close':'div.modal-content button.c-btn-close',
    'popup_title':'*[class="modal-title"]',

    'body':'html[lang="ko"]>body',
    '모달창_체크박스' : 'div.modal-body input[type=checkbox]',
    '모달창_닫기' : '.c-btn-close',
    # '모달창_버튼' : 'div.modal-content button',
    '모달창_버튼' : 'div.modal-content button[data-gtm-click-text="닫기"]',
    
    '메뉴_버튼' : '.c-btn-menu',
    '전체_펼침' : 'button.dep_all',
    '뒤로가기_버튼' : 'button.history_back',
    '로그인_box' : 'div.loginBox',
   
}

login_el = {
    'login_btn' : '.loginList > li:nth-of-type(1) > a',
    'login_url':'https://m.lguplus.com/login',
    'logout_btn' : '.loginList > li:nth-of-type(2) > a',

    'U+로그인' : 'img[alt="u+ID"]',
    'U+ID' : 'input[name="intgWbmbId"]',
    'U+PW' : 'input[type="password"]',
    'U+로그인_버튼' : 'button.nm-login-btn',
    'ID저장_체크_해제' : '//label[contains(., "ID 저장")]',
    '입력한_문자_삭제' : 'button[title="입력한 문자 삭제"]:not([style="display: none;"])',

    'mylgid':'//img[contains(@alt,"myLGID")]',
    'id_input' : '.loginCtr.padding-right-large',
    'pw_input' : '//*[@id="loginPwd"]',
    'login_btn_pop' : '.is-primary.is-full-width',
    '다른_계정_로그인' : '//a[contains(.,"다른 계정으로 로그인")]',
    
}

mainpage_el = {
    'KV':'section[section-group-id="WebMainKVSection"]',
    'kv_링크':'//section[contains(@class,"kv-section")]//a/preceding-sibling::a',
    
    '개인화/다운로드 콘텐츠':'section.login-app-info',
    '앱 다운로드':'.benefits-banner-list .link-btn',
    '앱 다운로드_url':'https://m.lguplus.com/apcm/html-push',
    '앱_종료_버튼' : '.c-btn-solidbox-1',
    '앱으로보기_버튼' : 'img[alt="당신의U+ 앱으로 보기"]',
    '마이페이지':'section.login-app-info ul li:first-child a[data-gtm-click-text*=마이페이지]',
    '닷컴 회원 전용 혜택':'section.login-app-info ul li:last-child a',
    '닷컴 회원 전용 혜택_url':'https://m.lguplus.com/benefit-uplus/member-private-benefit',

    '추천기기':'section.popular-section',
    '추천기기_title':'section.popular-section header a',
    '추천기기_링크':'section.popular-section div a',
    '추천기기_기기명':'section.popular-section div a p.title',

    '추천요금제':'section[section-group-id="MainPricePlanSection"]',
    '추천요금제_title':'section[section-group-id="MainPricePlanSection"] header a',
    '추천요금제_링크':'section[section-group-id="MainPricePlanSection"] div a',
    '추천요금제_제품명':'section[section-group-id="MainPricePlanSection"] div a p.sub-title',

    '추천홈상품':'section[section-group-id="MainHomeSection"]',
    '추천홈상품_title':'section[section-group-id="MainHomeSection"] header a',
    '추천홈상품_링크':'section[section-group-id="MainHomeSection"] div a',
    '추천홈상품_콘텐츠_title':'section[section-group-id="MainHomeSection"] div a p.brand-payment',

    '인터넷iptv_url':'https://m.lguplus.com/internet-iptv/internet-iptv-package/plan',
    'iptv상품상세_title':'div.product-info__item strong.product-name', 
    'iptv상품상세_url':'https://m.lguplus.com/signup/step1/package',

    '유플닷컴_이용가이드' : 'section[section-group-id="MainUseGuideSection"]',
    '유플닷컴_이용가이드_콘텐츠' : 'section[section-group-id="MainUseGuideSection"] li a',

    '추천콘텐츠_잼' : 'section[section-group-id="MainRecommendSection"]',
    '추천콘텐츠_콘텐츠' : 'section[section-group-id="MainRecommendSection"] div a',

    '유플닷컴_통신_생활' : 'section[section-group-id="MainOurlifeSection"]',
    '유플닷컴_통신_생활_콘텐츠' : 'section[section-group-id="MainOurlifeSection"] li a',

    '이럴땐_U렇게' : 'section[section-group-id="MainSuggestSection"]',
    '이럴땐_U렇게_헤더' : 'section[section-group-id="MainSuggestSection"] header a',
    '이럴땐_U렇게_url' : '/support/self-troubleshoot/guide',
    '이럴땐_U렇게_콘텐츠' : 'section[section-group-id="MainSuggestSection"] div a',
    
    '진행중인_이벤트' : 'section[section-group-id="MainEventSection"]',
    '진행중인_이벤트_헤더' : 'section[section-group-id="MainEventSection"] header a',
    '진행중인_이벤트_url' : '/benefit-event/ongoing',
    '진행중인_이벤트_콘텐츠' : 'section[section-group-id="MainEventSection"] div a',

}

iptv_el = {
    'direct' : '.menu >ul > li > div > a',
    'iptv' : '//button[contains(.,"IPTV")]',
    'iptv_url' : 'https://m.lguplus.com/internet-iptv',
    
    'KV_링크':'div[section-group-id="MoSubMainInternetIptvKVSection"] a',
    '테마배너':'div[section-group-id="MoSubMainInternetIptvThemeSection"]',
    '테마배너_링크':'div[section-group-id="MoSubMainInternetIptvThemeSection"] ul a',

    '추천이벤트_링크':'div[section-group-id="MoSubMainInternetIptvEventSection"] a',

    '추천 결합상품_carousel':'div[section-group-id="MoSubMainInternetIptvRecommendPlan"] div.c-wrap-plus-product',
    '추천 결합상품_상품정보':'div[section-group-id="MoSubMainInternetIptvRecommendPlan"] div.swiper-slide-active div.item span',
    '추천 결합상품_가입상담 신청':'div[section-group-id="MoSubMainInternetIptvRecommendPlan"] div.swiper-slide-active button[data-gtm-event-label*="가입상담"]',
    'apply_consult':'div.modal-content div.c-noticebox-2',

    '가입상담_신청_팝업':'header.modal-header',
    '가입상담_신청_팝업_data_col':'div.modal-content table>tbody>tr>th',
    '가입상담_신청_팝업_data_row':'div.modal-content table>tbody>tr>td',
    '가입상담_신청_팝업_닫기' : 'div.modal-content button.c-btn-close',

    '추천 결합상품_온라인가입':'div[section-group-id="MoSubMainInternetIptvRecommendPlan"] div.swiper-slide-active a[data-gtm-event-label*="온라인"]',
    '온라인가입_url':'/signup/package',
    '온라인가입_상품명' : 'div.product-info>div >strong',

    '혜택_콘텐츠':'div[section-group-id="MoSubMainInternetIptvBenefit1Section"]',
    '혜택_콘텐츠_링크':'div[section-group-id="MoSubMainInternetIptvBenefit1Section"] a',

}

mypage = {
    'mypage' : '//button[contains(.,"마이페이지")]',
    'direct' : '.menu >ul > li > div > a',
    'mypage_url' : 'https://m.lguplus.com/mypage',

    'dropdown':'button.c-btn-dropdown',
    'dropdown_list':'.modal-content div.c-radio-box-3 li.service-type',
    'dropdown_list_radio_btn':'div.modal-content input[type="radio"]',
    'dropdown_close':'footer>div>button',
    'dropdown_select_text':'button.c-btn-dropdown>strong',
    'dropdown_select_detail_text':'button.c-btn-dropdown>em',

    '서브메인_상단 데이터 사용량':'div.service-summary > ul > li:first-child > div',
    '서브메인_상단 청구 및 납부정보':'div.service-summary > ul > li:last-child > div',
    '서브메인_상단 데이터':'div.service-summary > ul > li > div span.txt',
    '주문정보':'//div[contains(.,"주문정보") and contains(@class,"c-section")]',
    '가입서비스':'//div[contains(.,"가입 서비스") and contains(@class,"c-section")]',
    '멤버십':'//div[contains(.,"멤버십") and contains(@class,"p-mypage-main-membership")]',

    'bill_direct': '//a[contains(.,"요금/납부")]',
    'bill_url':'https://m.lguplus.com/mypage/payinfo',

    '상단 청구정보':'div.c-section-sm',
    '상단 청구정보 데이터':'div.c-section-sm ul li p',
    '청구요금 및 납부 탭':'div.m-tabs a[role="tab"]',
    'panel_list':'div.tab-panel ul li',
    '더보기 버튼':"//div[contains(@class,'tab-panel')]//div[@class='c-btn-group']//button[contains(.,'더 보기')]",

    'use_direct' : '//a[contains(.,"사용내역 조회")]' , 
    'use_url' : 'https://m.lguplus.com/mypage/bilv',

    '사용현황_dropdown_list':'div.modal-content li.c-radio-box-3 span > label:nth-of-type(1)',    
    '사용현황_dropdown_select_text':'button.c-btn-dropdown>span',

    '실시간요금조회':'//ul[@role="tablist"]//a[contains(.,"실시간 요금 조회")]',
    'top_bill' : '//*[@class="p-mypage"]/div/div[1]/div/p[1]/em',
    '이동통신요금':'//*[@class="list-box-usedinfo"]/li/ul/li/p',
    'bottom_bill' : '//*[@class="list-box-usedinfo"]/li[3]/ul/li/p',
    '현재까지_사용한_요금':'div.c-section-md',
    '실시간이용요금_panel':'div.mypage-usedinfo div.c-section-xs',

    '월별사용량조회':'//ul[@role="tablist"]//a[contains(.,"월별사용량조회")]',
    '월별사용량조회_column':'table.table >thead',
    '월별사용량조회_월':'span.monthly > i',
    '월별사용량조회_뒤로가기':'button.c-btn-month-prev',
    '월별사용량상세조회':'div.c-section-md >div.c-btn-group >button',
    '월별사용량상세_탭':'div.modal-content ul[role="tablist"]',
    '월별사용량상세_월':'div.modal-content span.monthly',
    '월별사용량상세_확인':'div.modal-content div.c-btn-group>button',

    '통화상세내역':'ul[role="tablist"]>li:nth-of-type(3)',
    '통화상세내역_panel':'div.mypage-usedinfo-callhistory',
    '통화상세내역_조회':'div.c-btn-group >a',
    '통화상세내역_조회_팝업' : 'div.modal-content >div.modal-body',
    '통화상세내역_조회_팝업_확인' : 'div.modal-content div.c-btn-group>button.c-btn-solidbox-1',

    '기가인터넷사용량':'//ul[@role="tablist"]//a[contains(.,"기가인터넷사용량")]',
    '기가인터넷사용량_고객정보':'div.mypage-usedinfo >div.c-section-md:not(.use-amount)',

    'IPTV컨텐츠사용내역':'//ul[@role="tablist"]//a[contains(.,"IPTV컨텐츠사용내역")]',
    'iptv컨텐츠사용내역_고객정보':'div.used-info >div.c-section-md:nth-of-type(1)',
    'iptv컨텐츠사용내역_본인인증':'div.used-info >div.c-section-md:nth-of-type(2) div.component__inner',
    'iptv컨텐츠사용내역_본인인증_btns':'div.used-info >div.c-section-md:nth-of-type(2) div.component__inner label',

    '상단 고객 멤버십 정보':'div.submain-section.mypage-membership > div.c-section-md',
    '안내 문자메시지':'div.mypage-membership>div.c-section-md >button',
    '안내 문자메시지 팝업':'div.modal-content div.modal-body div.c-section-md',
    '안내 문자메시지 수신 여부':'div.modal-content div.modal-body div.c-section-md ul>li:nth-of-type(2)',
    '안내 문자메시지_radio':'div.modal-content div.modal-body input[type="radio"]',
    '안내 문자메시지_text':'div.modal-content div.modal-body label.text-radio>span',

    '월별 할인 혜택 이용정보':'div.tab-panel > div > div.c-section-md:nth-of-type(1)',

    '기간별 이용내역 조회':'div.tab-panel > div > div.c-section-md:nth-of-type(2)',
    '기간별 이용내역 조회 버튼':'div.tab-panel > div > div.c-section-md:nth-of-type(2) > div.c-btn-group a',
    '기간별 이용내역 조회 결과':'div[style=""]',

    '멤버십 변경내역 탭':'ul[role="tablist"] >li:nth-of-type(2)',
    '멤버십 등급 변경내역':'div.tab-panel div.c-section-md:nth-of-type(1)',
    '멤버십 카드 발급내역':'div.tab-panel div.c-section-md:nth-of-type(2)',
    '멤버십 카드 발급내역_자세히보기':'div.tab-panel  div.c-section-md:nth-of-type(2) >div>button',
    '멤버십 카드 발급내역_자세히보기_팝업':'div.modal-content div.c-section-md',
    '멤버십 카드 발급내역_자세히보기_팝업닫기':'div.modal-content footer>div>button',

}         

mobile_el = {
    'mobile' : '//button[contains(.,"모바일")]',
    'direct' : '.menu >ul > li > div > a',
    'url' : 'https://m.lguplus.com/mobile',    

    'KV_링크':'div[section-group-id="MoSubMainMobileKVSection"] a',

    '테마배너':'div[section-group-id="MoSubMainMobileThemeSection"]',
    '테마배너_링크':'div[section-group-id="MoSubMainMobileThemeSection"] li a',

    '이벤트':'div[section-group-id="MoSubMainMobileEventSection"]',
    '이벤트_title':'div[section-group-id="MoSubMainMobileEventSection"] div.section-title a',
    '이벤트_콘텐츠':'div[section-group-id="MoSubMainMobileEventSection"] div.swiper-slide a',

    '휴대폰_title':'div[section-group-id="MoSubMainMobileDeviceSection"] div.section-title a',
    '휴대폰_탭_링크':'div[section-group-id="MoSubMainMobileDeviceSection"] div.m-tabs a',
    '휴대폰_panel':'div[section-group-id="MoSubMainMobileDeviceSection"] div.tab-panel:not([style^="display"])',
    '휴대폰_panel_주문하기':'div[section-group-id="MoSubMainMobileDeviceSection"] div.tab-panel:not([style^="display"]) div.swiper-slide-active div.card-bottom button',
    '휴대폰_panel_상품명':'div[section-group-id="MoSubMainMobileDeviceSection"] div.tab-panel:not([style^="display"]) div.card-title p.big-title',

    '기기상품상세_title':'p.device-kv-wrap__info--title', 

    '추천 요금제':'section[section-group-id="MoSubMainMobileRecommendPlan"]',
    '추천 요금제_title':'section[section-group-id="MoSubMainMobileRecommendPlan"] header.title a',
    '추천 요금제_panel':'section[section-group-id="MoSubMainMobileRecommendPlan"] div.slide-wrap',
    '추천 요금제_링크':'section[section-group-id="MoSubMainMobileRecommendPlan"] div.slide-wrap a',

    '휴대폰결합상품':'div[section-group-id="MoSubMainMobileCombinedSection"]',
    '가입상담 신청 버튼':'div[section-group-id="MoSubMainMobileCombinedSection"] a[data-gtm-event-label*="가입상담"]',
    'select':'div[section-group-id="MoSubMainMobileCombinedSection"] div.combine-prod-list select',
    '휴대폰 결합 계산 결과값':'div[section-group-id="MoSubMainMobileCombinedSection"] div.each-price-area span',
    '할인_정보' : '.calculatorBox dl',
    '가입상담_창닫기' : 'button.close',

    '태블릿':'div[section-group-id="MoSubMainMobile2ndDeviceSection"]',
    '태블릿_title':'div[section-group-id="MoSubMainMobile2ndDeviceSection"] div.section-title a',
    '모바일기기_태블릿_url':'https://m.lguplus.com/mobile/device/smart-device',
    '태블릿_탭_링크':'div[section-group-id="MoSubMainMobile2ndDeviceSection"] ul[role="tablist"] a',
    '태블릿_panel':'div[section-group-id="MoSubMainMobile2ndDeviceSection"] div.tab-panel:not([style^="display"])',
    '태블릿_panel_주문하기':'div[section-group-id="MoSubMainMobile2ndDeviceSection"] div.tab-panel:not([style^="display"]) div.swiper-slide-active div.card-bottom button',
    '태블릿_panel_상품명':'div[section-group-id="MoSubMainMobile2ndDeviceSection"] div.tab-panel:not([style^="display"]) div.card-title p.big-title',

    '하위메뉴':'div[section-group-id="MoSubMainMobileBottomMenuSection"]',
    '하위메뉴_탭_링크':'div[section-group-id="MoSubMainMobileBottomMenuSection"] div.m-tabs a',
    '하위메뉴_panel_콘텐츠':'div[section-group-id="MoSubMainMobileBottomMenuSection"] div.tab-panel:not([style^="display"]) div.info-txt img',

    '구매후기':'div[section-group-id="MoSubMainMobileReviewSection"]',
    '구매후기_tab_list':'div[section-group-id="MoSubMainMobileReviewSection"] div.m-tabs a',
    '구매후기_콘텐츠':'div[section-group-id="MoSubMainMobileReviewSection"] div.tab-panel:not([style^="display"]) a',

    '모바일요금제_5g':'a[data-gtm-click-text*="모바일 요금제|5G"]',
    '사용중인_요금제_정보':'div.tab-panel div.accordion:nth-of-type(1) ',
    '사용중인_요금제_정보_btn':'div.tab-panel div.accordion:nth-of-type(1) div[role="button"]',

    '5g_tab':'ul[role="tablist"] a[data-gtm-click-text*="5G"]',
    'lte_tab':'ul[role="tablist"] a[data-gtm-click-text*="LTE"]',
    '태블릿/스마트워치_tab':'ul[role="tablist"] a[data-gtm-click-text*="태블릿"]',
    '듀얼넘버_tab':'ul[role="tablist"] a[data-gtm-click-text*="듀얼넘버"]',

    '5g_url':'https://m.lguplus.com/mobile/plan/mplan/5g-all',
    'lte_url':'https://m.lguplus.com/mobile/plan/mplan/lte-all',
    '태블릿/스마트워치_url':'https://m.lguplus.com/mobile/plan/mplan/2nd-device',
    '듀얼넘버_url':'https://m.lguplus.com/mobile/plan/mplan/dual',

    '사용중인_요금제명':'p.c-acc-price em',
    '요금제_비교하기':'button[data-gtm-click-text*="비교하기"]',
    '요금제_list_요금제명':'p.tit1',
    '요금제_list_가격':'p.txt_price1',
    '요금제_list_할인가격':'div.txt_price2 span:not(.blind)',
    '이용중_요금제_팝업_확인' : 'div.modal-content button.c-btn-solid-1',

    '요금제비교함' : 'div.plan_inner_pad1',
    '요금제비교함_요금제명' : 'div.cont:last-child',
    '요금제비교함_가격' : 'div.plan_inner_pad1>ul:nth-of-type(1) li:last-child',
    '요금제비교함_할인가격' : 'div.plan_inner_pad1>ul:nth-of-type(2) li:last-child',
    '요금제비교함_드롭다운' : 'div.cont button:not([disabled])',
    '요금제비교함_드롭다운_list' : 'div.modal-content ul.plan-select-pop li input',
    '요금제비교함_추가하기_버튼' : '.modal-footer .c-btn-solid-1-m',

    '요금제_변경하기':'button[data-gtm-click-text*="변경하기"]',
    '혜택_선택_list' : '.c-card-radio-1',
    '다음_버튼' : '.modal-footer button',
    '요금제조회변경_url':'https://m.lguplus.com/mypage/price-plan/new-mobile',
    '요금제_변경_data' : 'tbody tr td:last-child',

    '메인_장바구니_버튼' : '.header-utill button:nth-child(2)',
    'mobile_device_phone' : '.dep2li:nth-of-type(1) ul li:nth-of-type(1)',
    'phone_url' : 'https://m.lguplus.com/mobile/device/phone',
    # 'phone_name' : '.card-title h3',
    # 'phone_plan' : '.info-wrap .shorten',
    # 'phone_price' : '.info-wrap .total',
    'phone_name' : 'p.device-kv-wrap__info--title',
    'phone_plan' : 'div:not([aria-hidden="false"]) input[data-gtm-event-label*="유쓰 5G 슬림+"]',
    'phone_price' : 'div.simcard-fixed-box p.price',
    'cart_btn' : '.card-bottom .btn-wrap:nth-child(1) button',
    '장바구니_바로가기_버튼' : '.toast-body .c-link-arr-1-s:nth-of-type(1)',
    '장바구니_url' : 'https://m.lguplus.com/cart',
    '장바구니_기기명' : '.c-card-cart .prod-title',
    '장바구니_요금제명' : '.c-card-cart .prod-detail:nth-of-type(2)',
    '장바구니_가격' : '.c-card-cart .prod-price strong',
    '장바구니_용량' : '.c-card-cart .c-list-option li:nth-of-type(2)',
    '장바구니_삭제_버튼' : '.c-card-cart .cart-box button.c-btn-del',
    '삭제_확인_버튼' : '.c-btn-outline-1-m',

    '모바일기기_휴대폰_url' : 'https://m.lguplus.com/mobile/device/phone',
    '상품상세_title':'p.device-kv-wrap__info--title', 
    '모바일요금제_요금제_url':'https://m.lguplus.com/mobile/plan/mplan/5g-all',
    '요금제상품상세_title':'p.h1',
    '요금제상품상세_price':'p.amount-pay',

}

benefit_el = {
    'benefit' : '//button[contains(.,"혜택/멤버십")]',
    'direct' : '.menu >ul > li > div > a',
    'url' : 'https://m.lguplus.com/benefit',
    'membership_url':'https://m.lguplus.com/benefit/membership',
    
    'KV_링크' : 'div[section-group-id="MoSubMainBenefitKVSection"] a',

    '테마배너':'div[section-group-id="MoSubMainBenefitThemeSection"]',
    '테마배너_링크':'div[section-group-id="MoSubMainBenefitThemeSection"] li a',

    '제휴사 혜택_title':'div[section-group-id="MoSubMainBenefitAffiliateSection"] div.section-title a',
    '멤버십 혜택_url':'https://m.lguplus.com/benefit-membership',
    '제휴사 혜택_탭_링크':'div[section-group-id="MoSubMainBenefitAffiliateSection"] div.m-tabs a',
    '제휴사 혜택_panel_링크':'div[section-group-id="MoSubMainBenefitAffiliateSection"] div.tab-panel a',
    '제휴사 혜택_전체보기':'div[section-group-id="MoSubMainBenefitAffiliateSection"] div.c-btn-group a',

    '온라인 가입 혜택_title':'div[section-group-id="MoSubMainBenefitOnlineOnlySection"] div.section-title a',
    '온라인 가입 혜택_콘텐츠_링크':'div[section-group-id="MoSubMainBenefitOnlineOnlySection"] div.m-swiper a',
    '온라인 가입 혜택_url':'https://m.lguplus.com/benefit-uplus/online-purchase-benefit/ORN0030748',

    '이벤트_title':'div[section-group-id="MoSubMainBenefitEventSection"] div.section-title a',
    '진행 중인 이벤트_url':'https://m.lguplus.com/benefit-event/ongoing',
    '이벤트_콘텐츠_링크':'div[section-group-id="MoSubMainBenefitEventSection"] ul a',

    'membership_direct' :'//a[contains(.,"멤버십 이용")]',

    'benefit_uth' : '//a[contains(.,"유쓰 혜택")]',

}

support_el = {
    'support' : '//button[contains(.,"고객지원")]',
    'direct' : '.menu >ul > li > div > a',
    'url':'https://m.lguplus.com/support',

    'kv_list':'div.visual-img img',
    '자주찾는검색어_section':'div.section-wide.bg-gray8',
    '자주찾는검색창':'div.section-wide input[placeholder="자주 찾는 검색어"]',
    '고객지원_검색버튼' : 'button.c-btn-find-1',
    '자주찾는검색어_list':'div.section-wide div.support-main-search-tag a',

    '키워드로찾기_탭':'div.tabs>ul[role="tablist"]>li:nth-of-type(1)>a',
    '키워드로찾기_검색결과_키워드':'span.cl-def',
    '키워드로찾기_검색창' : 'input#addr-1-1',
    '키워드로찾기_검색결과_list':'div.accordion.c-accordion>div>div[role="button"]',
    '검색결과' : 'div.collapse.show',

    '해시_검색어' : 'div.tag-item-type2 >a',
    
    '도움이 될 내용':'div.submain-section > div.c-section-xs > div.section-wide.login-after',
    '도움이 될 내용_list':'div.submain-section > div.c-section-xs > div.section-wide.login-after ul a',

    '스스로 해결 가이드':'div.submain-section > div.c-section-xs > div.c-section-md',
    '스스로 해결 가이드_title':'div.submain-section > div.c-section-xs > div.c-section-md > p',
    '스스로 해결 가이드_list':'div.submain-section > div.c-section-xs > div.c-section-md div.swiper-wrapper a',

    '하단 탭':'div.submain-section > div.c-section-md',
    '하단 탭_list' : 'div.submain-section > div.c-section-md > ul>li a',

    '이용 기이드_url':'https://m.lguplus.com/support/service/use-guide',
    '1:1 문의하기_url':'https://m.lguplus.com/support/online/inquiry',
    '고객센터_url':'https://m.lguplus.com/support/service/ars',

    '이용 기이드':'div.section-support-guide',
    '1:1 문의하기':'div.c-board-card-feedback-list-index',
    '고객센터':'button.collapsed',

    '비로그인_도움이 될 내용' : 'div.submain-section > div.c-section-xs > div.section-wide:not(.bg-gray8,[style="display: none;"])',

}

direct_el = {
    'direct' : '//button[contains(.,"다이렉트")]',
    'url':'https://m.lguplus.com/direct',

    'kv_list':'div.direct-kv img',

    'con_01':'div.direct-usim',

    'con_02':"div[moduleid='PlanCombineCarousel03']",
    'con_02_title':"div[moduleid='PlanCombineCarousel03'] p.plan-name",
    'con_02_price':"div[moduleid='PlanCombineCarousel03'] p.plan-price",
    'con_02_가입하기':"div[moduleid='PlanCombineCarousel03'] a[data-gtm-event-name='link_click']",

    '전용요금제_가입하기_url':'https://m.lguplus.com/mobile/usim-detail',
    
    'con_03':'div.direct-benefit-info',
    'con_03_li':'div.direct-benefit-info ul li',

    'con_04':'div.direct-review',
    'con_04_li':'div.direct-review ul li',

    'con_05':'div[moduleid="BannerImageCarousel05"]',
    'con_05_li':'div[moduleid="BannerImageCarousel05"] ul li',

    'con_06':'div[moduleid="BannerImageList01"]',
    'con_06_li':'div[moduleid="BannerImageList01"] ul li',
    
}

uth_el = {
    'url' : 'https://m.lguplus.com/uth',

    '유쓰_전체영역' : '.l-indv',
    '유쓰전용_통신혜택' : 'ul.uth_list_02',
    '유쓰전용_통신혜택_컨텐츠' : 'ul.uth_list_02 li',

    'ujam' : 'a[data-gtm-click-text="혜택/멤버십|서비스+|유잼"]',
    'ujam_url' : 'https://m.lguplus.com/ujam',
    'ujam_con' : '.contents-wrap',

#-#-#-#-#-#-#-#-#-#-#-# 주석 처리 된 것 #-#-#-#-#-#-#-#-#-#-#-#

    # 'event_modal':'div.event_modal',
    # 'event_modal_btn':'div.event_modal div.layerBtnBox button:last-child',

    # '혜택1':'//div[@class="uth_list_01_1"][1]',
    # '혜택1_list':'//div[@class="uth_list_01_1"][1]//a',

    # '혜택2':'//div[@class="uth_list_01"][1]',
    # '혜택2_list':'//div[@class="uth_list_01"][1]//a',
    
    # '유쓰혜택':'ul.uth_list_02',
    # '유쓰혜택_list':'ul.uth_list_02 a',

}

udoc_el = {
    'start' : '//button[contains(.,"유독")]',
    'url' : 'https://m.lguplus.com/pogg/main',

#-#-#-#-#-#-#-#-#-#-#-# 주석 처리 된 것 #-#-#-#-#-#-#-#-#-#-#-#

    # 'btn' : '.c-btn-menu.hago',
    # 'event' : '//*[@class="side-mn-list"]/ul/li[3]/a',
    # 'event_url' : 'https://m.lguplus.com/pogg/evet',
   
}

search_el = {
    'search_btn' : '.header-utill button.c-btn-search',
    '검색창_input' : 'div.c-inpform.is-clear div.c-inpitem input',
    '검색어해시태그' : 'div.c-tag-wrap a',
    '검색결과_검색창' : '.c-inpform.is-clear div.c-inpitem .c-inp',
    '입력한문자삭제_btn':'div.modal-content button[title="입력한 문자 삭제"]',
    '검색결과_url' : 'https://m.lguplus.com/search/result',
    
}