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
from selenium.webdriver.support import expected_conditions as EC

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
        self.timeout = 45
        self.wait = WebDriverWait(self.driver, timeout=self.timeout)
        self.action = ActionChains(self.driver)
        
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
            # os.system('adb shell pm clear com.lguplus.mobile.cs')
            # os.system('adb shell am force-stop com.sec.android.app.sbrowser.beta')
            print("----------- appium server stop -----------")
            is_terminated = True
        self.server_process = None
        return is_terminated

class Function속도측정(Function):
    def __init__(self,Driver:AppDriver):
        super().__init__(Driver)
        
    def find_csss(self,css):
        try:
            el=self.driver.find_elements(By.CSS_SELECTOR,css)[0]
        except:
            el=False
        return el

    def find_xpaths(self,xpath):
        try:
            el =self.driver.find_elements(By.XPATH,xpath)[0]
        except:
            el=False
        return el
    
    def wait_loading(self):
        loading_elem_css='div.c-loading-1'
        loading_elem_css1='*.b-skeleton'

        self.loading(loading_elem_css)
        self.loading(loading_elem_css1)
    
    def loading(self,css):
        max_count=10
        count=0
        self.driver.implicitly_wait(0.1)
        while True:
            try:
                loading_elem=self.driver.find_element(By.CSS_SELECTOR,css)
                count+=1
                if count>max_count:
                    raise UserWarning("무한 로딩")
            except UserWarning :
                print(f"{max_count} 무한 로딩 ")
                self.driver.implicitly_wait(10)
                break
            except Exception:
                break

    def wait_loading_속도체크(self):
        loading_elem_css='div.c-loading-1'
        loading_elem_css1='*.b-skeleton'

        self.loading_속도체크(loading_elem_css)
        self.loading_속도체크(loading_elem_css1)
    
    def loading_속도체크(self,css):
        max_count=100
        count=0
        # self.driver.implicitly_wait(0.1)
        while True:
            try:
                loading_elem=self.driver.find_element(By.CSS_SELECTOR,css)
                count+=1
                if count>max_count:
                    raise UserWarning("무한 로딩")
            except UserWarning :
                print(f"{max_count} 무한 로딩 ")
                # self.driver.implicitly_wait(10)
                break
            except Exception:
                break
    
