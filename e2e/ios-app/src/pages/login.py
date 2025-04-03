class LoginPage():
    # U+ 로그인
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
