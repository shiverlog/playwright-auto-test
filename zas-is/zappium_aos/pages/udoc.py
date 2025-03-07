import os
import sys
import time

from base.server import AppiumServer
from base.appdriver import AppDriver
from common.function import Function
from common.debug import Debug
from pages.login import LoginPage        # 콘솔창에 오류 메세지 출력

sys.path.append('C:\dev\lg_regression\\appium_aos')


class UdocPage():
    def __init__(self,AppDriver:AppDriver,FC:Function):
        self.FC=FC
        self.DBG=Debug(AppDriver)

    def udoc(self):
        self.FC.gotoHome()
        try:
            self.FC.move_to_click(self.FC.loading_find_css_pre(self.FC.var['common_el']['메인_메뉴']))
            self.FC.move_to_click(self.FC.loading_find_xpath_pre(self.FC.var['udoc_el']['start']))

            
        except  Exception :
            self.DBG.print_dbg("유독 페이지 정상 노출 및 기능 동작 확인",False)
            return False

        else :
            self.DBG.print_dbg("유독 페이지 정상 노출 및 기능 동작 확인")
            return True



if __name__ == "__main__":
    try:
        server = AppiumServer(4723)
        port = server.appium_service()
        if not server.waiting():
            raise Exception("서버 실행 불가")    
        driver = AppDriver(port=port)
        fc = Function(driver)
        udoc = UdocPage(driver,fc)
        login = LoginPage(driver,fc)

        fc.pre_script()
        fc.chrome_clear()

        if fc.is_login():
            login.logout()
        
        login.u_plus_login()

        udoc.udoc()

        driver.driver.quit()
        server.stop()

    except:
        os.system(r'taskkill /f /t /im node.exe')
