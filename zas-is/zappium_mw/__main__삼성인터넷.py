import json
import os
import signal
import time
from base.appdriver import AppDriver
from base.server import AppiumServer
from selenium.webdriver.support.ui import WebDriverWait
from common.function import Function
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains


from selenium.webdriver.common.keys import Keys

from pages.login import LoginPage
import math

class AppDriver속도측정(AppDriver):
    count=0 # 디버그 스크린샷 파일명 연번 static
    def __init__(self,port:int|str=4723,device_name:str='Z_FLIP4_삼성인터넷'):
        self.path = super().path_split()
        # super().download_chromedriver()
        self.option = self.set_options(device_name)
        self.driver = super().remote_aos(port,self.option)
        self.udid=self.option['appium:options']['udid']
        self.timeout = 5
        self.wait = WebDriverWait(self.driver, timeout=self.timeout)
        self.action = ActionChains(self.driver)
        self.driver.implicitly_wait(5)
        
    def set_options(self,device_name:str,devices_path="base\\devices.json"):
        '''
        ['chromedriverExecutable'] 옵션 추가
        '''
        path = os.path.join(self.path, devices_path)

        option = {}
        with open (path,encoding='UTF8') as f:
            data =json.load(f)
            common = data["common"]
            device_opt = data[device_name]['appium:options']
            chrome_path = self.exit_chrome_driver(common['chromedriverExecutable_appium_mw'])
            if 'chromedriverExecutable' not in device_opt:
                device_opt['chromedriverExecutable']=""
            device_opt['chromedriverExecutable']=chrome_path

            option = data[device_name]
            f.close()
        return option
    
class AppiumServer속도측정(AppiumServer):
    def __init__(self,PORT:int|str=4723):
        super().__init__(PORT)
    
    def stop(self) -> bool:
        """
        appium 서버가 정상적으로 멈추면 True 반환
        """
        is_terminated = False
        if self.is_running:
            assert self.server_process
            self.server_process.send_signal(signal.CTRL_BREAK_EVENT)
            os.kill(self.server_process.pid,signal.SIGTERM)
            os.system('adb shell pm clear com.sec.android.app.sbrowser.beta')
            # os.system('adb shell am force-stop com.sec.android.app.sbrowser.beta')
            print("----------- appium server stop -----------")
            is_terminated = True
        self.server_process = None
        return is_terminated

class Function속도측정(Function):
    def __init__(self,Driver:AppDriver):
        super().__init__(Driver)

    def wait_loading_속도체크(self):
        loading_elem_css='div.c-loading-1'
        loading_elem_css1='*.b-skeleton'

        self.loading_속도체크(loading_elem_css)
        self.loading_속도체크(loading_elem_css1)
    
    def loading_속도체크(self,css):
        max_count=100
        count=0
        while True:
            try:
                loading_elem=self.driver.find_element(By.CSS_SELECTOR,css)
                count+=1
                if count>max_count:
                    raise UserWarning("무한 로딩")
            except UserWarning:
                print("무한 로딩")
                break
            except Exception:
                break
    
    
    def pre_script(self):
        print(str(self.driver.contexts))
        self.driver.switch_to.context('NATIVE_APP')
        print("current => "+ str(self.driver.context))
        if self.loading_find_id('com.sec.android.app.sbrowser.beta:id/help_intro_legal_agree_button'):
            self.loading_find_id('com.sec.android.app.sbrowser.beta:id/help_intro_legal_agree_button').click()
            self.loading_find_id('com.sec.android.app.sbrowser.beta:id/help_intro_legal_agree_button').click()
        self.driver.switch_to.context('WEBVIEW_Terrace')
        print("current => "+ str(self.driver.context))
        # self.gotoHome()
    

