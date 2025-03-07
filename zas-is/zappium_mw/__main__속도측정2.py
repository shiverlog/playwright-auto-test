from datetime import datetime 
import json
import os
import signal
import time
from PIL import Image
import pytesseract

import pyperclip
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
    def __init__(self,port:int|str=4723,device_name:str='갤럭시_S24_PLUS'):
        self.path = super().path_split()
        # super().download_chromedriver()
        self.option = self.set_options(device_name)
        self.driver = super().remote_aos(port,self.option)
        self.udid=self.option['appium:options']['udid']
        self.timeout = 10
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
        self.속도측정데이터가져오기()

    def 속도측정데이터가져오기(self):
        file = os.getenv('SPEEDCHECK')
        with open(file,'r') as f:
            data = json.load(f)

        self.kt=data['kt']
        self.skt=data['skt']

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

    def test(self,url,lcp:str):
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

    def DCL_기준(self,url=''):
        self.driver.implicitly_wait(0)
        self.driver.get(url)
        start = time.time()
        math.factorial(100000)
        # self.FC.wait_loading_속도체크() # 로딩("고객님의 소중한 정보를 확인하고 있어요" 아님), 스켈레톤 완료
      
        self.Driver.wait.until(lambda d:self.driver.execute_script('return document.readyState;') == 'complete')
        end = time.time()
        print(f"{end - start:.2f} sec",end='\t')
    
    def LCP_기준(self,url='',lcp=''):
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

    def LOAD_기준(self,url=''):
        self.driver.implicitly_wait(0)
        self.driver.get(url)
        math.factorial(100000)
        # self.FC.wait_loading_속도체크() # 로딩 아이콘 사라지고, 페이지 이동이 확실
        self.Driver.wait.until(lambda d:self.driver.execute_script('return performance.timing.loadEventEnd - performance.timing.navigationStart;') > 0)
        print(f"{self.driver.execute_script('return performance.timing.loadEventEnd - performance.timing.navigationStart;')/1000:.2f}",end='\t')

    def 로딩아이콘_제거_기준(self,url=''):
        self.driver.implicitly_wait(0)
        self.driver.get(url)
        start = time.time()
        math.factorial(100000)
        self.Driver.wait.until(lambda d:self.driver.execute_script('return document.readyState;') == 'complete')
        self.FC.wait_loading_속도체크()
        end = time.time()
        print(f"{end - start:.2f} sec",end='\t')

    def LCP_기준_v2(self,url=''):
        self.driver.implicitly_wait(0)
        if url != '':
            self.driver.get(url)
        # time.sleep(7)
        # self.Driver.wait.until(lambda d:self.driver.execute_script("new PerformanceObserver((entryList) => {console.dirxml(entryList.getEntries())}).observe({type:'largest-contentful-paint', buffered: true});") != None)
        # print(self.driver.execute_script("new PerformanceObserver((entryList) => {return entryList.getEntries() }).observe({type:'largest-contentful-paint', buffered: true});"))
        self.FC.driver.set_script_timeout(60)
        self.Driver.wait.until(lambda d:self.driver.execute_script('return document.readyState;') == 'complete')
        self.FC.wait_loading_속도체크() # 로딩 아이콘 사라지고, 페이지 이동이 확실
        time.sleep(5)
        # script = "var callback = arguments[arguments.length - 1]; "\
        #             "function getLCPEntries() {"\
        #             "return new Promise((resolve, reject) => {"\
        #             "const entries = [];"\
        #             "try {"\
        #             "const observer = new PerformanceObserver((entryList) => {"\
        #             "for(const entry of entryList.getEntries()){"\
        #             "entries.push(entry);}"\
        #             "if (entries.length > 0) {"\
        #             "resolve(entries);}"\
        #             "});"\
        #             "observer.observe({ type: 'largest-contentful-paint', buffered: true });"\
        #             "setTimeout(() => {"\
        #             "observer.disconnect();"\
        #             "resolve(entries);"\
        #             "}, 5000);"\
        #             "} catch (error) {"\
        #             "reject(error);}"\
        #             "});}"\
        #             "getLCPEntries().then((entries) => {"\
        #             "callback(entries)"\
        #             "}).catch((error) => {"\
        #             "callback(error)});"
                    
        script= "var callback = arguments[arguments.length - 1]; "\
                "const entries = [];"\
                "new PerformanceObserver((entryList) => {"\
                "for (const entry of entryList.getEntries()){"\
                "entries.push(entry);"\
                "}"\
                "callback(entries);"\
                "}).observe({type: 'largest-contentful-paint', buffered: true});"
        datas =self.driver.execute_async_script(script)
        data=datas[-1]
        # for data in datas:
        #     for key, val in data.items():
        #         if key == 'element' and val != None:
        #             print(f"{key}: {val.get_property('outerHTML')}")
        #         else:
        #             print(f"{key}: {val}")

        print(f"element: {data.get('element').get_property('outerHTML') if data.get('element',None) !=None else None }")
        print(f"startTime: {data['startTime']/1000:.2f}")

        print("전==========================================================")
        time.sleep(10)
        script= "var callback = arguments[arguments.length - 1]; "\
                "const entries = [];"\
                "new PerformanceObserver((entryList) => {"\
                "for (const entry of entryList.getEntries()){"\
                "entries.push(entry);"\
                "}"\
                "callback(entries);"\
                "}).observe({type: 'largest-contentful-paint', buffered: true});"
        datas =self.driver.execute_async_script(script)
        data=datas[-1]
        print(f"element: {data.get('element').get_property('outerHTML') if data.get('element',None) !=None else None }")
        print(f"startTime: {data['startTime']/1000:.2f}")

        print("후==========================================================")

    def LCP_기준_v3(self,url=''):
        self.driver.implicitly_wait(0)
        if url != '':
            self.driver.get(url)
        self.FC.driver.set_script_timeout(60)
        self.Driver.wait.until(lambda d:self.driver.execute_script('return document.readyState;') == 'complete')
        self.FC.wait_loading_속도체크()
        time.sleep(10)
        script= "var callback = arguments[arguments.length - 1]; "\
                "const entries = [];"\
                "new PerformanceObserver((entryList) => {"\
                "for (const entry of entryList.getEntries()){"\
                "entries.push(entry);"\
                "}"\
                "callback(entries);"\
                "}).observe({type: 'largest-contentful-paint', buffered: true});"
        datas =self.driver.execute_async_script(script)
        data=datas[-1]
        if type(data['element']) != type(None):
            print(f" {data['startTime']/1000:.2f}",end="\n")
            # print(data['element'].get_property('outerHTML'))

        else:
            time.sleep(10)
            # print(datas)
            # print(data)
            # print(datas[0]['element'].get_property('outerHTML'))
            script= "var callback = arguments[arguments.length - 1]; "\
                "const entries = [];"\
                "new PerformanceObserver((entryList) => {"\
                "for (const entry of entryList.getEntries()){"\
                "entries.push(entry);"\
                "}"\
                "callback(entries);"\
                "}).observe({type: 'largest-contentful-paint', buffered: true});"
            datas =self.driver.execute_async_script(script)
            data=datas[-1]
            print(f" {data['startTime']/1000:.2f}",end="\n")
            # print(datas[-1])
        return data['startTime']/1000

    def get_현재_시간(self):
        now = datetime.now()
        return now.strftime('%Y-%m-%d %H:%M:%S')  

    def kt_login(self):
        try:
            self.driver.get('https://m.kt.com/')
            time.sleep(5)
            
            self.FC.is_exists_element_click(self.FC.loading_find_css_pre('div#mainpop02 button.layer-stop'))
            self.FC.is_exists_element_click(self.FC.loading_find_css_pre('div#mainpop02 button[title*="닫"]'))

            
            self.FC.loading_find_css('a.btn_blk').click()
            self.FC.loading_find_css_pre('input[name="userId"]').send_keys(self.kt['id'])
            self.FC.loading_find_css_pre('input[name="password"]').send_keys(self.kt['pw'])
            pyperclip.copy(self.kt['id'])
            self.FC.loading_find_css_pre('input[name="userId"]').send_keys(Keys.CONTROL,'v')
            time.sleep(1)
            pyperclip.copy(self.kt['pw'])
            self.FC.loading_find_css_pre('input[name="password"]').send_keys(Keys.CONTROL,'v')
            time.sleep(1)
            # self.FC.is_exists_element_click(self.FC.loading_find_css_pre('div#mainpop02 button.layer-stop'))
            self.FC.is_exists_element_click(self.FC.loading_find_css_pre('div#mainpop02 button[title*="닫"]'))
            self.FC.loading_find_css_pre('button#loginSubmit').click()

            self.Driver.wait.until(lambda d:self.driver.execute_script('return document.readyState;') == 'complete')
            time.sleep(30)

            assert self.FC.loading_find_css_pre('div.homeMain').get_property('baseURI') == 'https://m.kt.com/',print('kt 로그인 실패')
            print("kt 로그인 성공")
        except Exception as e:
            print(e)

    def 리캡챠_테스트(self):
        img = Image.open(r"result/recapcha.png")
        pytesseract.pytesseract.tesseract_cmd = 'C:\\Users\\유닉솔루션(주)\\AppData\\Local\\tesseract.exe'
        captcha_text = pytesseract.image_to_string(img)
        print(captcha_text)

    def skt_login(self):
        try:
            self.driver.get('https://m.tworld.co.kr/v6/main')
            time.sleep(5)
            # 팝업
            self.FC.is_exists_element_click(self.FC.loading_find_css('div.modal-content-transition button.check-btn'))

            self.FC.loading_find_css('div.g-line-user a[href*="login"]').click()
            self.FC.loading_find_css_pre('input#userId').send_keys(self.skt['id'])
            self.FC.loading_find_css_pre('input#password').send_keys(self.skt['pw'])
            self.FC.loading_find_css_pre('button#authLogin').click()
            self.Driver.wait.until(lambda d:self.driver.execute_script('return document.readyState;') == 'complete')
            assert self.FC.loading_find_css('main.main').get_property('baseURI') == 'https://m.tworld.co.kr/v6/main',print('skt 로그인 실패')
            print("skt 로그인 성공")
        except Exception as e:
            print(e)

