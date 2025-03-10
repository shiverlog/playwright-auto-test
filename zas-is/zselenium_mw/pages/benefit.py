class BenefitPage():
    def __init__(self,WebDriver:WebDriver,FC:Function):
        self.FC=FC
        self.DBG=Debug(WebDriver)

    def benefit(self):
        self.FC.gotoHome()
        try:
            self.FC.movepage(self.FC.var['benefit_el']['benefit'], self.FC.var['benefit_el']['direct'],address = self.FC.var['benefit_el']['url'])

            # KV 콘텐츠 노출 확인
            kv_list=self.FC.loading_find_csss(self.FC.var['benefit_el']['KV_링크'])
            assert len(kv_list) > 0, self.DBG.logger.debug("혜택/멤버십 > 서브메인 > KV 정상 출력 실패")

            # 서브메인 테마배너
            check_text_list=['멤버십','이벤트','장기고객 혜택','결합할인 혜택','선택약정 할인']
            assert self.FC.text_list_in_element(self.FC.var['benefit_el']['테마배너'],check_text_list),self.DBG.logger.debug("혜택/멤버십 > 서브메인 > 테마베너 정상 출력 실패")
            theme_list_link=self.FC.loading_find_csss(self.FC.var['benefit_el']['테마배너_링크'])
            random_num= random.randrange(0,len(theme_list_link))
            check_link=theme_list_link[random_num].get_attribute('href')
            check_link=check_link[check_link.rfind('/'):]
            tab_name= theme_list_link[random_num].get_attribute('data-gtm-click-text')
            self.FC.move_to_click(theme_list_link[random_num])
            assert check_link in self.FC.driver.current_url,self.DBG.logger.debug(f"혜택/멤버십 > 서브메인 > 테마베너 > {tab_name}탭 정상 동작 실패")
            self.FC.goto_url(self.FC.var['benefit_el']['url'])

            # 제휴사 혜택
            self.FC.move_to_click(self.FC.loading_find_css_pre(self.FC.var['benefit_el']['제휴사 혜택_title']))
            assert self.FC.var['benefit_el']['멤버십 혜택_url'] in self.FC.driver.current_url,self.DBG.logger.debug(f"혜택/멤버십 > 서브메인 > 제휴사 혜택 타이틀 링크 정상 이동 실패")
            self.FC.goto_url(self.FC.var['benefit_el']['url'])
            result=[]
            tab_list=['APP/기기','엑티비티','뷰티/건강','쇼핑','생활/편의','푸드','문화/여가','교육','여행/교통']
            for current in tab_list:
                tab_list_el=self.FC.loading_find_csss(self.FC.var['benefit_el']['제휴사 혜택_탭_링크'])
                num=tab_list.index(current)
                self.FC.move_to_click(tab_list_el[num])
                text = tab_list_el[num].get_property('innerText')
                result.append(current in text)
                result.append(len(self.FC.loading_find_csss(self.FC.var['benefit_el']['제휴사 혜택_panel_링크']))>0)

            # 전체보기 링크 이동
            self.FC.loading_find_css(self.FC.var['benefit_el']['제휴사 혜택_전체보기']).click()
            self.FC.wait_loading()
            result.append(self.FC.var['benefit_el']['멤버십 혜택_url'] in self.FC.driver.current_url)
            self.FC.goto_url(self.FC.var['benefit_el']['url'])

            assert self.DBG.print_res(result), self.DBG.logger.debug("혜택/멤버십 > 서브메인 > 제휴사 혜택 정상 노출 확인 실패")

            # 온라인 가입하고 할인 헤택 영역 콘텐츠 노출 확인
            result.clear()
            self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['benefit_el']['온라인 가입 혜택_title']), True)
            assert self.FC.var['benefit_el']['온라인 가입 혜택_url'] in self.FC.driver.current_url,self.DBG.logger.debug("혜택/멤버십 > 서브메인 > 온라인 가입 혜택 타이틀 링크 정상 이동 실패")
            self.FC.goto_url(self.FC.var['benefit_el']['url'])
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['benefit_el']['온라인 가입 혜택_title']))
            assert len(self.FC.loading_find_csss(self.FC.var['benefit_el']['온라인 가입 혜택_콘텐츠_링크'])) > 0,self.DBG.logger.debug("혜택/멤버십 > 서브메인 > 온라인 가입 혜택 콘텐츠 정상 출력 실패")

            self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['benefit_el']['이벤트_title']))
            assert self.FC.var['benefit_el']['진행 중인 이벤트_url'] in self.FC.driver.current_url,self.DBG.logger.debug("혜택/멤버십 > 서브메인 > 이벤트 타이틀 링크 정상 이동 실패")
            self.FC.goto_url(self.FC.var['benefit_el']['url'])
            self.FC.move_to_element(self.FC.loading_find_css(self.FC.var['benefit_el']['이벤트_title']))
            assert len(self.FC.loading_find_csss(self.FC.var['benefit_el']['이벤트_콘텐츠_링크'])),self.DBG.logger.debug("혜택/멤버십 > 서브메인 > 이벤트 콘텐츠 정상 노출 실패")

        except  Exception :
            self.DBG.print_dbg("혜택/멤버십 페이지 정상 노출 및 기능 동작 확인",False)
            return False

        else :
            self.DBG.print_dbg("혜택/멤버십 페이지 정상 노출 및 기능 동작 확인")
            return True

    # 혜택/멤버십 > 멤버십 > 멤버십 이용내역
    def membership(self):
        self.FC.gotoHome()
        try:
            self.FC.movepage(self.FC.var['benefit_el']['benefit'],self.FC.var['benefit_el']['membership_direct'],address=self.FC.var['benefit_el']['membership_url'])
            self.FC.wait_loading()
            self.FC.modal_ck_ins()

            # TODO 휴대폰 번호 선택 기능 확인은 해당 정보가 있는 계정 필요
            # ...

            text_list_result=[]

            ## 혜택/멤버십 > 멤버십 > 상단 고객 멤버십 정보
            text_list=['멤버십 카드 신청 및 재발급','이번 달 나의 등급' ,'올해 누적 할인']
            assert self.FC.text_list_in_element(self.FC.var['mypage']['상단 고객 멤버십 정보'],text_list),self.DBG.logger.debug(f"혜택/멤버십 > 멤버십 > 상단 고객 멤버십 정보 컨텐츠 정상 노출 확인 실패")

            ## 혜택/멤버십 > 멤버십 > 안내 문자메시지 수신 설정
            self.FC.loading_find_css(self.FC.var['mypage']['안내 문자메시지']).click()
            self.FC.wait_loading()
            text_list=['현재 설정 정보','휴대폰번호','문자메시지 수신 여부','문자메시지 수신 설정 변경']
            text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['안내 문자메시지 팝업'],text_list))
            # 안내메시지 수신 default가 정상인지 확인(문자세시지 수신 여부 == 문자메시지 수신 설정)
            is_receive_text=self.FC.loading_find_css_pre(self.FC.var['mypage']['안내 문자메시지 수신 여부']).get_property('innerText')
            is_receive_text=str(is_receive_text.split('\n')[-1])

            time.sleep(3)
            radio_btn=self.FC.loading_find_csss(self.FC.var['mypage']['안내 문자메시지_radio'])
            radio_btn_text_list=self.FC.loading_find_csss(self.FC.var['mypage']['안내 문자메시지_text'])
            for btn in radio_btn:
                if btn.get_property('checked') == True:
                    index=radio_btn.index(btn)
                else:
                    pass
            text_list_result.append(radio_btn_text_list[index].get_property('innerText') == is_receive_text)
            assert all(text_list_result), self.DBG.logger.debug(f"혜택/멤버십 > 멤버십 > 안내 문자메시지 수신 정상 노출 실패")
            self.FC.is_exists_element_click(self.FC.loading_find_css_pre(self.FC.var['common_el']['popup_close']))

            # 멤버십 이용내역 콘텐츠 정상 출력 확인
            ##  혜택/멤버십 > 멤버십 > 월별 할인 혜택 이용정보
            self.FC.move_to_element(self.FC.loading_find_css(self.FC.var['mypage']['월별 할인 혜택 이용정보']))
            text_list=['월별 할인 혜택 이용정보','연월','멤버십등급','할인 혜택','올해 누적할인']
            assert self.FC.text_list_in_element(self.FC.var['mypage']['월별 할인 혜택 이용정보'],text_list),self.DBG.logger.debug(f"혜택/멤버십 > 멤버십 > 서브메인 > 월별 할인 혜택 이용정보 컨텐츠 정상 노출 확인 실패")

            ## 혜택/멤버십 > 멤버십 > 기간별 이용내역 조회
            # 기간별 이용내역 조회
            self.FC.move_to_element(self.FC.loading_find_css(self.FC.var['mypage']['기간별 이용내역 조회']))
            text_list=['기간별 이용내역 조회','조회기간','1주일','1개월','3개월','기간설정','조회']
            assert self.FC.text_list_in_element(self.FC.var['mypage']['기간별 이용내역 조회'],text_list),self.DBG.logger.debug(f"혜택/멤버십 > 멤버십 > 서브메인 > 기간별 이용내역 조회 콘텐츠 정상 노출 확인 실패")

            ## 혜택/멤버십 > 멤버십 > 기간별 이용내역 조회 > 조회 기능
            self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['mypage']['기간별 이용내역 조회 버튼']))
            self.FC.loading_find_css(self.FC.var['mypage']['기간별 이용내역 조회 결과'])
            text_list=['누적 할인혜택','총','기간별 이용내역 조회 결과','사용일','사용처','누적 할인 혜택','한도','승인']
            assert self.FC.text_list_in_element(self.FC.var['mypage']['기간별 이용내역 조회 결과'],text_list), self.DBG.logger.debug(f"혜택/멤버십 > 멤버십 > 서브메인 > 기간별 이용내역 조회 액션 정상 동작 실패")


            # TODO 인터넷 데이터 부족으로 스크립트 작성 불가
            # ...

            ## 혜택/멤버십 > 멤버십 > 멤버십 변경내역 > 멤버십 등급 변경내역
            text_list_result.clear()
            # 멤버십 등급 변경내역 콘텐츠 정상 출력 확인
            while True:
                self.FC.move_to_click(self.FC.loading_find_css_pre(self.FC.var['mypage']['멤버십 변경내역 탭']).get_property('children')[0])
                if 'is-active' in self.FC.loading_find_css(self.FC.var['mypage']['멤버십 변경내역 탭']).get_property('className'):
                    break

            # 콘텐츠
            text_list=['멤버십 등급 변경내역','변경일','멤버십 등급','이용 요금제','등급산정기준']
            text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['멤버십 등급 변경내역'],text_list))
            assert all(text_list_result), self.DBG.logger.debug(f"혜택/멤버십 > 멤버십 > 멤버십 변경내역 탭 > 멤버십 등급 변경내역 기능 및 컨텐츠 정상 노출 확인 실패")

            ## 혜택/멤버십 > 멤버십 > 멤버십 변경내역 > 멤버십카드 발급내역
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mypage']['멤버십 카드 발급내역']))
            # 콘텐츠
            text_list=['신청일','멤버십 카드번호','발급일','상태']
            text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['멤버십 카드 발급내역'],text_list))

            # 자세히보기 버튼 기능
            self.FC.scroll_el(self.FC.loading_find_css_pre(self.FC.var['mypage']['멤버십 카드 발급내역']),'false')
            self.FC.loading_find_css(self.FC.var['mypage']['멤버십 카드 발급내역_자세히보기']).click()
            text_list=['신청일','멤버십 카드번호','휴대폰 번호','발급일','사용 중지일','상태']

            text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['멤버십 카드 발급내역_자세히보기_팝업'],text_list))
            assert all(text_list_result), self.DBG.logger.debug(f"혜택/멤버십 > 멤버십 > 멤버십 변경내역 탭 > 멤버십카드 발급내역 기능 및 컨텐츠 정상 노출 확인 실패")

            self.FC.is_exists_element_click(self.FC.loading_find_css(self.FC.var['mypage']['멤버십 카드 발급내역_자세히보기_팝업닫기']))

        except  Exception :
            self.DBG.print_dbg("혜택/멤버십 > 멤버십 > 로그인 된 유저의 멤버십 정보 및 이용 내역 정상 동작 확인",False)
            return False

        else :
            self.DBG.print_dbg("혜택/멤버십 > 멤버십 > 로그인 된 유저의 멤버십 정보 및 이용 내역 정상 동작 확인")
            return True