class Tests():
    def __init__(self,AppDriver:AppDriver속도측정):
        self.Driver=AppDriver
        self.driver=AppDriver.driver
        self.driver.implicitly_wait(0.1)
        self.FC=Function속도측정(AppDriver)
        self.LoginPage=LoginPage(AppDriver,self.FC)

    def check_page_render(self,url):
        # self.FC.chrome_clear(version='beta')
        print("시작")
        start = time.time()
        self.driver.switch_to.context('WEBVIEW_com.lguplus.mobile.cs')
        self.FC.wait_loading() # 로딩("고객님의 소중한 정보를 확인하고 있어요" 아님), 스켈레톤 완료
        math.factorial(100000)
        # self.driver.get(url)
        while True:
            try:
                el=self.driver.find_element(By.CSS_SELECTOR,self.FC.var['mainpage_el']['개인화'])
                if el.is_displayed():
                    break
            except Exception:
                pass
        end = time.time()
        print(f"{end - start:.2f} sec")

    def login(self):
        self.LoginPage.u_plus_login()
    
    def 삼성브라우저_테스트(self):
        print(str(self.driver.contexts))
        self.driver.switch_to.context('NATIVE_APP')
        print("current => "+ str(self.driver.context))
        if self.FC.loading_find_id('com.sec.android.app.sbrowser.beta:id/help_intro_legal_agree_button'):
            self.FC.loading_find_id('com.sec.android.app.sbrowser.beta:id/help_intro_legal_agree_button').click()
            self.FC.loading_find_id('com.sec.android.app.sbrowser.beta:id/help_intro_legal_agree_button').click()
        self.driver.switch_to.context('WEBVIEW_Terrace')
        print("current => "+ str(self.driver.context))
        # self.FC.loading_find_id('com.sec.android.app.sbrowser.beta:id/location_bar_edit_text').send_keys("https://m.lguplus.com")
        # self.FC.loading_find_id('com.sec.android.app.sbrowser.beta:id/location_bar_edit_text').send_keys(Keys.ENTER)
        self.driver.get("https://www.google.com/")
        # self.LoginPage.u_plus_login()

        print(str(self.driver.contexts))

    def url_DCL_and_loading(self,url):
        self.driver.implicitly_wait(0)
        self.driver.get(url)
        start = time.time()
        self.FC.wait_loading_속도체크() # 로딩("고객님의 소중한 정보를 확인하고 있어요" 아님), 스켈레톤 완료
        math.factorial(100000)
      
        self.Driver.wait.until(lambda d:self.driver.execute_script('return document.readyState;') == 'complete')
        self.Driver.wait.until(lambda d:self.driver.execute_script('return performance.timing.loadEventEnd - performance.timing.navigationStart;') > 0)
        end = time.time()
        print(f"({end - start:.2f} sec)",end=' ')
        print(f"{self.driver.execute_script('return performance.timing.loadEventEnd - performance.timing.navigationStart;')/1000}",end='\t')
        time.sleep(3)
        print(f"-- {self.driver.execute_script('return performance.timing.loadEventEnd - performance.timing.navigationStart;')/1000}",end='\t')
    
    
    def _속도체크_LCP_url(self,url,lcp:str):
        self.driver.implicitly_wait(0)
        self.driver.get(url)
        start = time.time()
        math.factorial(100000)
        if lcp.startswith('//'):
            self.Driver.wait.until(EC.visibility_of_element_located((By.XPATH, lcp)))
        else:
            self.Driver.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, lcp)))
        end = time.time()
        print(f"{end - start:.2f} sec",end='\t')

    def 속도체크_LCP_url(self,url,lcp:str):
        self.driver.implicitly_wait(0)
        self.driver.get(url)
        start = time.time()
        math.factorial(100000)
        if lcp.startswith('//'):
            count =0
            while True:
                count+=1
                try:
                    el=self.FC.find_xpaths(lcp)
                    if el == False:
                        continue
                    visibility=self.FC.driver.execute_script("return arguments[0].checkVisibility({opacityProperty: true,visibilityProperty: true,contentVisibilityAuto: true});",el)
                    # print(visibility)
                    # print(count)
                    if visibility or count > 30:
                        break
                except:
                    pass
            # el=self.Driver.wait.until(EC.presence_of_all_elements_located((By.XPATH, lcp)))
            # print(el[0].get_property('outerHTML'))

            # self.Driver.wait.until(EC.visibility_of_any_elements_located((By.XPATH, lcp)))
        else:
            count =0
            while True:
                count+=1
                try:
                    el=self.FC.find_csss(lcp)
                    if el == False:
                        continue
                    visibility=self.FC.driver.execute_script("return arguments[0].checkVisibility({opacityProperty: true,visibilityProperty: true,contentVisibilityAuto: true});",el)
                    # print(visibility)
                    # print(count)
                    if visibility or count > 30:
                        break
                except:
                    pass
            # el=self.Driver.wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'div.tab-panel')))
            # print(el[0].get_property('outerHTML'))

            # self.Driver.wait.until(EC.visibility_of_any_elements_located((By.CSS_SELECTOR, lcp)))
        end = time.time()
        print(f"{end - start:.2f} sec",end='\t')


