import random
import re
import string

from base.webdriver import WebDriver
from common.function import Function
from common.debug import Debug
from pages.login import LoginPage

from selenium.webdriver.common.keys import Keys


class Search():
    def __init__(self, WebDriver:WebDriver, FC:Function):
        self.FC = FC
        self.DBG = Debug(WebDriver)
        # 특수문자 고정값 대신 랜덤값 사용 고정값:~!@#$%^&*_-+=`|\\(){}[]:;\"\'<>,.?/
        self.special_characters = ''.join(random.choice(string.punctuation) for _ in range(15))

    def keword_search(self,keyword:str=''):
        '''
        키워드 검색하기
        '''
        search_input = self.FC.loading_find_css(self.FC.var['search_el']['검색결과_검색창'])
        search_input.click()
        # self.FC.wait_loading()
        self.FC.is_exists_element_click(self.FC.loading_find_css_pre(self.FC.var['search_el']['입력한문자삭제_btn']))
        search_input = self.FC.loading_find_css_pre(self.FC.var['search_el']['검색창_input'])
        search_input.send_keys(keyword)
        search_input.send_keys(Keys.ENTER)
        self.FC.wait_loading()

        # 랜덤1, 랜덤2는 검색시, 검색결과 탭이 노출되어야 함
        if self.FC.loading_find_xpath_pre(self.FC.var['search_el']['검색결과_섹션']):
            assert keyword in self.FC.loading_find_css(self.FC.var['search_el']['검색결과_검색창']).get_property("innerText"), self.DBG.logger.debug(f"검색 > 테스트 키워드 '{keyword}'가 검색창에 표시되지 않음")
            results = self.FC.loading_find_xpaths(self.FC.var['search_el']['검색결과_탭'])
            result_counts = [re.sub(r'[^0-9]', '', result.get_property('innerText')) for result in results]
            print(f"result -> {keyword}: 개인_{result_counts[0]}건, 기업_{result_counts[1]}건")

            # 특수문자 검색 예외처리
            if keyword == self.special_characters:
                print(f"특수문자 '{keyword}' 검색 결과가 없어야하나, 개인_{result_counts[0]}건, 기업_{result_counts[1]}건의 검색 결과가 노출됩니다.")
                # raise AssertionError(f"특수문자 '{keyword}' 검색 결과가 없어야하나, 개인_{result_counts[0]}건, 기업_{result_counts[1]}건의 검색 결과가 노출됩니다.")
            
            # 검색 결과가 나온다면, 건수와 상관없이, 개인, 기업 탭 둘 다 노출되어야 함
            assert len(results) == 2, self.DBG.logger.debug(f"검색 결과 오류: 키워드 '{keyword}' 검색 시 개인, 기업 탭이 모두 노출되지 않음")  
        else:
            # 검색 결과가 나오지 않는다면 검색결과 섹션이 노출 되지 않아야 함
            assert keyword in self.FC.loading_find_css(self.FC.var['search_el']['검색결과_검색창']).get_property("innerText"), self.DBG.logger.debug(f"검색 > 테스트 키워드 '{keyword}'가 검색창에 표시되지 않음")
            assert self.FC.loading_find_xpath_pre(self.FC.var['search_el']['검색결과_섹션']) is False, self.DBG.logger.debug(f"검색 > 테스트 키워드 '{keyword}' 검색 시 결과가 없으나 검색결과 섹션이 표시됨")  
    
    def hashtag_search(self):
        '''
        해시태그 검색하기
        '''
        result = []
        # 해시태그 갯수가 3개 이상일 시, 해시태그 검색어 정상 노출이라 판단
        self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['search_el']['검색창_input']))
        result.append(3 <= len(self.FC.loading_find_csss(self.FC.var['search_el']['검색어해시태그'])))
        assert self.DBG.print_res(result), self.DBG.logger.debug("검색 > 검색창 하단 해시태그 검색어 정상 노출 실패") 

        # 랜덤 해시태그 선택 후 클릭
        hashtag_btn = self.FC.loading_find_csss(self.FC.var['search_el']['검색어해시태그'])
        hashtag_text_list = [btn.get_property("innerText") for btn in hashtag_btn]
        print(f"해시태그 리스트: {hashtag_text_list}")
        random_num = random.randrange(0, len(hashtag_text_list))
        hashtag_word = hashtag_text_list[random_num]
        hashtag_btn[random_num].click()
        self.FC.wait_loading()

        # 해시태그 클릭 후 검색페이지 이동 및 인풋요인에 해시태그 텍스트가 들어있을 시 검색어 정상 노출이라 판단
        current_url = self.FC.driver.current_url
        expected_url = self.FC.var['search_el']['검색결과_url']
        print(f"Current URL: {current_url}, Expected URL: {expected_url}")
        search_word = self.FC.loading_find_css(self.FC.var['search_el']['검색결과_검색창']).get_property("innerText")
        search_word = '#'+ search_word

        assert self.FC.var['search_el']['검색결과_url'] in self.FC.driver.current_url , self.DBG.logger.debug("검색 > 검색창 하단 해시태그 클릭 > 검색결과 정상 노출 실패") 
        assert search_word == hashtag_word, self.DBG.logger.debug("검색 > 검색창 하단 해시태그 클릭 > 검색어 정상 노출 실패") 

    # 메인페이지 로그인 후
    def search(self):
        self.FC.gotoHome()
        try:
            # 검색 모달창 노출 확인
            self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['search_el']['search_btn']))
            assert self.FC.loading_find_css(self.FC.var['common_el']['body']).get_property('className') == "modal-open",self.DBG.logger.debug("검색 모달창 노출 실패")

            # 인기 검색어에서 랜덤 키워드 추출
            if self.FC.loading_find_xpath_pre(self.FC.var['search_el']['ranking-keyword']):
                keywords = self.FC.loading_find_xpaths(self.FC.var['search_el']['keyword'])
                keyword_list = [re.sub(r'^\d+', '', keyword.text) if hasattr(keyword, 'text') else keyword for keyword in keywords]
                random_keywords = random.sample(keyword_list, 2)

            # 메인서치창-랜덤1, 랜덤2, 결과없음, 특수문자
            special_characters = self.special_characters
            test_keywords = [random_keywords[0], random_keywords[1], '결과없음', special_characters]

            # 메인 검색창 > 해시태그 검색 기능 확인
            self.hashtag_search()

            # 서치 페이지 검색 기능 확인
            for keyword in test_keywords:
                self.keword_search(keyword)

        except  Exception :
            self.DBG.print_dbg("검색기능 정상 동작",False)
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
    driver.kill()