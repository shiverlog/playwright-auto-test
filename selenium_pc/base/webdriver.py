import getpass
import json
import re
import subprocess
import shutil
import time
import platform
import os
from urllib.request import urlretrieve
import urllib3
import requests

import common.variable as var
from common.slack import Slack

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.events import AbstractEventListener


class WebDriver(AbstractEventListener):
    count=0 # 디버그 스크린샷 파일명 연번 static
    mw_port=9222
    def __init__(self):
        self.port=9333
        self.path = self.set_path()
        self.os = platform.system()
        self.driver = self.according_env_setup()
        self.wait = WebDriverWait(self.driver, timeout=3)
        self.driver.delete_all_cookies()
        self.action = ActionChains(self.driver)


    def set_path(self):
        '''
        현재 실행 경로 세팅
        '''
        webdriver_path = os.path.dirname(os.path.abspath(__file__))
        path = os.path.split(webdriver_path)[0]
        os.chdir(path)
        print(f"directory: {path}")
        return path


    @classmethod
    def Counting(cls):
        cls.count=cls.count+1

    @classmethod
    def getCount(cls):
        return cls.count

    def get_os(self):
        return platform.system()

    def according_env_setup(self):
        '''
        OS 환경에 따른 setup 분기
        '''
        if self.os == 'Darwin':
            return self.setup_mac()
        elif self.os == 'Windows':
            # self.download_chromedriver()
            return self.setup_windows()
        else:
            raise Exception("os 환경 추가 필요")

    def path_split(self):
        webdriver_path = os.path.dirname(os.path.abspath(__file__))
        path = os.path.split(webdriver_path)[0]
        os.chdir(path)
        print(f"directory: {path}")
        return path

    def path_split2(self):
        path = os.getcwd()
        if 'selenium_pc' in os.path.split(path)[0]:
            print(f"parent path: {os.path.split(path)[0]}")
            return os.path.split(path)[0]
        else:
            print(f"parent path: {path}")
            return path

    def exit_path(self,path:str):
        '''
        ex) /Users/nam/Downloads/chromedriver-mac-arm64/chromedriver
        '''
        if os.path.exists(path):
            return path
        else:
            raise Exception("경로 오류")

    def set_chrome_driver(self,setting_path="base/setting.json"):
        '''
        user에 따른 옵션 세팅 분기 ['chromeDriver']
        '''
        user = getpass.getuser()
        path = os.path.join(self.path, setting_path)
        chrome_driver = ''
        with open (path,encoding='UTF8') as f:
            data =json.load(f)
            chrome_driver = self.exit_path(data[user]['chromeDriver'])
            f.close()
        return chrome_driver

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
            new_version = requests.get(f"https://googlechromelabs.github.io/chrome-for-testing/LATEST_RELEASE_{current_chrome.split('.')[0]}.{current_chrome.split('.')[1]}.{current_chrome.split('.')[2]}", verify = False)
            new_version = new_version.text
            url = f"https://storage.googleapis.com/chrome-for-testing-public/{new_version}/win64/chromedriver-win64.zip"
            download_name = f'C:\\Users\\{getpass.getuser()}\\Downloads\\new_chrome_driver_{new_version}.zip'
            urlretrieve(url,download_name) # chrome_driver download

            # 압축해제
            set_chromedriver_path = f'C:\\Users\\{getpass.getuser()}\\.wdm\\drivers\\chromedriver\\win32\\{new_version}'
            shutil.unpack_archive(download_name,set_chromedriver_path,'zip')
            self.set_chromedriver(os.path.join(set_chromedriver_path,'chromedriver-win64\\chromedriver.exe'))

    def set_chromedriver(self,set_chromedriver_path):
        '''
        크롬드라이버 세팅 set
        set_chromedriver_path : 설정할 크롬 드라이버 경로
        '''

        user = getpass.getuser()
        path = "base/setting.json"
        with open(path,encoding='UTF-8') as f:
            data=json.load(f)
            f.close()
        with open(path,encoding='UTF-8',mode='w') as f:
            data[user]['chromeDriver'] = set_chromedriver_path
            json.dump(data,f, ensure_ascii=False) #ensure_ascii=False 한글 유니코드 쓰기 방지
            f.close()
            return data[user]['chromeDriver']

    def get_chromedriver(self):
        '''
        크롬드라이버 세팅 get
        '''
        user = getpass.getuser()
        path = "base/setting.json"
        with open(path,encoding='UTF-8') as f:
            data=json.load(f)
            f.close()
        return data[user]['chromeDriver']

    def set_ssl_context(self,setting_path="base/setting.json"):
        '''
        user에 따른 옵션 세팅 분기 ['sslContext']
        '''
        def mac_ssl(self):
            user = getpass.getuser()
            path = os.path.join(self.path, setting_path)
            ssl_context =''
            with open (path,encoding='UTF8') as f:
                data =json.load(f)
                ssl_context = self.exit_path(data[user]['sslContext'])
                f.close()
            return ssl_context

        if self.os == 'Darwin':
            return mac_ssl()
        elif self.os == 'Windows':
            return None
        else:
            raise Exception("os 환경 추가 필요")

    def quit_debugger_chrome(self,test_result:bool):
        '''
        디버거 크롬 종료
        '''
        os.system("ps -acx |grep 'Chrome$' |awk '{print $1}' |xargs kill -9")
        Slack.send_slack_server_result(test_result)
        Slack.send_slack_log_file()

    # def get_chrome_driver(self) -> str|Exception :
    #     '''
    #     크롬 브라우저 경로 설정
    #     '''
    #     with open ('base/chrome_driver.json',encoding='UTF8') as f:
    #         chrome_driver_json=json.load(f)
    #         assert chrome_driver_json[getpass.getuser()]
    #         return chrome_driver_json[getpass.getuser()]

    def setup_mac(self):
        '''
        mac 환경에서 실행하기 위한 setup
        chrome app path(default) : "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
        '''
        profile_u="Default"

        res=subprocess.getstatusoutput(f"ps -acx |grep 'Chrome$'")
        if "ERROR" in res or "not found" in res or ' ' in res:
            pass
        else:
            os.system("ps -acx |grep 'Chrome$' |awk '{print $1}' |xargs kill -9")

        env=os.environ.copy()
        res=subprocess.Popen(f'"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --remote-debugging-port={self.port} --profile-directory="{profile_u}"',shell=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE,env=env)
        if res:
            print("clear")
        else:
            print("already clear")

        print(str(res.returncode))
        print(str(res.args))

        options = Options()
        options.add_experimental_option("debuggerAddress", f"127.0.0.1:{self.port}")

        service = Service(f'{self.chrome_driver}')
        driver = webdriver.Chrome(service=service, options=options)  
        driver.maximize_window() # 브라우저 창 최대화
        url =var.common_el['url']
        driver.get(url)
        driver.implicitly_wait(10)
        cookies = driver.get_cookies()
        driver.delete_all_cookies()
        print(cookies)
        return driver

    #  드라이버 셋팅 함수
    def setup_windows(self):
        '''
        windows 환경 설정
        '''
        taskkill = 'taskkill /IM chrome.exe'
        profile_u = "Default"

        # mw 테스트가 실행중인지 확인
        mw_chromebrowser = None
        try:
            res = subprocess.getstatusoutput(f"netstat -ano |findstr {self.mw_port} |findstr LISTENING")[1]
            print(f" res -> {res}")
            if res != '':
                res = subprocess.getstatusoutput(f"netstat -ano |findstr {self.mw_port} |findstr LISTENING")[1].split()
                print(f" res1 -> {res}")
                res2 = subprocess.getstatusoutput(f"wmic process where (name='chrome.exe' and parentprocessid={int(res[-1])}) get processid")[1].split()
                print(f" res2 -> {res2}")
                mw_chromebrowser=res2[1]
                print(f" mw_chromebrowser -> {mw_chromebrowser}")

            chromebrowser_list = subprocess.getstatusoutput('tasklist |findstr "chrome.exe"')
            print(f" chromebrowser_list -> {chromebrowser_list}")

            if "ERROR" in chromebrowser_list or "not found" in chromebrowser_list:
                pass
            if mw_chromebrowser is not None:
                os.system(f'{taskkill} /FI "PID ne {int(mw_chromebrowser)}"')
            else:
                os.system(f'{taskkill}')
        except ValueError:
            # No Instance(s) Available. -> 실행중인 parencssid가 없음
            mw_chromebrowser = None
            os.system(f'{taskkill}')
            pass
        time.sleep(3) # 크롬 브라우저 kill 직후 실행 시, 포트 지정 사이드로 잠시 대기 후 실행


        res=os.system(f'start C:\\"Program Files"\Google\Chrome\Application\chrome.exe --remote-debugging-port={self.port} --profile-directory="{profile_u}" --no-first-run --no-default-browser-check --ash-no-nudges')
        if res:
            print("clear")
        else:
            print("already clear")

        options = Options()
        options.add_experimental_option("debuggerAddress", f"127.0.0.1:{self.port}")
        service = Service(f'{self.get_chromedriver()}')

        driver = webdriver.Chrome(service=service, options=options)
        driver.maximize_window()
        url = var.common_el['url']
        driver.get(url)
        driver.implicitly_wait(10)
        self.port = service.port
        Slack.send_slack_server_title()
        return driver
