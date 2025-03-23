   return True


    def u_plus_login_retry(self,count,login_type):
        while 0 < count:
            # res = self.u_plus_login()
            res = self.do_login(login_type)
            if res:
                # self.DBG.print_dbg("u+ ID 로그인 정상 동작 확인")
                return True
            else:
                count-=1
                if count <= 0:
                    self.DBG.print_dbg(f"{login_type} 로그인 정상 동작 확인", False)
                    return False
                else:
                    Slack.send_slack_text(log=f"{login_type} 로그인 {count}회 재실행중...", test_result = None)
                    self.driver.refresh()
                    pass


    # 로그아웃
    def logout(self):
        self.fc.gotoHome()
        try:
            #  FIXME 다른 UI가 로그아웃 버튼을 가려서 클릭이 불가능. excute_script로 클릭
            self.fc.movepage(self.fc.var['login_el']['logout_btn'])      # 로그아웃 버튼 선택
            self.fc.wait_loading()
            assert self.fc.var['common_el']['url'] in self.fc.loading_find_css(self.fc.var['mainpage_el']['KV']).get_property('baseURI'), self.DBG.logger.debug("로그아웃 후 메인페이지 이동 실패")

            self.fc.loading_find_css(self.fc.var['common_el']['메인_메뉴']).click()
            assert "로그인" in self.fc.loading_find_css(self.fc.var['login_el']['login_btn']).get_property('innerText') , self.DBG.logger.debug("정상 로그아웃 실패")

        except  Exception as e :
            self.DBG.print_dbg(e, f"로그아웃 정상 동작 확인", False)
            return False

        else :
            self.DBG.print_dbg("로그아웃 정상 동작 확인")
            return True


    def do_login(self, login_type:str):
        '''
        U+ID, 카카오, 네이버 로그인
        '''
        self.fc.gotoHome()
        try:
            if self.driver.current_url != self.fc.var['login_el']['url']:
                self.fc.movepage(self.fc.var['login_el']['login_btn'],address=self.fc.var['login_el']['url'])

            self.fc.is_exists_element_click(self.fc.loading_find_css(self.fc.var['login_el']['ID로그인_btn'])) # 간편 로그인 화면 처리
            self.fc.is_exists_element_click(self.fc.loading_find_css(self.fc.var['login_el'][f'{login_type}_login_img']))
            self.fc.wait_loading()
            self.fc.modal_ck2() # 결함 DCBGQA-4368

            dict = {
                "uplus" : [os.environ['UPLUS_ID'], os.environ['UPLUS_PW']],
                "kakao" : [],
                "naver" : [],
            }

            self.fc.is_exists_element_click(self.fc.loading_find_css(self.fc.var['login_el'][f'{login_type}_입력한문자삭제']))
            # self.fc.is_exists_element_click(self.fc.loading_find_css(self.fc.var['login_el'][f'{login_type}_id_저장']))
            self.fc.wait_loading()

            self.fc.loading_find_css(self.fc.var['login_el'][f'{login_type}_id_input']).send_keys(dict[login_type][0])

            if login_type == "uplus":
                self.fc.is_exists_element_click(self.fc.loading_find_css('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button'))
                for _ in range(3):
                    try:
                        if self.fc.loading_find_css('.c-tooltip') == False:
                            self.fc.loading_find_css(self.fc.var['login_el'][f'{login_type}_pw_input']).send_keys(dict[login_type][1])
                            break
                        else:
                            self.fc.is_exists_element_click(self.fc.loading_find_css('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button'))

                    except:
                        raise Exception('로그인 실패 : tooltip 처리 실패')

            else:
                self.fc.loading_find_css(self.fc.var['login_el'][f'{login_type}_pw_input']).send_keys(dict[login_type][1])

            self.fc.again_click(self.fc.loading_find_css(self.fc.var['login_el'][f'{login_type}_login_btn']))

            # # # 유플러스 로그인 후 정상적으로 메인페이지로 이동했는지 확인
            assert self.fc.loading_find_css(self.fc.var['mainpage_el']['KV']).get_property('baseURI') == self.fc.var['common_el']['url'], self.DBG.logger.debug("u+ ID 로그인 후 메인페이지 이동 실패")


        except Exception as e:
            self.DBG.print_dbg(f"{login_type} 로그인 정상 동작",False)
            return False

        else :
            self.DBG.print_dbg(f"{login_type} 로그인 정상 동작")
            return True

