# 로그인
def do_login(self, login_type:str):

    user_icon=self.FC.loading_find_css(self.FC.var['login_el']['user_icon'])
    self.FC.move_to_element(user_icon)
    user_icon_login=self.FC.loading_find_css_pre(self.FC.var['login_el']['user_icon_login'])
    self.FC.move_to_click(user_icon_login)

    if self.FC.driver.current_url in self.FC.var['common_el']['url']:

        self.FC.loading_find_css_pre(self.FC.var['login_el'][f'{login_type}_login_img']).get_property('parentElement').click()

        self.FC.is_exists_element_click(self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_입력한문자삭제']))
        self.FC.is_exists_element_click(self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_id_저장']))

        self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_id_input']).send_keys(dict[login_type][0])


        self.FC.is_exists_element_click(self.FC.loading_find_css('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button'))
        for _ in range(3):
            try:
                if self.FC.loading_find_css('.c-tooltip') is False:
                    self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_pw_input']).send_keys(dict[login_type][1])
                    break
                else:
                    self.FC.move_to_click(self.FC.loading_find_css('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button'))
            except:
                raise Exception('로그인 실패 : tooltip 처리 실패')

    else:
        self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_pw_input']).send_keys(dict[login_type][1])

    self.FC.again_click(self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_login_btn']))

    # 유플러스 로그인 후 정상적으로 메인페이지로 이동했는지 확인
    assert self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['KV']).get_property('baseURI') == self.FC.var['common_el']['url'], self.DBG.logger.debug("유플러스 로그인 후 메인페이지 이동 실패")


# 로그아웃
def logout(self):
    self.FC.gotoHome()
    
    self.FC.movepage(self.FC.var['login_el']['logout_btn'])      # 로그아웃 버튼 선택
    assert self.FC.loading_find_css('div#KV').get_property('baseURI') == self.FC.var['common_el']['url'], self.DBG.logger.debug("로그아웃 후 메인페이지 이동 실패")

    self.FC.loading_find_css('.c-btn-menu').click()
    assert self.FC.loading_find_css(self.FC.var['login_el']['login_btn']).get_property('innerText') == "로그인", self.DBG.logger.debug("정상 로그아웃 실패")
