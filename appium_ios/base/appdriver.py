import json
import os
from appium import webdriver
# from appium.webdriver.appium_service import AppiumService
# import uiautomator2 as u2
from appium.options.android import UiAutomator2Options
from appium.options.ios import XCUITestOptions
# from appium.webdriver.appium_service import AppiumService
# from appium.webdriver.common.appiumby import AppiumBy
from appium.webdriver.common.touch_action import TouchAction

from selenium.webdriver.support.ui import WebDriverWait     # WEB 시간대기 모듈
from selenium.webdriver.common.action_chains import ActionChains #WEB 액션
# from selenium.webdriver.chrome.webdriver import WebDriver

from selenium.webdriver.common.actions.action_builder import ActionBuilder
from selenium.webdriver.common.actions.pointer_input import PointerInput
# from selenium.webdriver.common.actions.interaction import POINTER_TOUCH
# from selenium.webdriver.common.actions.interaction import POINTER_MOUSE

from selenium.webdriver.common.actions import interaction
from selenium.webdriver.common.actions.action_builder import ActionBuilder
# from selenium.webdriver.support import expected_conditions as EC




class AppDriver():
    count=0 # 디버그 스크린샷 파일명 연번 static

    def __init__(self,port:str|int=4723,ts='',device:str='iPhone_12_pro_max'):
        self.path=self.path_split()
        self.option=self.set_options(device)
        self.driver = self.remote_ios(port,self.option)              # 드라이버 셋팅 
        self.udid=self.option['appium:options']['udid']
        self.timeout=1.6
        self.wait = WebDriverWait(self.driver, timeout=self.timeout)
        self.app_action = TouchAction(self.driver)#스크롤/스와이프 액션 객체
        self.action =  ActionChains(self.driver) #스크롤/스와이프 액션 객체
        self.action.w3c_actions= ActionBuilder(self.driver, mouse=PointerInput(interaction.POINTER_TOUCH, "touch"))
        self.server_thread_ts=ts
        # self.action.w3c_actions= ActionBuilder(self.driver, mouse=PointerInput(POINTER_MOUSE, "mouse"))


    # def __init__(self,PORT:str|int,DEVICE:dict,UDID:str):
    #     self.driver = self.remote_ios(PORT,DEVICE)              # 드라이버 셋팅 
    #     self.udid=UDID
    #     self.timeout=5
    #     self.wait = WebDriverWait(self.driver, timeout=self.timeout)
    #     self.app_action = TouchAction(self.driver)#스크롤/스와이프 액션 객체
    #     self.action =  ActionChains(self.driver) #스크롤/스와이프 액션 객체
    #     self.action.w3c_actions= ActionBuilder(self.driver, mouse=PointerInput(interaction.POINTER_TOUCH, "touch"))
    #     # self.action.w3c_actions= ActionBuilder(self.driver, mouse=PointerInput(POINTER_MOUSE, "mouse"))

    @classmethod
    def setActionChain(cls,driver):
        cls.action=ActionChains(driver)

    @classmethod
    def Counting(cls):
        cls.count=cls.count+1
        
    @classmethod
    def getCount(cls):
        return cls.count

    def create_ios_driver(self,custom_opts = None):    
        options = XCUITestOptions()
        options.platformVersion = '13.4'
        options.udid = '123456789ABC'
        if custom_opts is not None:
            options.load_capabilities(custom_opts)
        # Appium1 points to http://127.0.0.1:4723/wd/hub by default
        return webdriver.Remote(f'http://{APPIUM_HOST}:{APPIUM_PORT}', options=options)

    def create_android_driver(self,custom_opts = None):    
        options = UiAutomator2Options()
        options.platformVersion = '10'
        options.udid = '123456789ABC'
        if custom_opts is not None:
            options.load_capabilities(custom_opts)
        # Appium1 points to http://127.0.0.1:4723/wd/hub by default
        return webdriver.Remote(f'http://{APPIUM_HOST}:{APPIUM_PORT}', options=options)

    def path_split(self):
        path = os.getcwd()
        if 'appium_ios' in os.path.split(path)[0]:
            print(f"parent path: {os.path.split(path)[0]}")
            return os.path.split(path)[0]
        else:
            print(f"parent path: {path}")
            return path
        
    def set_options(self,device_name:str,devices_path="base/devices.json"):
        '''
        ['bundleId'],['xcodeOrgId'] 옵션 추가
        '''
        path = os.path.join(self.path,devices_path)

        option = {}
        with open (path,encoding='UTF8') as f:
            data = json.load(f)
            common = data['common']
            device_opt = data[device_name]['appium:options']

            if 'bundleId' not in device_opt:
                device_opt['bundleId'] =""
            device_opt['bundleId']=common['bundleId']

            if 'xcodeOrgId' not in device_opt:
                device_opt['xcodeOrgId'] =""
            device_opt['xcodeOrgId']=common['xcodeOrgId']

            option = data[device_name]
            f.close()

        return option

    # 객체 파라미터는 해당 링크 참조 https://appium.io/docs/en/writing-running-appium/server-args/
    def remote_ios(self,port:str,option:dict):
        print(f"bundleId -> {option['appium:options']['bundleId']}")
        options=XCUITestOptions().load_capabilities(option)
        driver=webdriver.Remote(f'http://127.0.0.1:{port}',options=options,direct_connection=True)
        if driver is not None:
            print("-"*15+" Appium Remote IOS Devices "+"-"*15)
        else:
            raise BaseException("-"*15+" Appium Remote IOS Devices Error "+"-"*15)
        driver.implicitly_wait(1.5)
      

        return driver
