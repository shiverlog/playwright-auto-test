class LoginPage():
    # U+ 로그인
    def u_plus_login(self):
        self.FC.gotoHome()
        uplus_id = os.environ['UPLUS_ID']
        uplus_pw = os.environ['UPLUS_PW']

        # 햄버거 메뉴로 진입
        if self.driver.current_url != self.FC.var['login_el']['url']:
            self.FC.movepage(var.login_el['login_btn'],address=self.FC.var['login_el']['url'])
            self.FC.is_exists_element_click(self.FC.loading_find_css(self.FC.var['login_el']['ID로그인_btn'])) # 간편 로그인 화면 처리
            self.FC.is_exists_element_click(self.FC.loading_find_css(self.FC.var['login_el']['uplus_login_img']))

            self.FC.modal_ck2() # 결함 DCBGQA-4368
            self.FC.is_exists_element_click(self.FC.loading_find_css(self.FC.var['login_el']['uplus_입력한문자삭제']))

            self.FC.loading_find_css(self.FC.var['login_el']['uplus_id_input']).send_keys(uplus_id)   # ID 입력
            self.FC.is_exists_element_click(self.FC.loading_find_css('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button'))

            
            if self.FC.loading_find_css('.c-tooltip') == False:
                self.FC.loading_find_css(self.FC.var['login_el']['uplus_pw_input']).send_keys(uplus_pw)   # PW 입력
                self.FC.loading_find_css(self.FC.var['login_el']['uplus_login_btn']).re_click()  # 로그인 버튼 선택
            else:
                self.FC.is_exists_element_click(self.FC.loading_find_css('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button'))
        
            raise Exception('로그인 실패 : tooltip 안사라짐')
            self.FC.wait_loading()

            # 유플러스 로그인 후 정상적으로 메인페이지로 이동했는지 확인
            assert var.common_el['url'] in self.FC.loading_find_css(var.mainpage_el['개인화']).get_property('baseURI'), self.DBG.logger.debug("u+ID 로그인 후 메인페이지 이동 실패")

    def u_plus_login_retry(self,count):

        res = self.u_plus_login()
        if res:
            self.DBG.print_dbg("u+ ID 로그인 정상 동작 확인")
            return True
        else:
            count-=1
            if count <= 0:
                self.DBG.print_dbg("u+ ID 로그인 정상 동작 확인",False)
                return False
            else:
                Slack.send_slack_text(log=f"u+ ID 로그인 {count}회 재실행중...",test_result=None)

        # 로그아웃
    def logout(self):
        self.FC.gotoHome()
        
        self.FC.loading_find_css('.c-btn-menu').re_click()
        self.FC.wait_loading()
        count=1
        max_count=5
        while True:
            if self.FC.var['common_el']['gnb_url'] in self.driver.current_url or count>max_count:
                break
            self.FC.loading_find_css_pre(self.FC.var['common_el']['메인_메뉴']).re_click()
            self.FC.loading_find_css_pre(self.FC.var['login_el']['로그인 여부'])
            count+=1
        self.FC.loading_find_css_pre(var.login_el['logout_btn']).re_click()
        self.FC.wait_loading()
        assert self.FC.loading_find_css_pre(var.mainpage_el['KV']).get_property('baseURI') in self.FC.var['common_el']['url'], self.DBG.logger.debug("로그아웃 후 메인페이지 이동 실패")

        assert self.FC.is_login()==False , self.DBG.logger.debug("정상 로그아웃 실패")
        self.driver.back()

    def do_login(self, login_type:str):
        '''
        U+ID, 카카오, 네이버 로그인
        '''
        self.FC.gotoHome()
        
        if self.driver.current_url != self.FC.var['login_el']['url']:
            self.FC.movepage(self.FC.var['login_el']['login_btn'],address=self.FC.var['login_el']['url'])

        self.FC.is_exists_element_click(self.FC.loading_find_css(self.FC.var['login_el']['ID로그인_btn'])) # 간편 로그인 화면 처리
        self.FC.is_exists_element_click(self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_login_img']))
        self.FC.wait_loading()
        self.FC.modal_ck2() # 결함 DCBGQA-4368

        dict = {
            "uplus" : [os.environ['UPLUS_ID'], os.environ['UPLUS_PW']],
            "kakao" : [],
            "naver" : [],
        }

        self.FC.is_exists_element_click(self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_입력한문자삭제']))
        # self.FC.is_exists_element_click(self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_id_저장']))
        self.FC.wait_loading()

        self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_id_input']).send_keys(dict[login_type][0])

        if login_type == "uplus":
            self.FC.is_exists_element_click(self.FC.loading_find_css('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button'))
            for _ in range(3):
                try:
                    if self.FC.loading_find_css('.c-tooltip') == False:
                        self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_pw_input']).send_keys(dict[login_type][1])
                        break
                    else:
                        self.FC.is_exists_element_click(self.FC.loading_find_css('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button'))

                except:
                    raise Exception('로그인 실패 : tooltip 처리 실패')

        else:
            self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_pw_input']).send_keys(dict[login_type][1])

        self.FC.click_until_go_page(self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_login_btn']))

        # # # 유플러스 로그인 후 정상적으로 메인페이지로 이동했는지 확인
        assert self.FC.var['common_el']['url'] in self.FC.loading_find_css(self.FC.var['mainpage_el']['개인화']).get_property('baseURI'), self.DBG.logger.debug("u+ ID 로그인 후 메인페이지 이동 실패")
