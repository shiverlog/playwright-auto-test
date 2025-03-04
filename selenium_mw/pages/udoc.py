from base.webdriver import WebDriver
from common.function import Function
from common.debug import Debug
from pages.login import LoginPage

class UdocPage():
    def __init__(self,WebDriver:WebDriver,FC:Function):
        # self.driver=WebDriver.driver
        self.FC=FC
        self.DBG=Debug(WebDriver)

    def udoc(self):
        self.FC.gotoHome()
        try:
            self.FC.move_to_click(self.FC.loading_find_css_pre(self.FC.var['common_el']['메뉴_버튼']))
            self.FC.move_to_click(self.FC.loading_find_xpath_pre(self.FC.var['udoc_el']['start']))

            
        except  Exception :
            self.DBG.print_dbg("유독 페이지 정상 노출 및 기능 동작 확인",False)
            return False

        else :
            self.DBG.print_dbg("유독 페이지 정상 노출 및 기능 동작 확인")
            return True


if __name__ == "__main__":
    driver = WebDriver()
    fc = Function(driver)
    udoc = UdocPage(driver,fc)
    login = LoginPage(driver,fc)

    # 공통모듈로 분리?
    if fc.is_login():
        login.logout()
        
    login.u_plus_login()

    udoc.udoc()

    driver.driver.quit()
    driver.kill()

