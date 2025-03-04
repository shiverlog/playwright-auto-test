import os
import re
import subprocess
import shutil 
import platform
import getpass
from urllib.request import urlretrieve
import urllib3
import requests

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait     # 시간대기 모듈
from selenium.webdriver.common.action_chains import ActionChains

from common import variable as var
from common.slack import Slack


class WebDriver():
    count = 0 # 디버그 스크린샷 파일명 연번 static
    port = 9222 # 포트
    chromesdriver_path = {
           '유닉솔루션(주)': 'C:\\Users\\유닉솔루션(주)\\.wdm\\drivers\\chromedriver\\win32\\127.0.6533.88\\chromedriver-win64\\chromedriver.exe',
           'PC2308': 'C:/Users/PC2308/.wdm/drivers/chromedriver/win32/129.0.6668.100/chromedriver-win64/chromedriver.exe', 
           'User': 'C:/Users/User/.wdm/drivers/chromedriver/win32/130.0.6723.69/chromedriver-win64/chromedriver.exe'
           }
        

    def __init__(self):
        self.PORT = self.port
        self.path = self.path_split()
        self.download_chromedriver()
        self.driver = self.setup() # 드라이버 셋팅 
        self.os = platform.system() # os 분기 처리시 필요
        self.wait = WebDriverWait(self.driver, timeout=10)
        self.action = ActionChains(self.driver) # 스크롤/스와이프 액션 객체
      

    @classmethod
    def Counting(cls):
        '''
        스크린샷 카운팅
        '''
        cls.count=cls.count+1
        
    @classmethod
    def getCount(cls):
        '''
            스크린샷 카운트 값
        '''
        return cls.count

    def kill(self,test_result:bool):
        '''
        현재 포트 종료. 디버그 크롬 사용 시, 사용
        test_result: 테스트 결과 True/False
        '''
        print(f"kill -> {self.PORT}")
        try:
            # self.send_slack_log(False,test_result)
            Slack.send_slack_server_result(test_result)
            Slack.send_slack_log_file()
            print(f"현재 사용중인 포트(or URL): {self.PORT}")
            res=subprocess.getstatusoutput(f"for /f \"tokens=5\" %t in ('netstat -ano ^|findstr {self.PORT}') do (taskkill /f /pid %t)") 
            # for /f "tokens=5" %t in ('netstat -ano ^|findstr 9223') do (taskkill /f /pid %t)

            print(res)
            if "SUCCESS" in res[1]:
                print(f"{self.PORT}포트 브라우저를 종료하였습니다.")
            else:
                raise Exception()
        except Exception as e:
            print(e)
        
    def mkdir(self,path):
        '''
        해당 경로에 파일 생성. 디버그 크롬 실행 시, 캐시 파일 저장 경로 생성
        '''
        path = path+f"\\{self.PORT}"
        print(path)
        if not os.path.exists(path):
            os.makedirs(path+f"\\{self.PORT}")
        else:
            pass
        return path

    def setup_debbuger(self):
        '''
        디버거 크롬 브라우저로 실행
        '''
        profile_u="Profile 6"

        res=subprocess.getstatusoutput(f"tasklist |findstr 'chrome.exe'")
        if "ERROR" in res or "not found" in res:
            pass
        else:
            os.system('taskkill /IM chrome.exe')

        user_agent="Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
        while True:
            res=subprocess.getstatusoutput(f"netstat -ano |findstr {self.PORT} |findstr /v 'TIME_WAIT'")  
            if str(self.PORT) in res[1]:
                print(res)
                print(f"{self.PORT} 포트가 이미 사용중입니다.")
                self.PORT =self.PORT+1
            else:
                print(res)
                print(f"{self.PORT} 사용가능한 포트 입니다.")
                break
            
        print(f"현재 사용 할 포트: {self.PORT}")
        
        path ="C:\\chrometemp"
        path =self.mkdir(path)
            
        res=os.system(f'start C:\\"Program Files"\\Google\\Chrome\\Application\\chrome.exe --remote-debugging-port={self.PORT} --profile-directory="{profile_u}" --no-first-run --no-default-browser-check --ash-no-nudges --window-size="412,915" --use-mobile-user-agent --user-agent="{user_agent}" --user-data-dir={path}')
        print(res)
        if 0 == res:
            print("디버거 크롬 실행")
        else:
            print("디버거 크롬 실행 오류")

        print(str(res))


        options = Options()

        # # 크롬 브라우저 버그
        options.add_experimental_option("debuggerAddress", f"127.0.0.1:{self.PORT}")
        # service = Service('C:/Test/chromedriver-win64/123/chromedriver.exe')        #
        if getpass.getuser() == '유닉솔루션(주)':
            service = Service('C:/Users/유닉솔루션(주)/.wdm/drivers/chromedriver/win32/123.0.6312.58/chromedriver.exe')      # ChromeDriverManager Latest version 미배포로 임시 지정
        elif getpass.getuser() == 'PC2308' :
            service = Service('C:/Users/PC2308/.wdm/drivers/chromedriver/win32/128.0.6613.84/chromedriver-win64/chromedriver.exe')   
        else:
            service = Service('C:/Users/User/.wdm/drivers/chromedriver/win32/126.0.6478.62/chromedriver.exe')      # ChromeDriverManager Latest version 미배포로 임시 지정

        driver = webdriver.Chrome(service=service, options=options)    
        driver.delete_all_cookies()
        #self.driver.maximize_window()              # 브라우저 창 최대화
        url =var.common_el['home_url']
        # url='https://m.lguplus.com/'
        #wait = WebDriverWait(self.driver, 10)      #implicitly wait
        driver.get(url)
        # print(str(driver.capabilities))
        driver.implicitly_wait(5)
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        driver.execute_script('window.localStorage.clear()')
        driver.execute_script('window.sessionStorage.clear()')

        
        return driver
    
    def download_chromedriver(self):
        '''
        현재 크롬 버전과, chromeDriver 버전이 상이할 때, 다운로드
        '''
        # Windows 레지스트리에서 크롬 버전 정보를 직접 조회
        cmd = 'reg query "HKEY_CURRENT_USER\Software\Google\Chrome\BLBeacon" /v version'
        output = subprocess.check_output(cmd, shell=True).decode('utf-8')

        # 정규표현식을 사용하여 버전 번호 추출
        version = re.search(r"REG_SZ\s+(\d+\.\d+\.\d+\.\d+)", output)
        if version:
            current_chrome = version.group(1)
        else:
            current_chrome = "버전 정보를 찾을 수 없습니다."

        # 000(1).0(2).0000(3).000(4) 버전이 (3)까지 동일하면 다운로드 X 
        chromedriver = self.get_chromedriver()
        match = [True if num in chromedriver else False for num in current_chrome.split('.')] 
        if match[2]:
            print("크롬 드라이버 버전이 동일합니다.")
            return 
        else:
            # 현재 크롭 앱에서 유효한 드라이버 최신버전 
            print("크롬 드라이버 버전이 동일하지 않습니다. 차후 경로를 수정해주세요.")
           
            urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)  # 트리거 워닝 제거(InsecureRequestWarning: Unverified HTTPS request is being made to host 'googlechromelabs.github.io'.)
            new_version =requests.get(f"https://googlechromelabs.github.io/chrome-for-testing/LATEST_RELEASE_{current_chrome.split('.')[0]}.{current_chrome.split('.')[1]}.{current_chrome.split('.')[2]}", verify = False) 
            new_version = new_version.text
            url = f"https://storage.googleapis.com/chrome-for-testing-public/{new_version}/win64/chromedriver-win64.zip"
            download_name = f'C:\\Users\\{getpass.getuser()}\\Downloads\\new_chrome_driver_{new_version}.zip'
            urlretrieve(url,download_name) # chrome_driver download

            # 압축해제
            set_chromedriver_path = f'C:\\Users\\{getpass.getuser()}\\.wdm\\drivers\\chromedriver\\win32\\{new_version}'
            shutil.unpack_archive(download_name,set_chromedriver_path,'zip')
            self.set_chromedriver(os.path.join(set_chromedriver_path,'chromedriver-win64\\chromedriver.exe'))
    
    def path_split(self):
        path = os.getcwd()
        if 'selenium_mw' in os.path.split(path)[0]:
            print(f"parent path: {os.path.split(path)[0]}")
            return os.path.split(path)[0]
        else: 
            print(f"parent path: {path}")
            return path

    def set_chromedriver(self,set_chromedriver_path):
        '''
        크롬드라이버 세팅 set
        set_chromedriver_path : 설정할 크롬 드라이버 경로
        '''
        # chromedriver_dict={
        #     '유닉솔루션(주)': 'C:/Users/유닉솔루션(주)/.wdm/drivers/chromedriver/win32/126.0.6478.63/chromedriver.exe',
        #     'PC2308': 'C:/Users/PC2308/.wdm/drivers/chromedriver/win32/126.0.6478.62/chromedriver.exe',
        #     'User': 'C:/Users/User/.wdm/drivers/chromedriver/win32/126.0.6478.62/chromedriver.exe',
        # } 
        user = getpass.getuser()
        print(f"현재 User : {user}")
        self.chromesdriver_path[user] = set_chromedriver_path
        print(f"set chromedriver -> {str(self.chromesdriver_path)}") 

    def get_chromedriver(self):
        '''
        크롬드라이버 세팅 get
        '''
        # chromedriver_dict={
        #     '유닉솔루션(주)': 'C:/Users/유닉솔루션(주)/.wdm/drivers/chromedriver/win32/126.0.6478.63/chromedriver.exe',
        #     'PC2308': 'C:/Users/PC2308/.wdm/drivers/chromedriver/win32/126.0.6478.62/chromedriver.exe',
        #     'User': 'C:/Users/User/.wdm/drivers/chromedriver/win32/126.0.6478.62/chromedriver.exe',
        # } 
        user = getpass.getuser()
        print(f"현재 User : {user}")
        return self.chromesdriver_path.get(user,None)

    def setup(self):
        '''
        크롬 드라이버로 실행
        '''
        options = Options()

        options.add_experimental_option("prefs",{"profile.default_content_setting_values.notifications":1}) # 허용이나 거부를 선택하는 알림창 해제
        options.add_experimental_option("detach",True) # 브라우저 바로 닫힘 방지
        options.add_argument("disable-blink-features=AutomationControlled") # 자동화 탐지 방지
        options.add_argument('log-level=3') # ws://127.0.0.1에서 DevTools가 수신 중인 메시지가 표시되지만 나머지 로그는 표시되지 않음
        options.add_experimental_option('excludeSwitches', ['enable-logging']) # 로깅 제거(실행 시, DevTools listening on ws://127.0.0.1:60255/devtools/browser/263c79cf-d7f4-4dba-82ef-b7cd147344ad 제거)
        options.add_experimental_option("excludeSwitches", ["enable-automation"]) # 자동화 표시 제거
        options.add_experimental_option('useAutomationExtension', False) # 자동화 확장 기능 사용 안 함
        options.add_argument('incognito') # 시크릿모드
        user_agent='Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
        options.add_argument('user-agent='+user_agent)
        options.add_argument('--disable-cache')

        mobile_emulation = { "deviceName": "Samsung Galaxy S20 Ultra"}
        options.add_experimental_option("mobileEmulation", mobile_emulation)
        service = Service(self.get_chromedriver(),port=self.PORT)
        driver = webdriver.Chrome(service=service, options=options)
        driver.delete_all_cookies()
        driver.set_window_size(400, 8200)
        url='https://m.lguplus.com/'
        driver.get(url)
        driver.implicitly_wait(5)
        
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})") # webdrvier의 속성값을 정의되지 않음으로 변경
        driver.execute_script('window.localStorage.clear()') # localStrorage 캐시 제거
        driver.execute_script('window.sessionStorage.clear()') # 세션 제거
        self.PORT = service.port
        print(f"url : {service.service_url}")
        print(f"session_id : {driver.session_id}")
        Slack.send_slack_server_title()
        return driver