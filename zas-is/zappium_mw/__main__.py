import base64
import threading
import time
from base.appdriver import AppDriver
from common.function import Function
from common.debug import Debug
from common.slack import Slack

from pages.login import LoginPage
from pages.mobile import MobilePage
from pages.benefit import BenefitPage
from pages.udoc import UdocPage
from pages.chatbot import ChatbotPage
from pages.iptv import InternetIptvPage
# from pages.phone_plan import PhonePlanPage
from pages.mainpage import MainPage
from pages.support import SupportPage
from pages.mypage import MypagePage
from pages.direct import DirectPage
from pages.uth import UthPage
from base.server import AppiumServer 
from pages.search import Search
import os
import getpass
import json


class Tests():
    def __init__(self,AppDriver:AppDriver):
        self.driver=AppDriver.driver
        self.FC=Function(AppDriver)
        self.DBG=Debug(AppDriver)
        self.MypagePage=MypagePage(AppDriver,self.FC)
        self.LoginPage=LoginPage(AppDriver,self.FC)
        self.BenefitPage=BenefitPage(AppDriver,self.FC)
        self.InternetIptvPage=InternetIptvPage(AppDriver,self.FC)
        self.MainPage=MainPage(AppDriver,self.FC)
        self.SupportPage=SupportPage(AppDriver,self.FC)
        self.UdocPage=UdocPage(AppDriver,self.FC)
        self.MobilePage=MobilePage(AppDriver,self.FC)
        self.DirectPage=DirectPage(AppDriver,self.FC)
        self.UthPage=UthPage(AppDriver,self.FC)
        self.Search = Search(AppDriver,self.FC)

    # 테스트 케이스 작성
    
    def TestCase_Z_FLIP3(self):
        test_result = [] # 기능 수행 결과
        Slack.send_slack_title('Appium MW 실행 시작')
        print(str(self.driver.contexts))
        print("current => "+ str(self.driver.context))
        
        time.sleep(5)
        self.FC.pre_script()
        self.FC.samsung_clear(version='beta')
        self.DBG.screenshot_del()

        test_result.append(self.LoginPage.u_plus_login())
        test_result.append(self.MainPage.mainpage_new())
        test_result.append(self.Search.search())
        test_result.append(self.MypagePage.mypage())
        test_result.append(self.MypagePage.mypage_bill())
        test_result.append(self.MypagePage.mypage_use())
        test_result.append(self.MobilePage.mobile())
        test_result.append(self.MobilePage.mobile_plan())
        test_result.append(self.MobilePage.mobile_device())

        self.FC.samsung_clear(version='beta')

        test_result.append(self.InternetIptvPage.iptv())
        test_result.append(self.BenefitPage.benefit())
        test_result.append(self.BenefitPage.membership())
        test_result.append(self.SupportPage.support())
        test_result.append(self.DirectPage.direct())
        test_result.append(self.UthPage.uth())
        test_result.append(self.UdocPage.udoc())
        Slack.send_slack_title('Appium MW 실행 완료')
        self.driver.quit()

        self.FC.samsung_clear(version='beta')

        print(str(test_result))
        return all(test_result)

if __name__ == '__main__' :

    def Z_FLIP4_TEST_CASE():
        try:
            os.system("for /f \"tokens=1\" %t in (\'adb devices\') do ( adb -s %t shell am force-stop com.lguplus.mobile.cs)") # 앱 강제종료
            server=AppiumServer(4723)
            port=server.appium_service()
            if not server.waiting():
                print("Appium Server 재실행")
                server=AppiumServer(4723)
                port=server.appium_service()
                if not server.waiting():
                    raise BaseException("Appium Server 재실행 실패")


            driver = AppDriver(port=port,device_name='Z_FLIP4_삼성인터넷')
            test=Tests(driver)
            # test.FC.pre_script()
            # test.FC.samsung_clear(version='beta')
            result = test.TestCase_Z_FLIP3()
            print(f"result:{result}")
            server.stop(result)
            
        except BaseException as e:
            # driver.driver.quit()
            print(server.stop(False))
            os.system(r'taskkill /f /t /im node.exe')
            raise RuntimeError(e)
            

    thread1=threading.Thread(target=Z_FLIP4_TEST_CASE)
    print("===== test thread start =====")
    thread1.start()
    thread1.join()
    # thread2.start()
    # thread2.join()
    
    print("===== test thread end =====")


