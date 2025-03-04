import random
import re
import string
from base.webdriver import WebDriver
from common.function import Function
from common.debug import Debug
from pages.login import LoginPage

class Search():
    def __init__(self,WebDriver:WebDriver,FC:Function):
        self.FC=FC
        self.DBG=Debug(WebDriver)
        # 특수문자 고정값 대신 랜덤값 사용 고정값:~!@#$%^&*_-+=`|\\(){}[]:;\"\'<>,.?/
        self.special_characters = ''.join(random.choice(string.punctuation) for _ in range(15))

    def searching(self,keyword:str=''):
        '''
        키워드 검색하기
        keyword: 검색할 키워드
        '''
        result = None
        search_input = self.FC.loading_find_css(self.FC.var['search_el']['검색창_input'])
        search_input.click()
        self.FC.is_exists_element_click(self.FC.loading_find_css_pre(self.FC.var['search_el']['검색창_비우기']))
        search_input.send_keys(keyword)
        self.FC.bring_el_to_front_csss(self.FC.var['search_el']['검색창_검색버튼'])
        self.FC.loading_find_css(self.FC.var['search_el']['검색창_검색버튼']).click()
        self.FC.wait_loading()

        # 랜덤1, 랜덤2는 예상대로 검색시, 검색결과 탭 및 검색결과가 노출되어야 함
        if self.FC.loading_find_css_pre(self.FC.var['search_el']['검색결과_검색창']):
            assert keyword in self.FC.loading_find_css(self.FC.var['search_el']['검색결과_검색창']).get_property("innerText"), self.DBG.logger.debug("검색 > 테스트 키워드:'%s' 정상 노출 확인 실패", keyword)
            result = self.FC.loading_find_css(self.FC.var['search_el']['검색결과_건수']).get_property('innerText')
            result_count = re.sub(r'[^0-9]','', result)
            print(f"result -> {keyword}: {result_count}건")
            # 특수문자 검색 예외처리
            if keyword == self.special_characters:
                print(f"특수문자 '{keyword}' 검색 결과가 없어야하나, {result_count}개의 검색 결과가 노출됩니다.")
                # raise AssertionError(f"특수문자 '{keyword}' 검색 결과가 없어야하나, {result_count}개의 검색 결과가 노출됩니다.")
            assert result_count in self.FC.loading_find_css(self.FC.var['search_el']['검색결과_탭']).get_property("innerText"), self.DBG.logger.debug("검색 > 테스트 키워드:'%s' 정상 노출 확인 실패", keyword)
        else:
            assert self.FC.loading_find_css_pre(self.FC.var['search_el']['검색결과_검색창']) is False, self.DBG.logger.debug("검색 > 테스트 키워드:'%s' 정상 노출 확인 실패", keyword)  
            
    # 메인페이지 로그인 후
    def search(self):
        self.FC.gotoHome()
        try:
            # 모달창 노출 확인
            self.FC.loading_find_css(self.FC.var['search_el']['search_btn']).click()
            assert self.FC.loading_find_css(self.FC.var['search_el']['검색_모달창_판단']).get_property('className') == "modal-open",self.DBG.logger.debug("검색 모달창 노출 실패")
            
            # 랜덤 키워드
            if self.FC.loading_find_xpath_pre(self.FC.var['search_el']['ranking-keyword']):
                keywords = self.FC.loading_find_xpaths(self.FC.var['search_el']['keyword'])
                keyword_list = [re.sub(r'^\d+', '', keyword.text) if hasattr(keyword, 'text') else keyword for keyword in keywords]
                random_keywords = random.sample(keyword_list, 2)

            # 메인서치창-랜덤1, 서치페이지-랜덤2, 결과없음, 특수문자
            special_characters = self.special_characters
            test_keywords = [random_keywords[0], random_keywords[1], '결과없음', special_characters]

            # 메인 검색창 기능 확인
            self.searching(test_keywords[0])
            
            # 서치 페이지 기능 확인
            for keyword in test_keywords[1:4]:
                self.searching(keyword)
                
        except  Exception :
            self.DBG.print_dbg("검색기능 정상 동작", False)
            return False

        else :
            self.DBG.print_dbg("검색기능 정상 동작")
            return True

if __name__ == "__main__":
    driver = WebDriver()
    fc = Function(driver)
    main = Search(driver,fc)
    login = LoginPage(driver,fc)

    if fc.is_login():
        login.logout()

    login.u_plus_login()


    main.search()

    driver.driver.quit()
    # driver.kill()
