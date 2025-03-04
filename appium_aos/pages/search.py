import sys
import random

from selenium.webdriver.common.keys import Keys

from base.appdriver import AppDriver
from common.function import Function
from common.debug import Debug
from pages.login import LoginPage

sys.path.append('C:\dev\lg_regression\selenium_mw')


class Search():
    def __init__(self,AppDriver:AppDriver,FC:Function):
        self.FC=FC
        self.DBG=Debug(AppDriver)

    def searching(self,keyword:str=''):
        '''
        키워드 검색하기
        keyword: 검색할 키워드
        '''
        # TODO 수정 필요
        search_input=self.FC.loading_find_css_pre(self.FC.var['search_el']['검색결과_검색창'])
        search_input.click()
        self.FC.wait_loading()
        self.FC.is_exists_element_click(self.FC.loading_find_css_pre(self.FC.var['search_el']['입력한문자삭제_btn']))
        search_input=self.FC.loading_find_css_pre(self.FC.var['search_el']['검색창_input'])
        search_input.send_keys(keyword)
        search_input.send_keys(Keys.ENTER)
        self.FC.wait_loading()


    # 메인페이지 로그인 후
    def search(self):
        self.FC.gotoHome()
        try:
            result=[]
            self.FC.loading_find_css(self.FC.var['search_el']['search_btn']).click()
            self.FC.wait_loading()
            assert self.FC.loading_find_css_pre(self.FC.var['common_el']['body']).get_property('className') == "modal-open",self.DBG.logger.debug("검색 모달창 노출 실패")

            # 검색창 초기진입 팝업
            # 해시태그 검색
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['search_el']['검색창_input']))
            result.append(3 < len(self.FC.loading_find_csss(self.FC.var['search_el']['검색어해시태그'])))
            assert self.DBG.print_res(result), self.DBG.logger.debug("검색 > 검색창 하단 해시태그 검색어 정상 노출 실패") 

            hashtag_btn_list = self.FC.loading_find_csss(self.FC.var['search_el']['검색어해시태그'])
            random_num=random.randrange(0,len(hashtag_btn_list))   
            hashtag_word = hashtag_btn_list[random_num].get_property("innerText")
            hashtag_btn_list[random_num].click()
            self.FC.wait_loading()
            search_word = self.FC.loading_find_css(self.FC.var['search_el']['검색결과_검색창']).get_property("innerText")
            search_word = '#'+ search_word
            assert self.FC.var['search_el']['검색결과_url'] in self.FC.driver.current_url , self.DBG.logger.debug("검색 > 검색창 하단 해시태그 클릭 > 검색결과 정상 노출 실패") 
            assert search_word == hashtag_word, self.DBG.logger.debug("검색 > 검색창 하단 해시태그 클릭 > 검색어 정상 노출 실패") 

            # 검색결과 있음, 검색결과 없음, 특수문자 검색
            test_keywords = ['테스트','결과없음','~!@#$%^&*_-+=`|\(){}[]:;\"\'<>,.?/']
            for keyword in test_keywords:
                self.searching(keyword)
                assert keyword in self.FC.loading_find_css(self.FC.var['search_el']['검색결과_검색창']).get_property("innerText") , self.DBG.logger.debug(f"검색 > 테스트 키워드:'{keyword}' 정상 노출 확인 실패")

        except  Exception :
            self.DBG.print_dbg("검색기능 정상 동작",False)
            return False

        else :
            self.DBG.print_dbg("검색기능 정상 동작")
            return True

if __name__ == "__main__":
    driver = AppDriver()
    fc = Function(driver)
    main = Search(driver,fc)
    login = LoginPage(driver,fc)

    if fc.is_login():
        login.logout()
    
    login.u_plus_login()
    

    main.search()

    driver.driver.quit()
    driver.kill()
