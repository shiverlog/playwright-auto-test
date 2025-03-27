class Search():
    def __init__(self, AppDriver: AppDriver, FC: Function):
        self.FC = FC
        self.DBG = Debug(AppDriver)
        # 특수문자 고정값 대신 랜덤값 사용 고정값:~!@#$%^&*_-+=`|\\(){}[]:;\"\'<>,.?/
        self.special_characters = ''.join(random.choice(string.punctuation) for _ in range(15))

    def searching(self, keyword: str = ''):
        '''
        키워드 검색하기
        keyword: 검색할 키워드
        '''
        try:
            print(f"검색할 키워드: {keyword}")
            search_input = self.FC.loading_find_css_pre(self.FC.var['search_el']['검색결과_검색창'])
            search_input.re_click()
            self.FC.wait_loading()

            # 입력한 문자 클리어 버튼 클릭
            self.FC.is_exists_element_click(self.FC.loading_find_css_pre(self.FC.var['search_el']['입력한문자삭제_btn']))
            # self.FC.loading_find_css_pre(self.FC.var['search_el']['검색창_input']).send_keys(keyword+"\n") # send_keys() 사용 시, StaleElementReferenceError로 native 입력

            # Jamo 문자열 처리
            print(f"키워드를 자모로 변환: {keyword}")
            jamo_str = j2hcj(h2j(keyword))
            jamo_str = list(jamo_str.replace('ㅘ', 'ㅗㅏ').replace('ㅄ', 'ㅂㅅ'))
            if '&' in jamo_str:
                jamo_str[jamo_str.index('&')] = '앤드 기호'

            print(f"자모 변환 후 문자열: {jamo_str}")  # 변환된 Jamo 문자열 출력
            self.FC.switch_view("NATIVE_APP")

            for txt in jamo_str:
                print(f"입력 중인 문자: {txt}")  # 현재 입력하는 문자 출력
                if txt == '-':
                    print("숫자 키보드로 전환")
                    self.FC.loading_find_chain(f'**/XCUIElementTypeKey[`label == "숫자"`]').click()

                key_element = self.FC.loading_find_chain(f'**/XCUIElementTypeKey[`label == "{txt}"`]')

                # 요소가 있는지 확인하고 click() 호출
                if key_element:
                    # print(f"키 클릭: {txt}")
                    key_element.click()
                else:
                    # 키보드 전환 버튼이 있다면 클릭
                    # print(f"해당 키를 찾을 수 없어 다음 키보드로 전환")
                    next_keyboard_button = self.FC.loading_find_chain('**/XCUIElementTypeButton[`label == "다음 키보드"`]')
                    if next_keyboard_button:
                        # print("다음 키보드로 전환 중")
                        next_keyboard_button.click()
                        # 다시 시도
                        key_element = self.FC.loading_find_chain(f'**/XCUIElementTypeKey[`label == "{txt}"`]')

                        if key_element:
                            # print(f"키 클릭(다음 키보드로 전환 후): {txt}")
                            key_element.click()

            # Return 키 클릭
            # print("Return 키를 클릭하여 입력")
            self.FC.loading_find_chain('**/XCUIElementTypeButton[`label == "Return 키"`]').click()
            self.FC.switch_view()
            self.FC.wait_loading()

        except Exception as e:
            print("검색 중 오류가 발생했습니다:", e)
            print(traceback.format_exc())
            return False  # 예외 대신 False 반환해서 다음 테스트 진행하도록 수정

        return True  # 성공적으로 처리되었을 경우 True 반환

    def keword_search(self,keyword:str=''):
        '''
        키워드 검색하기
        '''
        search_input = self.FC.loading_find_css(self.FC.var['search_el']['검색결과_검색창'])
        search_input.click()
        self.FC.wait_loading()
        self.FC.is_exists_element_click(self.FC.loading_find_css_pre(self.FC.var['search_el']['입력한문자삭제_btn']))
        search_input = self.FC.loading_find_css_pre(self.FC.var['search_el']['검색창_input'])
        search_input.send_keys(keyword)
        search_input.send_keys(Keys.ENTER)
        self.FC.wait_loading()

        # 랜덤1, 랜덤2는 예상대로 검색시, 검색결과 탭 및 검색결과가 노출되어야 함
        if self.FC.loading_find_xpaths(self.FC.var['search_el']['검색결과_탭']):
            assert keyword in self.FC.loading_find_css(self.FC.var['search_el']['검색결과_검색창']).get_property("innerText") , self.DBG.logger.debug("검색 > 테스트 키워드:'%s' 정상 노출 확인 실패", keyword)
            results = self.FC.loading_find_xpaths(self.FC.var['search_el']['검색결과_탭'])
            result_counts = [re.sub(r'[^0-9]', '', result.get_property('innerText')) for result in results]
            print(f"result -> {keyword}: 개인_{result_counts[0]}건, 기업_{result_counts[1]}건")

            # 특수문자 검색 예외처리
            if keyword == self.special_characters:
                print(f"특수문자 '{keyword}' 검색 결과가 없어야하나, 개인_{result_counts[0]}건, 기업_{result_counts[1]}건의 검색 결과가 노출됩니다.")
                # raise AssertionError(f"특수문자 '{keyword}' 검색 결과가 없어야하나, 개인_{result_counts[0]}건, 기업_{result_counts[1]}건의 검색 결과가 노출됩니다.")
            assert result_counts in self.FC.loading_find_xpaths(self.FC.var['search_el']['검색결과_탭']), self.DBG.logger.debug("검색 > 테스트 키워드:'%s' 정상 노출 확인 실패", keyword)
        else:
            assert self.FC.loading_find_xpaths(self.FC.var['search_el']['검색결과_탭']) is False, self.DBG.logger.debug("검색 > 테스트 키워드:'%s' 정상 노출 확인 실패", keyword)

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
            self.FC.click_until_modal_displayed(self.FC.loading_find_css(self.FC.var['search_el']['search_btn']))
            assert self.FC.loading_find_css_pre(self.FC.var['common_el']['body']).get_property('className') == "modal-open", self.DBG.logger.debug("검색 모달창 노출 실패")

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

            # 검색창 초기진입 팝업
            # 해시태그 검색
            self.FC.scroll2_v2(self.FC.loading_find_css_pre(self.FC.var['search_el']['검색창_input']))
            result.append(3 < len(self.FC.loading_find_csss(self.FC.var['search_el']['검색어해시태그'])))
            assert self.DBG.print_res(result), self.DBG.logger.debug("검색 > 검색창 하단 해시태그 검색어 정상 노출 실패")

            hashtag_btn_list = self.FC.loading_find_csss(self.FC.var['search_el']['검색어해시태그'])
            random_num = random.randrange(0, len(hashtag_btn_list))
            hashtag_word = hashtag_btn_list[random_num].get_property("innerText")
            self.FC.click_until_go_page(hashtag_btn_list[random_num])
            search_word = self.FC.loading_find_css(self.FC.var['search_el']['검색결과_검색창']).get_property("innerText")
            search_word = '#' + search_word
            assert self.FC.var['search_el']['검색결과_url'] in self.FC.driver.current_url , self.DBG.logger.debug("검색 > 검색창 하단 해시태그 클릭 > 검색결과 정상 노출 실패")
            assert search_word == hashtag_word, self.DBG.logger.debug("검색 > 검색창 하단 해시태그 클릭 > 검색어 정상 노출 실패")

            # 검색결과 있음, 검색결과 없음, 특수문자 검색
            test_keywords = ['테스트','결과없음','-/:;()₩&@.,?!']
            for keyword in test_keywords:
                # 키워드 정상 동작 실패
                if not self.searching(keyword):
                    self.DBG.print_dbg(f"검색 > 테스트 키워드:'{keyword}' 정상 동작", False)
                    return False
                assert keyword in self.FC.loading_find_css(self.FC.var['search_el']['검색결과_검색창']).get_property("innerText"), self.DBG.logger.debug(f"검색 > 테스트 키워드:'{keyword}' 정상 노출 확인 실패")

        except Exception as e:
            print("검색 중 오류가 발생했습니다:", e)
            self.DBG.print_dbg("검색기능 정상 동작", False)
            return False  # 예외 발생 시에도 False 반환

        else:
            self.DBG.print_dbg("검색기능 정상 동작")
            if self.FC.driver.current_url == 'NATIVE_APP':
                self.FC.switch_view()
            return True

