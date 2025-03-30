# 로그인
def do_login(self, login_type:str):
    assert self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['KV']).get_property('baseURI') == self.FC.var['common_el']['url'], self.DBG.logger.debug("유플러스 로그인 후 메인페이지 이동 실패")


# 로그아웃
def logout(self):
    self.FC.gotoHome()

    self.FC.movepage(self.FC.var['login_el']['logout_btn'])      # 로그아웃 버튼 선택
    assert self.FC.loading_find_css('div#KV').get_property('baseURI') == self.FC.var['common_el']['url'], self.DBG.logger.debug("로그아웃 후 메인페이지 이동 실패")

    self.FC.loading_find_css('.c-btn-menu').click()
    assert self.FC.loading_find_css(self.FC.var['login_el']['login_btn']).get_property('innerText') == "로그인", self.DBG.logger.debug("정상 로그아웃 실패")
