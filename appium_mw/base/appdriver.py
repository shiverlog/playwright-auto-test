import getpass
import os
import re
import json
import shutil
import subprocess
from urllib.request import urlretrieve
import urllib3
import requests

from appium import webdriver
from appium.options.android import UiAutomator2Options

from selenium.webdriver.support.ui import WebDriverWait     # WEB 시간대기 모듈
from selenium.webdriver.common.action_chains import ActionChains #WEB 액션


class AppDriver():
    count=0 # 디버그 스크린샷 파일명 연번 static

    def __init__(self,port:int|str=4723,device_name:str='Z_FLIP4_삼성인터넷'):
        self.port = port
        self.device_name = device_name
        self.path = self.path_split()
        self.download_chromedriver()
        self.option = self.set_options(device_name)
        self.driver = self.remote_aos(port,self.option)
        self.udid=self.option['appium:options']['udid']
        # self.timeout = 7
        self.timeout = 1
        self.wait = WebDriverWait(self.driver, timeout=self.timeout)
        self.action = ActionChains(self.driver)
        self.driver.implicitly_wait(2)

    def createNewSession(self):
        befo ={}
        befo['port']=self.port
        befo['device_name']=self.device_name
        print("createNewSession-------------------------------------------")
        print(befo['port'])
        print(befo['device_name'])
        print(self.driver.session_id)
        print("-----------------------------------------------------------")
        self.__init__(befo['port'],befo['device_name'])     
        print("createNewSession-------------------------------------------")
        print(befo['port'])
        print(befo['device_name'])
        print(self.driver.session_id)
        self.driver.se
        print("-----------------------------------------------------------")

        
    @classmethod
    def Counting(cls):
        cls.count=cls.count+1
        
    @classmethod
    def getCount(cls):
        return cls.count

    def path_split(self):
        path = os.getcwd()
        if 'appium_aos' in os.path.split(path)[0]:
            print(f"parent path: {os.path.split(path)[0]}")
            return os.path.split(path)[0]
        else: 
            print(f"parent path: {path}")
            return path

    def download_chromedriver(self):
        '''
        현재 크롬 버전과, chromeDriver 버전이 상이할 때, 다운로드
        '''
        # 연결된 안드로이드에서 사용중인 webview package 확인
        cmd = 'adb shell settings get global webview_provider'
        output = subprocess.check_output(cmd, shell=True).decode('utf-8')
        output = output.strip()
        print(f"{output}")
        cmd = f'adb shell dumpsys package {output} | findstr "versionName"'
        output = subprocess.check_output(cmd, shell=True).decode('utf-8')
        output = output.strip().split('=')[1]
        print(f"{output}")

        # 정규표현식을 사용하여 버전 번호 추출
        # version =  output.split('=')[1]
        # version =  self.option['chromedriverExecutable']
        version = re.match(r'^\d{3}\.\d{1}\.\d{4}\.\d+$', output)
        if version:
            current_chrome = version.group()
        else:
            current_chrome = "버전 정보를 찾을 수 없습니다."

        # 000(1).0(2).0000(3).000(4) 버전이 (3)까지 동일하면 다운로드 X 
        chromedriver = self.get_chrome_driver()
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
            self.set_chrome_driver(os.path.join(set_chromedriver_path,'chromedriver-win64\\chromedriver.exe'))

            print(f"최종 크롬 드라이버: {self.get_chrome_driver()}")    
            return
        
    def set_chrome_driver(self,path:str):
        with open('base/devices.json',encoding='UTF8') as f:
            devices=json.load(f)
            f.close()
        # with open('base/devices.json',encoding='UTF8',mode='w') as f:
        with open('base/devices.json',encoding='UTF8',mode='w') as f:
            devices['common']['chromedriverExecutable'] = path
            json.dump(devices,f,ensure_ascii=False) # ensure_ascii=False 한글 유니코드 쓰기 방지
            f.close()
            return devices['common']['chromedriverExecutable']

    def get_chrome_driver(self):
        with open('base/devices.json',encoding='UTF8') as f:
            devices=json.load(f)
            assert devices['common']['chromedriverExecutable']
            f.close()
            return devices['common']['chromedriverExecutable']
        
        
    def exit_chrome_driver(self,chrome_driver_path:str):
        '''
        chrome_driver_path: C:\\Users\\{user_name} 기준 chromedriver.exe 상대 경로
        
        ex) .wdm\\drivers\\chromedriver\\win32\\102.0.5005.61\\chromedriver.exe'
        '''
        print(chrome_driver_path.replace('/','\\'))
        chrome_driver_path = chrome_driver_path.replace('/','\\') 
        user_name=getpass.getuser()
        user_path=f"C:\\Users\\{user_name}"
        path=os.path.join(user_path,chrome_driver_path) 
        if os.path.exists(path):
            return path
        else:
            raise Exception(f"크롬드라이버 경로 오류 : {path}")

    def exit_app(self,app_path):
        '''
        app_path: /appium_aos 기준 chromedriver.exe 상대 경로
        
        ex) mobileCS_release_v6.0.33(337)_20240205_1537.apk
        '''
        if app_path.startswith('C:'):
            path = app_path 
        else:
            path=os.path.join(self.path,app_path) 
        if os.path.exists(path):
            return path
        else:
            raise Exception("앱 경로 오류")
        
        
    # def set_options(self,device_name:str,devices_path="base\\devices.json"):
    #     '''
    #     ['app'], ['chromedriverExecutable'] 옵션 추가
    #     '''
        
    #     path = os.path.join(self.path, devices_path)

    #     option = {}
    #     with open (path,encoding='UTF8') as f:
    #         data =json.load(f)
    #         common = data["common"]
    #         device_opt = data[device_name]['appium:options']

    #         app_path = self.exit_app(common['app']) 
    #         if 'app' not in device_opt:
    #             device_opt['app']=""
    #         device_opt['app']=app_path


    #         chrome_path = self.exit_chrome_driver(common['chromedriverExecutable'])
    #         # print(chrome_path)
    #         if 'chromedriverExecutable' not in device_opt:
    #             device_opt['chromedriverExecutable']=""
    #         device_opt['chromedriverExecutable']=chrome_path

    #         option = data[device_name]
    #         f.close()
    #     return option
        
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
            chrome_path = self.exit_chrome_driver(common['chromedriverExecutable'])
            if 'chromedriverExecutable' not in device_opt:
                device_opt['chromedriverExecutable']=""
            device_opt['chromedriverExecutable']=chrome_path

            option = data[device_name]
            f.close()
        return option
         

    # 객체 파라미터는 해당 링크 참조 https://appium.io/docs/en/writing-running-appium/server-args/
    def remote_aos(self,port:int|str,device:dict):
        print("--"*20)
        print(device)
        print("--"*20)
        options=UiAutomator2Options().load_capabilities(device)

        # options.page_load_strategy="eager"
        # options.set_capability("pageLoadStrategy","eager")
        driver=webdriver.Remote(f'http://127.0.0.1:{str(port)}',options=options,direct_connection=True)
        if driver is not None:
            print("-"*15+" Appium Remote AOS Devices "+"-"*15)
        else:
            raise BaseException("-"*15+" Appium Remote AOS Devices Error "+"-"*15)

        return driver