class Tests():
    def __init__(self,AppDriver:AppDriver속도측정):
        self.wait=AppDriver.wait
        self.driver=AppDriver.driver
        self.FC=Function속도측정(AppDriver)
        self.LoginPage=LoginPage(AppDriver,self.FC)

    def check_page_render_main(self):
        # self.FC.chrome_clear(version='beta')
        print("시작")
        start = time.time()
        # self.driver.switch_to.context('WEBVIEW_com.lguplus.mobile.cs')
        self.FC.wait_loading() # 로딩("고객님의 소중한 정보를 확인하고 있어요" 아님), 스켈레톤 완료
        math.factorial(100000)
        self.driver.get("https://m.lguplus.com/main")
        while True:
            try:
                el=self.driver.find_element(By.CSS_SELECTOR,self.FC.var['mainpage_el']['개인화'])
                if el.is_displayed():
                    break
            except Exception:
                pass
        end = time.time()
        print(f"{end - start:.2f} sec")

    def 속도체크_메인(self):

        # 로그인 -- 
        self.FC.movepage(self.FC.var['login_el']['login_btn'],address=self.FC.var['login_el']['login_url'])
        uplus_id = os.environ['UPLUS_ID']
        uplus_pw = os.environ['UPLUS_PW']
        self.FC.wait_loading()
        self.FC.loading_find_css(self.FC.var['login_el']['U+로그인']).get_property('parentElement').click()
        self.FC.wait_loading()
        self.FC.loading_find_xpath(self.FC.var['login_el']['ID저장_체크_해제']).click()
        if self.FC.loading_find_css(self.FC.var['login_el']['입력한_문자_삭제']):
            self.FC.loading_find_css(self.FC.var['login_el']['입력한_문자_삭제']).click()
            
        self.FC.loading_find_css(self.FC.var['login_el']['U+ID']).send_keys(uplus_id)
        self.FC.loading_find_css(self.FC.var['login_el']['U+PW']).send_keys(uplus_pw)
        self.FC.loading_find_css(self.FC.var['login_el']['U+로그인_버튼']).click() 
        # 로그인 -- 

        self.driver.implicitly_wait(0)
        
        self.wait.until(lambda d:self.driver.execute_script('return document.readyState;') == 'complete')
        self.wait.until(lambda d:self.driver.execute_script('return performance.timing.loadEventEnd - performance.timing.navigationStart;') > 0)
        print(f"{self.driver.execute_script('return performance.timing.loadEventEnd - performance.timing.navigationStart;')/1000}",end="\t")

    def 속도체크_url(self,url):
        self.driver.implicitly_wait(0)
        self.driver.get(url)
      
        self.wait.until(lambda d:self.driver.execute_script('return document.readyState;') == 'complete')
        # self.FC.wait_loading_속도체크() # 로딩("고객님의 소중한 정보를 확인하고 있어요" 아님), 스켈레톤 완료
        self.wait.until(lambda d:self.driver.execute_script('return performance.timing.loadEventEnd - performance.timing.navigationStart;') > 0)
        print(f"{self.driver.execute_script('return performance.timing.loadEventEnd - performance.timing.navigationStart;')/1000}",end="\t")



if __name__ == '__main__' :
    try:
        # os.system("for /f \"tokens=1\" %t in (\'adb devices\') do ( adb -s %t shell am force-stop com.lguplus.mobile.cs)") # 앱 강제종료
        server=AppiumServer속도측정(4723)
        port=server.appium_service()
        if not server.waiting():
            raise Exception("서버 실행 불가")

        driver = AppDriver속도측정(port=port)
        test=Tests(driver)
        test.FC.pre_script()
        test.FC.samsung_clear(version='beta')

        print("메인 gnb 검색 모바일기기5g 모바일 인터넷iptv 혜택/멤버십 고객지원 다이렉트샵 해외로밍",)
        print("----------------------------------------------------------------------------------",)
        # test.속도체크_메인()
        test.속도체크_url('https://m.lguplus.com')
        test.속도체크_url('https://m.lguplus.com/gnb')
        test.속도체크_url("https://m.lguplus.com/search/result?searchWord=%EB%A1%9C%EB%B0%8D&pattern=%ED%86%B5%ED%95%A9%EA%B2%80%EC%83%89+%EC%9D%B8%EA%B8%B0&category=indv")
        test.속도체크_url('https://m.lguplus.com/mobile/plan/mplan/5g-all')
        test.속도체크_url('https://m.lguplus.com/mobile')
        test.속도체크_url('https://m.lguplus.com/internet-iptv')
        test.속도체크_url('https://m.lguplus.com/benefit')
        test.속도체크_url('https://m.lguplus.com/support')
        test.속도체크_url('https://m.lguplus.com/direct')
        test.속도체크_url('https://m.lguplus.com/plan/roaming/?p=1')
        
        server.stop()
        
    except BaseException as e:
        print(server.stop())
        raise RuntimeError(e)

