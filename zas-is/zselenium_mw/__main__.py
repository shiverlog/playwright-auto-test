from common.function import Function
from base.webdriver import WebDriver
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
# from pages.chatbot import ChatbotPage


class Tests:
    def __init__(self, WebDriver: WebDriver):
        self.Driver = WebDriver
        self.driver = WebDriver.driver
        self.FC = Function(WebDriver)
        self.DBG = Debug(WebDriver)

        self.LoginPage=LoginPage(WebDriver,self.FC)
        self.MainPage=MainPage(WebDriver,self.FC)
        self.Search=Search(WebDriver,self.FC)
        self.MypagePage=MypagePage(WebDriver,self.FC)
        self.MobilePage=MobilePage(WebDriver,self.FC)
        self.InternetIptvPage=InternetIptvPage(WebDriver,self.FC)
        self.BenefitPage=BenefitPage(WebDriver,self.FC)
        self.SupportPage=SupportPage(WebDriver,self.FC)
        self.DirectPage=DirectPage(WebDriver,self.FC)
        self.UjamPage=UjamPage(WebDriver,self.FC)
        self.UdocPage=UdocPage(WebDriver,self.FC)

        
    # 테스트 케이스 작성
    def TestCase_1(self):
        test_result = [] # 기능 수행 결과
        Slack.send_slack_title('MW 실행 시작')
        self.DBG.screenshot_del()
        self.FC.modal_ck()
        
        test_result.append(self.LoginPage.u_plus_login_retry(2, "uplus"))
        test_result.append(self.MainPage.mainpage_new())
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

        Slack.send_slack_title('MW 실행 완료')
        
        return all(test_result)

if __name__ == "__main__":
    driver = WebDriver()
    TESTS = Tests(driver)
    result = TESTS.TestCase_1()
    driver.driver.quit()
    driver.kill(result)
