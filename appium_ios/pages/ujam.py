import sys

from base.server import AppiumServer
from base.appdriver import AppDriver
import common.variable as var
from common.function import Function
from common.debug import Debug

sys.path.append('/Users/nam/dev/remotePC_batchfiles/pubsub/appium_ios')


class UjamPage():
    def __init__(self,AppDriver:AppDriver,FC:Function):
        self.FC=FC
        self.DBG=Debug(AppDriver)

    def ujam(self):
        self.FC.gotoHome()

        try:
            self.FC.move_to_click(self.FC.loading_find_css_pre(self.FC.var['common_el']['메인_메뉴']))
            self.FC.move_to_click(self.FC.loading_find_xpath_pre(self.FC.var['benefit_el']['benefit']))
            self.FC.move_to_click(self.FC.loading_find_css_pre(self.FC.var['common_el']['전체펼침']))
            self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['ujam_el']['ujam']))

        except  Exception :
            self.DBG.print_dbg("유잼 페이지 정상 노출 및 기능 동작 확인",False)
            return False

        else :
            self.DBG.print_dbg("유잼 페이지 정상 노출 및 기능 동작 확인")
            return True


if __name__ == "__main__":
    try:
        server = AppiumServer(4723)
        port = server.appium_service()
        if not server.waiting():
            raise Exception("서버 실행 불가")
        driver = AppDriver(port=port)
        fc = Function(driver)
        ujam = UjamPage(driver,fc)

        fc.pre_script()
        
        ujam.ujam()
        driver.driver.quit()
        server.stop()
    except Exception as e:
        print(e)
        # os.system("lsof -P -i :4723 |awk NR==2'{print $2}'|xargs kill -9")
        # os.system(f"ios-deploy --kill --bundle_id com.lguplus.mobile.cs")

