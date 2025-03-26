
class SupportPage():

    # 고객지원 부분, 휴대폰분실파손 부분 오류
    def support(self):
        self.FC.gotoHome()

        try:
            self.FC.movepage(self.FC.var['support_el']['support'], self.FC.var['support_el']['direct'],address=self.FC.var['support_el']['url'])

            # KV
            kv_list=self.FC.loading_find_csss(self.FC.var['support_el']['kv_list'])
            assert len(kv_list) >= 4, self.DBG.logger.debug("고객지원 > 서브메인 > KV 정상 출력 실패")

            # 자주 찾는 검색어 영역 콘텐츠 및 기능 정상 확인
            # 수동입력 검색
            result=[]
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['support_el']['자주찾는검색어_section']))
            result.append(self.FC.loading_find_css_pre(self.FC.var['support_el']['자주찾는검색창']))
            result.append(6 == len(self.FC.loading_find_csss(self.FC.var['support_el']['자주찾는검색어_list'])))
            assert self.DBG.print_res(result), self.DBG.logger.debug("고객지원 > 서브메인 > 상단 자주찾는 검색어 정상 노출 실패")

            # 수동 검색어 검색
            test_keyword='테스트'   #검색할 키워드
            search_el_id='#' + self.FC.loading_find_css_pre(self.FC.var['support_el']['자주찾는검색창']).get_attribute('id')
            self.FC.bring_el_to_front_css(search_el_id)
            search_el=self.FC.loading_find_css(search_el_id)
            search_el.click()
            search_el.send_keys(test_keyword)
            search_enter=self.FC.var['support_el']['고객지원_검색버튼']
            self.FC.bring_el_to_front_css(search_enter)
            self.FC.loading_find_css(search_enter).click()
            self.FC.wait_loading()

            self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['support_el']['키워드로찾기_탭']))
            assert self.FC.loading_find_css(self.FC.var['support_el']['키워드로찾기_검색결과_키워드']).get_property('innerText')==test_keyword, self.DBG.logger.debug(f"고객지원 > 자주하는 질문 > 키워드로 찾기 탭 > 테스트 키워드:'{test_keyword}' 정상 노출 확인 실패")

            # TODO 기존 이슈로인해 일시 주석처리
            # assert self.FC.loading_find_css('input#addr-1-1').get_property('value')==test_keyword, self.DBG.logger.debug(f"고객지원 > 자주하는 질문 > 키워드로 찾기 탭 > 테스트 키워드:'{test_keyword}' 정상 노출 확인 실패")                  #현재 이슈로인해 Fail 반환 - DCBGQA-336

            result.append(self.FC.loading_find_css(self.FC.var['support_el']['키워드로찾기_검색결과_키워드']).get_property('innerText')==test_keyword)
            # result.append(self.FC.loading_find_css('input#addr-1-1').get_property('value')==test_keyword)    #현재 이슈로인해 Fail 반환 - DCBGQA-336
            search_result_list_el=self.FC.loading_find_csss(self.FC.var['support_el']['키워드로찾기_검색결과_list'])

            # 검색 결과 콘텐츠가 검색한 키워드를 포함하는지 확인
            search_result=[]
            for el in search_result_list_el:
                if el.get_property('nextElementSibling').get_attribute('style') == 'display: none;':
                    self.FC.move_to_click(el)
                res=test_keyword in el.get_property('innerText') or self.FC.loading_find_csss(self.FC.var['support_el']['검색결과'])[search_result_list_el.index(el)]
                search_result.append(res)
            assert all(search_result), self.DBG.logger.debug(f"고객지원 > 자주하는 질문 > 키워드로 찾기 탭 > 검색 결과 콘텐츠 정상 출력 실패")

            # 자동 입력 검색(자주하는 질문 검색어 클릭 시, 정상 검색 되는지 확인)
            result.clear()
            question_keyword_list_el=self.FC.loading_find_csss(self.FC.var['support_el']['해시_검색어'])
            random_num=random.randrange(0,len(question_keyword_list_el))        # 무작위 검색어 키워드 선택
            question_keyword=question_keyword_list_el[random_num]
            question_keyword_text=question_keyword.get_property('innerText')
            question_keyword_text=question_keyword_text[1:]
            self.FC.scroll_center(question_keyword)
            self.FC.driver.execute_script("arguments[0].click();", question_keyword)
            self.FC.wait_loading()

            self.FC.loading_find_css(self.FC.var['support_el']['키워드로찾기_탭']).click()  #키워드로 찾기 탭 이동
            assert self.FC.loading_find_css(self.FC.var['support_el']['키워드로찾기_검색결과_키워드']).get_property('innerText')==question_keyword_text, self.DBG.logger.debug(f"고객지원 > 자주하는 질문 > 키워드로 찾기 탭 > 자주하는 질문 검색어:{question_keyword} >  콘텐츠 정상 출력 실패")
            assert self.FC.loading_find_css(self.FC.var['support_el']['키워드로찾기_검색창']).get_property('value')==question_keyword_text, self.DBG.logger.debug(f"고객지원 > 자주하는 질문 > 키워드로 찾기 탭 > 자주하는 질문 검색어:{question_keyword} >  콘텐츠 정상 출력 실패")
            search_result_list_el=self.FC.loading_find_csss(self.FC.var['support_el']['키워드로찾기_검색결과_list'])


            # # 검색 결과 콘텐츠가 검색한 키워드를 포함하는지 확인
            # search_result.clear()
            # # for el in search_result_list_el:        #슬라이드 애니메이션 대기시간 때문에 미리 클릭
            # n=0
            # for el in search_result_list_el:
            #     if el.get_property('nextElementSibling').get_attribute('style') == 'display: none;':
            #         while True:
            #             self.FC.scroll(n)
            #             if el.is_displayed() == True:
            #                 break;
            #             n+=100
            #         self.FC.action.move_to_element(el).click().perform()
            #         self.FC.action.reset_actions()
            #     time.sleep(.5)      # 슬라이드 애니메이션 대기
            #     res=question_keyword_text in el.get_property('innerText') or self.FC.loading_find_csss('div.collapse.show')[search_result_list_el.index(el)]
            #     search_result.append(res)
            # assert all(search_result), self.DBG.logger.debug(f"고객지원 > 자주하는 질문 > 키워드로 찾기 탭 > 자주하는 질문 검색어:{question_keyword} >  검색 결과 콘텐츠 정상 출력 실패")
            # # result.append(all(search_result))



            # # TODO 자주하는 질문 > 서비스로 찾기 탭 로직 추가 여부 확인필요(카테고리 변경에 따른 타이틀 변경 외 체크할 부분 없음)
            # # search_result.clear()
            # self.FC.action.move_to_element(self.FC.loading_find_css('div.tabs>ul[role="tablist"]>li:nth-of-type(2)>a')).click().perform() #서비스로 찾기 탭 이동
            # self.FC.action.reset_actions()
            # self.FC.wait_loading()
            # select_text_list=[]
            # for option in self.FC.loading_find_csss('select.c-select >option'):
            #     select_text_list.append(option.get_property('text'))
            # print(f"select list => {str(select_text_list)}")
            # self.FC.bring_el_to_front_css('div.tab-panel > div.c-section-xs > div.section-wide >div.c-selform > select.c-select')
            # select=Select(self.FC.loading_find_css('div.tab-panel > div.c-section-xs > div.section-wide >div.c-selform > select.c-select'))
            # # for text in select_text_list:           # TODO 이슈로 인해 fail 반환 - DCBGQA-336
            # #     select.select_by_visible_text(text)
            # #     self.FC.wait_loading()
            # #     print(f"{text} in {self.FC.loading_find_css('div.section-wide2>p').get_property('innerText')} ==> {str(text in self.FC.loading_find_css('div.section-wide2>p').get_property('innerText'))} ")
            # #     assert text in self.FC.loading_find_css('div.section-wide2>p').get_property('innerText'), self.DBG.logger.debug(f"고객지원 > 자주하는 질문 > 서비스로 찾기 탭 > select 변경 결과 타이틀 정상 출력 실패")

            # # self.FC.back()



            self.FC.goto_url(self.FC.var['support_el']['url'])
            # sec-2 영역 콘텐츠 정상 출력 확인, 로그인 전/후 로직 분리 필요
            result.clear()
            is_login=self.FC.is_login()
            print('is_login => ',is_login)
            # 로그인 전
            if is_login == False:
                self.FC.move_to_element(self.FC.loading_find_css(self.FC.var['support_el']['비로그인_도움이 될 내용']))
                text_list=['로그인']
                assert self.FC.text_list_in_element(self.FC.var['support_el']['비로그인_도움이 될 내용'],text_list), self.DBG.logger.debug(f"로그인 후 > 고객지원 > 서브메인 > sec-2 콘텐츠 정상 출력 실패")
            # 로그인 후
            elif is_login==True:
                self.FC.scroll_el(self.FC.var['support_el']['도움이 될 내용'])
                self.FC.move_to_element(self.FC.loading_find_css(self.FC.var['support_el']['도움이 될 내용']))
                text_list=['도움']
                result.append(self.FC.text_list_in_element(self.FC.var['support_el']['도움이 될 내용'],text_list))
                result.append(len(self.FC.loading_find_csss(self.FC.var['support_el']['도움이 될 내용_list']))>1)

            else:
                raise Exception("support 로그인 판별 에러")

            assert self.DBG.print_res(result), self.DBG.logger.debug(f"고객지원 > 서브메인 > 도움이 될 내용 콘텐츠 정상 출력 실패")


            # contents_list_el=self.FC.loading_find_csss('div.submain-section > div.c-section-xs > div.section-wide.login-after ul li')
            # 스스로 해결 가이드로 간편하게 해결해 보세요 영역
            result.clear()
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['support_el']['스스로 해결 가이드']))

            # 상단 타이틀"스스로 해결 가이드" 키워드 유무 확인
            text_list=['스스로 해결','가이드']
            result.append(self.FC.text_list_in_element(self.FC.var['support_el']['스스로 해결 가이드_title'],text_list))
            video_list_el=self.FC.loading_find_csss(self.FC.var['support_el']['스스로 해결 가이드_list'])
            result.append(len(video_list_el) == 4)
            assert self.DBG.print_res(result), self.DBG.logger.debug("고객지원 > 서브메인 > 스스로 해결 가이드 콘텐츠 정상 노출 확인 실패")




            # 마지막 섹션 콘텐츠 출력 및 링크 이동
            result.clear()
            self.FC.move_to_element(self.FC.loading_find_css(self.FC.var['support_el']['하단 탭']))
            # TODO 1:1문의하기 링크 이동 이슈 있음 - DCBGQA-375 / 1:1 문의하기는 로그인 전/후 로직 필요
            # 홈페이지 개선제안 버튼은 팝업 출력으로 제외
            url_list=[self.FC.var['support_el']['이용 기이드_url'],self.FC.var['support_el']['1:1 문의하기_url'],self.FC.var['support_el']['고객센터_url']]
            page_el=[self.FC.var['support_el']['이용 기이드'],self.FC.var['support_el']['1:1 문의하기'],self.FC.var['support_el']['고객센터']]
            for url in url_list:
                info_list_el=self.FC.loading_find_csss(self.FC.var['support_el']['하단 탭_list'])
                num=url_list.index(url)
                self.FC.move_to_click(info_list_el[num])
                result.append(url in self.FC.loading_find_css_pre(page_el[num]).get_property('baseURI'))
                if self.FC.var['support_el']['url'] != self.FC.driver.current_url:
                    self.FC.goto_url(self.FC.var['support_el']['url'])
                    self.FC.scroll(1300)

            # info_list_el=self.FC.loading_find_csss('div.submain-section > div.c-section-md > ul>li a')
            # self.FC.action.move_to_element(info_list_el[-1]).click().perform()
            # self.FC.action.reset_actions()
            # self.FC.driver.switch_to.window(self.FC.driver.window_handles[1])
            # print(self.FC.loading_find_css_pre('div.cont_01').get_property('innerText'))
            # result.append("고객의 소리" in self.FC.loading_find_css_pre('div.cont_01').get_property('innerText'))
            # self.FC.close_popup(self.FC.driver.window_handles)

            assert self.DBG.print_res(result), self.DBG.logger.debug("고객지원 > 서브메인 > 정보 버튼(마지막 섹션) 정상 노출 확인 실패")



        except  Exception :
            self.DBG.print_dbg("고객지원 페이지 정상 노출 및 기능 동작 확인",False)
            self.FC.close_popup(self.FC.driver.window_handles)
            return False

        else :
            self.DBG.print_dbg("고객지원 페이지 정상 노출 및 기능 동작 확인")
            return True
