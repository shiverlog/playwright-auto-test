import threading

from base.appdriver import AppDriver
from base.server import AppiumServer 

from common.function import Function
from common.debug import Debug
from common.slack import Slack

from pages.login import LoginPage
from pages.mainpage import MainPage
from pages.search import Search
from pages.mypage import MypagePage
from pages.mobile import MobilePage
from pages.iptv import InternetIptvPage
from pages.benefit import BenefitPage
from pages.support import SupportPage
from pages.direct import DirectPage
from pages.ujam import UjamPage
from pages.udoc import UdocPage


# TODO 가끔 context에 WEBVIEW_com.lguplus.mobile.cs가 안뜨는 경우가 있음
#  ->  Exception이나 따로 함수 만들어서 에러났을 때, WEBVIEW_com.lguplus.mobile.cs가 비활성화 상태면 다시 재실행하는 방식으로 진행해야 할 듯
# Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1

class Tests():
    def __init__(self,AppDriver:AppDriver):
        self.driver=AppDriver.driver
        self.FC=Function(AppDriver)
        self.DBG=Debug(AppDriver)

        self.LoginPage=LoginPage(AppDriver,self.FC)
        self.MainPage=MainPage(AppDriver,self.FC)
        self.Search=Search(AppDriver,self.FC)
        self.MypagePage=MypagePage(AppDriver,self.FC)
        self.MobilePage=MobilePage(AppDriver,self.FC)
        self.InternetIptvPage=InternetIptvPage(AppDriver,self.FC)
        self.BenefitPage=BenefitPage(AppDriver,self.FC)
        self.SupportPage=SupportPage(AppDriver,self.FC)
        self.DirectPage=DirectPage(AppDriver,self.FC)
        self.UjamPage=UjamPage(AppDriver,self.FC)
        self.UdocPage=UdocPage(AppDriver,self.FC)

        self.FC.WEclass_chainge()
        self.FC.WebdriverClass_chainge()
        

    # 테스트 케이스 작성
    def TestCase_1(self):
        test_result = []
        self.FC.safari_clear()
        Slack.send_slack_title('iOS 실행 시작')
        
        self.DBG.screenshot_del()
        if self.FC.is_login():
            print("로그인 상태")
            test_result.append(self.LoginPage.logout())
            test_result.append(self.LoginPage.do_login("uplus"))
            if all(test_result) is not True:
                return False
        
        else:
            print("비로그인 상태")            
            test_result.append(self.LoginPage.do_login("uplus"))
            test_result.append(self.LoginPage.logout())
            test_result.append(self.LoginPage.do_login("uplus"))
            if all(test_result) is not True:
                return False
            
        test_result.append(self.MainPage.mainpage_new())
        test_result.append(self.MainPage.mainpage_myinfo_new())
        test_result.append(self.Search.search())
        test_result.append(self.MypagePage.mypage())
        test_result.append(self.MypagePage.mypage_bill())
        test_result.append(self.MypagePage.mypage_use())
        test_result.append(self.MobilePage.mobile())
        test_result.append(self.MobilePage.mobile_plan())
        test_result.append(self.MobilePage.mobile_device())
        test_result.append(self.InternetIptvPage.iptv())
        test_result.append(self.BenefitPage.benefit())
        test_result.append(self.BenefitPage.membership())
        test_result.append(self.SupportPage.support())
        test_result.append(self.DirectPage.direct())
        test_result.append(self.UjamPage.ujam())
        test_result.append(self.UdocPage.udoc())
        print(str(test_result))
        
        Slack.send_slack_title('iOS 실행 완료')
        
        return all(test_result)
        # self.DBG.send_log_slack()
# /Users/nam/Library/Developer/Xcode/DerivedData/
            

if __name__ == '__main__' :    
    # appium -a 0.0.0.0 -p 5000 --session-override
    #    $(BUILT_PRODUCTS_DIR)/IntegrationApp.app/IntegrationApp
    # $(BUILT_PRODUCTS_DIR)/cs.app/cs

    
    def iPhone_TEST_CASE():
        try:
            server = AppiumServer(4723)
            PORT = server.appium_service()
            server_is_running = server.waiting()
            if not(server_is_running):
                print("Appium Server 재실행")
                server = AppiumServer(4723)
                PORT = server.appium_service()
                server_is_running = server.waiting()

            TEST=Tests(AppDriver(PORT,'iPhone_12_pro_max'))
            result = TEST.TestCase_1()
            print(f"result : {result}")
            Slack.send_slack_server_result(result)
            Slack.send_slack_log_file()
            TEST.FC.safari_clear()
            TEST.driver.quit()
            
            server.stop()
            
        except BaseException as e:
            Slack.send_slack_server_result(result)
            Slack.send_slack_log_file()
            print("BaseException =>", e)
            print(server.stop())
            raise RuntimeError(e)
        
    thread1=threading.Thread(target=iPhone_TEST_CASE)
    print("===== test thread start =====")
    thread1.start()
    # thread1.join()
    print("===== test thread end =====")

    # thread1.start()
    # thread2.start()
    # thread1.join()
    # thread2.join()
    


    