if __name__ == '__main__' :
    
    Page_LCP={
        '메인':'img.lazyLoad.isLoaded',
        '_검색':'div.tab-panel',
        '검색':'//li[text()="U⁺ 가족, 친구와 함께 가는 여행이라면, 로밍 데이터를 나눠 쓸 수 있어요."]',
        'gnb':'//a[contains(.,"온라인 전용 요금제")]',
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

    def print속도측정_URL():
        속도측정_포맷 = {}
        with open('common/속도측정.json',encoding='utf-8') as f:
            속도측정_포맷=json.load(f)
            f.close()
        
        속도측정_결과 = 속도측정_포맷.copy()
        통신사s = ["kt","lg","skt"]

        for 통신사 in 통신사s:
            for page,page_info in 속도측정_결과[통신사].items():    
                print(f" {통신사} - {page} : {page_info['url']} ",end="\n")
                # print(f" page_info: {page_info} ",end="\t")
                # print(속도측정_결과[통신사][page]["측정"][count]["date"])
            print('-'*50)

    def 속도측정():
        try:
            속도측정_포맷 = {}
            with open('common/속도측정.json',encoding='utf-8') as f:
                속도측정_포맷=json.load(f)
                f.close()


            server=AppiumServer속도측정(4723)
            port=server.appium_service()
            if not server.waiting():
                raise Exception("서버 실행 불가")

            # driver = AppDriver속도측정(port=port,device_name="Z_FLIP4_삼성인터넷")
            driver = AppDriver속도측정(port=port)
            test=Tests(driver)

            test.삼성브라우저_테스트()

            # # for key,value in urls.items():
            # #     test.DCL_기준(value)    

            # # for key,value in urls.items():
            #     # test.LCP_기준(value,Page_LCP[key])    

            # # for key,value in urls.items():
            # #     test.LOAD_기준(value)    

            # # for key,value in urls.items():
            # # #     test.로딩아이콘_제거_기준(value)


            속도측정_결과 = 속도측정_포맷.copy()
            통신사s = ["kt","lg","skt"]
            # 통신사s = ["kt"]

            for 통신사 in 통신사s:
                if 통신사 == "kt":
                    test.kt_login()
                elif 통신사 == "lg":
                    test.LoginPage.u_plus_login()
                elif 통신사 == "skt":
                    test.skt_login()

                for count in range(0,1):
                    # print("\n")
                    # print(count,end="\n")
                    for page,page_info in 속도측정_포맷[통신사].items():
                        print(f" {통신사} - {page} ",end="\t")
                        # if count <1 and page == "메인": # 메인페이지 1회차 진입 시엔 url 이동X
                        #     측정속도 = test.LCP_기준_v3()
                        if 통신사 == "kt" and page =="gnb": # kt gnb는 페이지가 아닌 UI라 측정X
                            측정속도 = -1
                            print("\n")
                        else:
                            측정속도 = test.LCP_기준_v3(page_info["url"])
                        try:
                            if 측정속도 == -1:
                                속도측정_결과[통신사][page]["측정"][count]["time"] = "kt gnb는 측정 X"
                            else:
                                속도측정_결과[통신사][page]["측정"][count]["time"] = round(측정속도,2)
                        except Exception as e:
                            속도측정_결과[통신사][page]["측정"].append({"date":"","time":"kt gnb는 측정 X" if 측정속도 == -1 else round(측정속도,2)})

                        속도측정_결과[통신사][page]["측정"][count]["date"] = test.get_현재_시간()

            print("\n")
            print(속도측정_결과)

            with open('common/속도측정.json','w',encoding='utf-8') as f:
                json.dump(속도측정_결과,f,ensure_ascii=False,indent=4)
                f.close()

            server.stop()
            
        except BaseException as e:
            print(server.stop())
            raise RuntimeError(e)

    속도측정()
    # print속도측정_URL()