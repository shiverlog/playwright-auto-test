class FooterArea():

    # 혜택테스트 부분
    def footer_link(self):
        self.FC.gotoHome()
        try:
           self.FC.action.move_to_element(self.FC.loading_find_css_pre(var.footer_el['com_introduction'])).perform()
           self.FC.loading_find_css(var.footer_el['com_introduction']).click()
           assert var.benefit_el['url'] in self.FC.loading_find_css_pre('div#kv').get_property('baseURI'), self.DBG.logger.debug("혜택 페이지 진입 실패")
        except  Exception :
            self.DBG.print_dbg("푸터 링크 이동 동작 확인",False)
            self.FC.gotoHome()
            return False

        else :
            self.DBG.print_dbg("푸터 링크 이동 동작 확인")
            return True
