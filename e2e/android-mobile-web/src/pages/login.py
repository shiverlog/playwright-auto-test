
    self.FC.movepage(self.FC.var['login_el']['login_btn'], address=self.FC.var['login_el']['login_url'])
    self.FC.wait_loading()

    self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_login_img']).get_property('parentElement').click()
    self.FC.wait_loading()

    if login_type == "uplus":
        self.FC.is_exists_element_click(self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_입력한문자삭제']))
        self.FC.is_exists_element_click(self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_id_저장']))
        self.FC.wait_loading()

        self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_id_input']).send_keys(dict[login_type][0])
        self.FC.is_exists_element_click(self.FC.loading_find_css('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button'))
        for _ in range(3):
            try:
                if self.FC.loading_find_css('.c-tooltip') == False:
                    self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_pw_input']).send_keys(dict[login_type][1])
                    break
                else:
                    self.FC.move_to_click(self.FC.loading_find_css('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button'))
            except:
                raise Exception('로그인 실패 : tooltip 처리 실패')

    # 유플러스 로그인 후 정상적으로 메인페이지로 이동했는지 확인
    assert self.FC.loading_find_css(self.FC.var['mainpage_el']['KV']).get_property('baseURI') == self.FC.var['common_el']['home_url'], self.DBG.logger.debug("u+ ID 로그인 후 메인페이지 이동 실패")

