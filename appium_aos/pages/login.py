import os
import sys
import time                                            # 현재 호출하는 함수명 반환 모듈

from base.appdriver import AppDriver
from base.server import AppiumServer
from common.function import Function
from common.debug import Debug
from common.slack import Slack


class LoginPage():

    def __init__(self, AppDriver:AppDriver, fc:Function):
        self.driver = AppDriver.driver
        self.fc = fc
        self.DBG = Debug(AppDriver)

    # U+ 로그인
    # def u_plus_login(self):
    #     self.fc.gotoHome()
    #     try:
    #         uplus_id = os.environ['UPLUS_ID']
    #         uplus_pw = os.environ['UPLUS_PW']

    #         if self.driver.current_url != self.fc.var['login_el']['url']:
    #             self.fc.movepage(self.fc.var['login_el']['login_btn'],address=self.fc.var['login_el']['url'])

    #         self.fc.is_exists_element_click(self.fc.loading_find_css(self.fc.var['login_el']['ID로그인_btn'])) # 간편 로그인 화면 처리
    #         self.fc.is_exists_element_click(self.fc.loading_find_css(self.fc.var['login_el']['uplus_login_img']))

    #         self.fc.modal_ck2() # 결함 DCBGQA-4368

    #         self.fc.is_exists_element_click(self.fc.loading_find_css(self.fc.var['login_el']['uplus_입력한문자삭제']))
    #         self.fc.loading_find_css(self.fc.var['login_el']['uplus_id_input']).send_keys(uplus_id)  # ID 입력
    #         self.fc.move_to_click(self.fc.loading_find_css('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button'))
    #         for _ in range(3):
    #             try:
    #                 if self.fc.loading_find_css('.c-tooltip') == False:
    #                     self.fc.loading_find_css(self.fc.var['login_el']['uplus_pw_input']).send_keys(uplus_pw)
    #                     self.fc.loading_find_css(self.fc.var['login_el']['uplus_login_btn']).click()
    #                     break
    #                 else:
    #                     self.fc.move_to_click(self.fc.loading_find_css('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button'))
    #             except:
    #                 raise Exception('로그인 실패 : tooltip 안사라짐')

    #         self.fc.wait_loading()
    #         time.sleep(3)

    #         # TODO 수정 필요
    #         self.fc.switch_view('NATIVE_APP')
    #         self.fc.is_exists_element_click(self.fc.loading_find_xpath(self.fc.var['common_el']['닫기_버튼']))
    #         self.fc.switch_view()
            
    #         # 유플러스 로그인 후 정상적으로 메인페이지로 이동했는지 확인
    #         assert self.fc.var['common_el']['url'] in self.fc.loading_find_css_pre(self.fc.var['mainpage_el']['개인화']).get_property('baseURI') , self.DBG.logger.debug("u+ ID 로그인 후 메인페이지 이동 실패")
            
    #     except  Exception :
    #         # TODO 수정 필요
    #         self.fc.switch_view('NATIVE_APP')
    #         if self.fc.loading_find_xpath(self.fc.var['common_el']['닫기_버튼']):
    #             self.fc.loading_find_xpath(self.fc.var['common_el']['닫기_버튼']).click()
    #         self.fc.switch_view()
    #         self.DBG.print_dbg("u+ ID 로그인 정상 동작 확인",False)
    #         return False

    #     else :  
    #         self.DBG.print_dbg("u+ ID 로그인 정상 동작 확인")
    #         return True
        
        
    def u_plus_login_retry(self,count,login_type):
        while 0 < count:
            # res = self.u_plus_login()
            res = self.do_login(login_type)
            if res:
                # self.DBG.print_dbg("u+ ID 로그인 정상 동작 확인")
                return True
            else:
                count-=1
                if count <= 0:
                    self.DBG.print_dbg(f"{login_type} 로그인 정상 동작 확인", False)
                    return False
                else:
                    Slack.send_slack_text(log=f"{login_type} 로그인 {count}회 재실행중...", test_result = None)
                    self.driver.refresh()
                    pass
    

    # 로그아웃
    def logout(self):
        self.fc.gotoHome()
        try:                   
            #  FIXME 다른 UI가 로그아웃 버튼을 가려서 클릭이 불가능. excute_script로 클릭
            self.fc.movepage(self.fc.var['login_el']['logout_btn'])      # 로그아웃 버튼 선택
            self.fc.wait_loading()
            assert self.fc.var['common_el']['url'] in self.fc.loading_find_css(self.fc.var['mainpage_el']['KV']).get_property('baseURI'), self.DBG.logger.debug("로그아웃 후 메인페이지 이동 실패")

            self.fc.loading_find_css(self.fc.var['common_el']['메인_메뉴']).click()
            assert "로그인" in self.fc.loading_find_css(self.fc.var['login_el']['login_btn']).get_property('innerText') , self.DBG.logger.debug("정상 로그아웃 실패")
    
        except  Exception as e :
            self.DBG.print_dbg(e, f"로그아웃 정상 동작 확인", False)
            return False

        else :
            self.DBG.print_dbg("로그아웃 정상 동작 확인")
            return True
        

    def do_login(self, login_type:str):
        '''
        U+ID, 카카오, 네이버 로그인
        '''
        self.fc.gotoHome()
        try:
            if self.driver.current_url != self.fc.var['login_el']['url']:
                self.fc.movepage(self.fc.var['login_el']['login_btn'],address=self.fc.var['login_el']['url'])

            self.fc.is_exists_element_click(self.fc.loading_find_css(self.fc.var['login_el']['ID로그인_btn'])) # 간편 로그인 화면 처리
            self.fc.is_exists_element_click(self.fc.loading_find_css(self.fc.var['login_el'][f'{login_type}_login_img']))
            self.fc.wait_loading()
            self.fc.modal_ck2() # 결함 DCBGQA-4368
            
            dict = {
                "uplus" : [os.environ['UPLUS_ID'], os.environ['UPLUS_PW']],
                "kakao" : [],
                "naver" : [],
            }    

            self.fc.is_exists_element_click(self.fc.loading_find_css(self.fc.var['login_el'][f'{login_type}_입력한문자삭제']))
            # self.fc.is_exists_element_click(self.fc.loading_find_css(self.fc.var['login_el'][f'{login_type}_id_저장']))
            self.fc.wait_loading()
            
            self.fc.loading_find_css(self.fc.var['login_el'][f'{login_type}_id_input']).send_keys(dict[login_type][0])

            if login_type == "uplus":
                self.fc.is_exists_element_click(self.fc.loading_find_css('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button'))
                for _ in range(3):
                    try:
                        if self.fc.loading_find_css('.c-tooltip') == False:
                            self.fc.loading_find_css(self.fc.var['login_el'][f'{login_type}_pw_input']).send_keys(dict[login_type][1])
                            break
                        else:
                            self.fc.is_exists_element_click(self.fc.loading_find_css('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button'))

                    except:
                        raise Exception('로그인 실패 : tooltip 처리 실패')
            
            else:
                self.fc.loading_find_css(self.fc.var['login_el'][f'{login_type}_pw_input']).send_keys(dict[login_type][1])
                
            self.fc.again_click(self.fc.loading_find_css(self.fc.var['login_el'][f'{login_type}_login_btn']))

            # # # 유플러스 로그인 후 정상적으로 메인페이지로 이동했는지 확인
            assert self.fc.loading_find_css(self.fc.var['mainpage_el']['KV']).get_property('baseURI') == self.fc.var['common_el']['url'], self.DBG.logger.debug("u+ ID 로그인 후 메인페이지 이동 실패")


        except Exception as e:
            self.DBG.print_dbg(f"{login_type} 로그인 정상 동작",False)
            return False

        else :
            self.DBG.print_dbg(f"{login_type} 로그인 정상 동작")
            return True
        


if __name__ == "__main__":
    
    try:
        server = AppiumServer(4723)
        port = server.appium_service()
        if not server.waiting():
            raise Exception("서버 실행 불가")    
        driver = AppDriver(port=port)
        fc = Function(driver)
        login = LoginPage(driver,fc)

        fc.pre_script()
        fc.chrome_clear()

        if fc.is_login():
            login.logout()
    
        login.u_plus_login()
        login.logout()
        # login.my_lg_login()
        # login.logout()

        # TODO 차후, 로그인 더 추가 필요
        # login.naver_login() 
        # login.logout()
        # login.kakao_login()
        # login.logout()
                    

        driver.driver.quit()
        server.stop()

    except:
        os.system(r'taskkill /f /t /im node.exe')
    