class UdocPage():
    def udoc(self):
        self.FC.gotoHome()

        try:
            self.FC.move_to_click(self.FC.loading_find_xpath_pre(self.FC.var['udoc_el']['udoc']))

        except  Exception :
            self.DBG.print_dbg("유독 페이지 정상 노출 및 기능 동작 확인",False)
            return False

        else :
            self.DBG.print_dbg("유독 페이지 정상 노출 및 기능 동작 확인")
            return True
