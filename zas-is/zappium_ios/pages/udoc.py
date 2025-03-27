
class UdocPage():
    def __init__(self,AppDriver:AppDriver,FC:Function):
        self.FC=FC
        self.DBG=Debug(AppDriver)

    def udoc(self):
        self.FC.gotoHome()
        try:
            self.FC.move_to_click(self.FC.loading_find_css_pre(self.FC.var['common_el']['메인_메뉴']))
            self.FC.loading_find_xpath_pre(self.FC.var['udoc_el']['start']).re_click()

        except  Exception :
            self.DBG.print_dbg("유독 페이지 정상 노출 및 기능 동작 확인",False)
            return False

        else :
            self.DBG.print_dbg("유독 페이지 정상 노출 및 기능 동작 확인")
            return True