if __name__ == '__main__' :
    
    Page_LCP={
        '메인':'img.lazyLoad.isLoaded',
        'gnb':'//a[contains(.,"온라인 전용 요금제")]',
        '_검색':'div.tab-panel',
        '검색':'//li[text()="U⁺ 가족, 친구와 함께 가는 여행이라면, 로밍 데이터를 나눠 쓸 수 있어요."]',
        '__검색':'img.lazyLoad.isLoaded',
        '모바일요금제':'//span[text()="로그인하고 현재 가입조건으로 이용하세요"]',
        '모바일':'img.lazyLoad.isLoaded',
        '인터넷IPTV':'div.modal-content img',
        '_인터넷IPTV':'img.lazyLoad.isLoaded',
        '혜택/멤버십':'img.lazyLoad.isLoaded',
        '고객지원':'div.swiper-wrapper > div.swiper-slide > div.visual-img > img.lazyLoad',
        '다이렉트':'div.direct-kv img',
        '해외로밍':'img.lazyLoad.isLoaded',

    }

    try:
        server=AppiumServer속도측정(4723)
        port=server.appium_service()
        if not server.waiting():
            raise Exception("서버 실행 불가")

        driver = AppDriver속도측정(port=port)
        test=Tests(driver)

        test.삼성브라우저_테스트()
        
        test.속도체크_LCP_url('https://m.lguplus.com/main',Page_LCP_비로그인['메인'])
        test.속도체크_LCP_url('https://m.lguplus.com/gnb',Page_LCP_비로그인['gnb'])
        test.속도체크_LCP_url('https://m.lguplus.com/search/result?searchWord=로밍&category=indv',Page_LCP_비로그인['검색'])
        test.속도체크_LCP_url('https://m.lguplus.com/mobile/plan/mplan/5g-all',Page_LCP_비로그인['모바일요금제'])
        test.속도체크_LCP_url('https://m.lguplus.com/mobile',Page_LCP_비로그인['모바일'])
        test.속도체크_LCP_url('https://m.lguplus.com/internet-iptv',Page_LCP_비로그인['인터넷IPTV'])
        test.속도체크_LCP_url('https://m.lguplus.com/benefit',Page_LCP_비로그인['혜택/멤버십'])
        test.속도체크_LCP_url('https://m.lguplus.com/support',Page_LCP_비로그인['고객지원'])
        test.속도체크_LCP_url('https://m.lguplus.com/direct',Page_LCP_비로그인['다이렉트'])
        test.속도체크_LCP_url('https://m.lguplus.com/plan/roaming/?p=1',Page_LCP_비로그인['해외로밍'])
        

        # print('------------메인페이지--------------')
        # test.삼성브라우저_테스트('https://m.lguplus.com/apcm/main')
        # print('-----------------------------------')
        # print('------------gnb--------------')
        # test.check_page_render('https://m.lguplus.com/gnb')
        # print('-----------------------------------')
        # print('------------검색--------------')
        # test.check_page_render('https://m.lguplus.com/search/result?searchWord=로밍&category=indv')
        # print('-----------------------------------')
        # print('------------로그인--------------')
        # test.login()
        # print('-----------------------------------')
        # print('------------모바일 > 모바일요금제 > 5g --------------')
        # test.check_page_render('https://m.lguplus.com/mobile/plan/mplan/5g-all')
        # print('-----------------------------------')
        # print('------------모바일 서브메인 --------------')
        # test.check_page_render('https://m.lguplus.com/mobile')
        # print('-----------------------------------')
        # print('------------인터넷/iptv 서브메인  --------------')
        # test.check_page_render('https://m.lguplus.com/internet-iptv')
        # print('-----------------------------------')
        # print('------------혜택/멤버십 서브메인  --------------')
        # test.check_page_render('https://m.lguplus.com/benefit')
        # print('-----------------------------------')
        # print('------------고객지원 서브메인  --------------')
        # test.check_page_render('https://m.lguplus.com/support')
        # print('-----------------------------------')
        # print('------------다이렉트샵 서브메인  --------------')
        # test.check_page_render('https://m.lguplus.com/direct')
        # print('-----------------------------------')
        # print('------------해외로밍 서브메인  --------------')
        # test.check_page_render('https://m.lguplus.com/plan/roaming/?p=1')
        # print('-----------------------------------')
        
        
        server.stop()
        
    except BaseException as e:
        print(server.stop())
        raise RuntimeError(e)

