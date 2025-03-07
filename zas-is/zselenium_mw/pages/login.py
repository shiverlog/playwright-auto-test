import os
import time
import traceback

from base.webdriver import WebDriver
from common.function import Function
from common.debug import Debug
from common.slack import Slack

class LoginPage():
    def __init__(self,WebDriver:WebDriver,FC:Function):
        self.FC=FC
        self.DBG=Debug(WebDriver)
        
    # def u_plus_login(self):
    #     '''
    #     u+ ID로 로그인
    #     '''
    #     self.FC.gotoHome()
    #     try:
    #         self.FC.movepage(self.FC.var['login_el']['login_btn'],address=self.FC.var['login_el']['login_url'])
    #         uplus_id = os.environ['UPLUS_ID']
    #         uplus_pw = os.environ['UPLUS_PW']
    #         self.FC.wait_loading()
    #         self.FC.loading_find_css(self.FC.var['login_el']['uplus_login_img']).get_property('parentElement').click()
    #         self.FC.wait_loading()
    #         self.FC.loading_find_xpath(self.FC.var['login_el']['uplus_id_저장']).click()
    #         if self.FC.loading_find_css(self.FC.var['login_el']['uplus_입력한문자삭제']):
    #             self.FC.loading_find_css(self.FC.var['login_el']['uplus_입력한문자삭제']).click()
                
    #         self.FC.loading_find_css(self.FC.var['login_el']['uplus_id_input+ID']).send_keys(uplus_id)
    #         self.FC.move_to_click(self.FC.loading_find_css('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button'))
    #         for _ in range(3):
    #             try:
    #                 if self.FC.loading_find_css('.c-tooltip') == False:
    #                     self.FC.loading_find_css(self.FC.var['login_el']['uplus_pw_input']).send_keys(uplus_pw)
    #                     self.FC.loading_find_css(self.FC.var['login_el']['uplus_login_btn']).click()
    #                     break
    #                 else:
    #                     self.FC.move_to_click(self.FC.loading_find_css('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button'))
    #             except:
    #                 raise Exception('로그인 실패 : tooltip 처리 실패')

    #         self.FC.wait_loading()
    #         # # # 유플러스 로그인 후 정상적으로 메인페이지로 이동했는지 확인
    #         assert self.FC.loading_find_css(self.FC.var['mainpage_el']['KV']).get_property('baseURI') == self.FC.var['common_el']['home_url'], self.DBG.logger.debug("u+ ID 로그인 후 메인페이지 이동 실패")

    #     except Exception as e:
    #         self.DBG.print_dbg("u+ ID 로그인 정상 동작",False)
    #         return False

    #     else :
    #         self.DBG.print_dbg("u+ ID 로그인 정상 동작")
    #         return True
        
    def u_plus_login_retry(self, max_retries, login_type):
        for retry_count in range(max_retries):
            # 로그인 시도
            res = self.do_login(login_type)  
            if res:
                # 로그인 성공 시 바로 True 반환
                return True
            else:
                if retry_count < max_retries - 1:
                    # 로그인 실패 후 재시도
                    self.DBG.print_dbg(f"{login_type} 로그인 실패하여 {max_retries - retry_count - 1}회 재시도 중")
                    continue
                    
        # 모든 시도 후 실패하면 False 반환
        self.DBG.print_dbg(f"{login_type} 로그인 {max_retries}회 모두 실패", False)
        return False

    def logout(self):
        '''
        로그아웃
        '''
        self.FC.gotoHome()
        try:                   
            self.FC.movepage(self.FC.var['login_el']['logout_btn'],address=self.FC.var['common_el']['home_url'])
            self.FC.wait_loading()
            assert self.FC.loading_find_css(self.FC.var['mainpage_el']['KV']).get_property('baseURI') == self.FC.var['common_el']['home_url'], self.DBG.logger.debug("로그아웃 후 메인페이지 이동 실패")
            self.FC.loading_find_css(self.FC.var['common_el']['메뉴_버튼']).click()
            assert "로그인" in self.FC.loading_find_css(self.FC.var['login_el']['login_btn']).get_property('innerText') , self.DBG.logger.debug("정상 로그아웃 실패")
    
        except  Exception :
            self.DBG.print_dbg("로그아웃 정상 동작 확인",False)
            pass

        else :
            self.DBG.print_dbg("로그아웃 정상 동작 확인")

    def do_login(self, login_type:str):
        '''
        U+ID, 카카오, 네이버 로그인
        '''
        self.FC.gotoHome()
        self.FC.wait_loading()
        
        try:
            self.FC.movepage(self.FC.var['login_el']['login_btn'],address=self.FC.var['login_el']['login_url'])
            self.FC.wait_loading()
            dict = {
                "uplus" : [os.environ['UPLUS_ID'], os.environ['UPLUS_PW']],
                "kakao" : [],
                "naver" : [],
            }

            self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_login_img']).get_property('parentElement').click()
            self.FC.wait_loading()                
            
            if login_type == "uplus":
                self.FC.is_exists_element_click(self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_입력한문자삭제']))
                self.FC.is_exists_element_click(self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_id_저장']))
                self.FC.wait_loading()

                self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_id_input']).send_keys(dict[login_type][0])
                self.FC.is_exists_element_click(self.FC.loading_find_css('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button'))
                for _ in range(3):
                    try:
                        if self.FC.loading_find_css('.c-tooltip') == False:
                            self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_pw_input']).send_keys(dict[login_type][1])
                            break
                        else:
                            self.FC.move_to_click(self.FC.loading_find_css('.c-ttp-inner .item:nth-of-type(1) .nm-tooltip-button'))
                    except:
                        raise Exception('로그인 실패 : tooltip 처리 실패')
            
            elif login_type == "naver":
                self.FC.is_exists_element_click(self.FC.loading_find_css('#scm\.selectCancel'))

                self.FC.is_exists_element_click(self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_입력한문자삭제']))
                self.FC.is_exists_element_click(self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_id_저장']))
                self.FC.wait_loading()

                self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_id_input']).send_keys(dict[login_type][0])
                self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_pw_input']).send_keys(dict[login_type][1])
                
            self.FC.again_click(self.FC.loading_find_css(self.FC.var['login_el'][f'{login_type}_login_btn']))

            # # # 유플러스 로그인 후 정상적으로 메인페이지로 이동했는지 확인
            assert self.FC.loading_find_css(self.FC.var['mainpage_el']['KV']).get_property('baseURI') == self.FC.var['common_el']['home_url'], self.DBG.logger.debug("u+ ID 로그인 후 메인페이지 이동 실패")

        except Exception as e:
            self.DBG.print_dbg(f"{login_type} 로그인 정상 동작",False)
            return False

        else :
            self.DBG.print_dbg(f"{login_type} 로그인 정상 동작")
            return True
        


if __name__ == "__main__":
    driver = WebDriver()
    fc = Function(driver)
    login = LoginPage(driver,fc)

    if login.FC.is_login():
        login.logout()
    
    login.u_plus_login()
    login.logout()
    login.my_lg_id()
    login.logout()

    # TODO 차후, 로그인 더 추가 필요
    # login.naver_login() 
    # login.logout()
    # login.kakao_login()
    # login.logout()

    driver.driver.quit()
    driver.kill()