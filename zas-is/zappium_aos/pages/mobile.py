class MobilePage():
    def __init__(self,AppDriver:AppDriver,FC:Function):
        self.driver=AppDriver.driver
        self.FC=FC
        self.DBG=Debug(AppDriver)

    def mobile(self):
        self.FC.gotoHome()
        try:
            self.FC.movepage(self.FC.var['mobile_el']['mobile'], self.FC.var['mobile_el']['direct'],address=self.FC.var['mobile_el']['url'])
            self.FC.wait_loading()

            # KV 콘텐츠 정상 출력 확인
            kv_list = self.FC.loading_find_csss(self.FC.var['mobile_el']['KV_링크'])
            assert len(kv_list) >=1, self.DBG.logger.debug("모바일 > 서브메인 > KV 정상 출력 실패")

            # 서브메인 테마배너
            check_text_list=['휴대폰', '요금제', '유심', '모델별 지원금', '해외로밍']
            assert self.FC.text_list_in_element(self.FC.var['mobile_el']['테마배너'], check_text_list),self.DBG.logger.debug("모바일 > 서브메인 > 테마베너 정상 출력 실패")

            # 랜덤으로 테마배너 링크 찾기
            theme_list_link = self.FC.loading_find_csss(self.FC.var['mobile_el']['테마배너_링크'])
            random_num = random.randrange(0, len(theme_list_link))

            path_link = theme_list_link[random_num].get_attribute('href') # a 태그 상의 주소
            check_link = (self.FC.var['common_el']['url'] + path_link if path_link.startswith('/') else path_link).replace('/apcm/main', '')
            tab_name = theme_list_link[random_num].get_attribute('data-gtm-click-text')
            # print(f"tab_name: {tab_name} link: {path_link}")

            # 이동 확인
            # mobile_url = self.FC.driver.current_url
            self.FC.move_to_click(theme_list_link[random_num])
            self.FC.wait_loading()

            # 인터스티셜 창 닫기 추가
            self.FC.is_exists_element_click(self.FC.loading_find_xpath_pre(self.FC.var['common_el']['ins_close_button']))

            tab_url = self.FC.driver.current_url
            # print(f"Current URL: {mobile_url}, Expected URL: {tab_url}")

            # 유심 href가 /mobile/usim, redirect /mobile/sim-card/usim 로 상이하여 처리 스크립트 추가
            path_parts = path_link.split('/')
            path_check = any(part in tab_url for part in path_parts)
            # 예외처리: /5g-all → /plan-all 리다이렉트 허용
            if not path_check and path_link.endswith("/5g-all") and "/plan-all" in tab_url:
                path_check = True

            # check_link와 tab_url 비교 (OR 조건 적용)
            assert check_link in tab_url or path_check, self.DBG.logger.debug(f"모바일 > 서브메인 > 테마베너 > {tab_name}탭 정상 동작 실패: check_link='{check_link}', tab_url='{tab_url}'")
            self.FC.goto_url(self.FC.var['mobile_el']['url'])

            # 이벤트 영역에서 콘텐츠 정상 출력 및 클릭 시, 정상 이동 확인
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mobile_el']['이벤트']))
            self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['mobile_el']['이벤트_title']))
            assert self.FC.var['benefit_el']['진행 중인 이벤트_url'] in self.FC.driver.current_url,self.DBG.logger.debug("모바일 > 서브메인 > 이벤트 타이틀 기능 정상 동작 실패 ")

            self.FC.goto_url(self.FC.var['mobile_el']['url'])
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mobile_el']['이벤트']))
            event_list = self.FC.loading_find_csss(self.FC.var['mobile_el']['이벤트_콘텐츠'])
            assert len(event_list) == 4, self.DBG.logger.debug("모바일 > 서브메인 > 이벤트 콘텐츠 4개 노출 실패 ")

            # 휴대폰 영역 기능 및 콘텐츠 정상 노출 확인
            # 휴대폰 타이틀 링크 이동 확인
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mobile_el']['휴대폰']))
            self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['mobile_el']['휴대폰_title']))
            self.FC.modal_ck()
            assert self.FC.var['mobile_el']['모바일기기_휴대폰_url'] in self.FC.driver.current_url,self.DBG.logger.debug("모바일 > 서브메인 > 휴대폰 > 타이틀 클릭 시, 정상 이동 실패")
            self.FC.goto_url(self.FC.var['mobile_el']['url'])

            # 휴대폰 탭 메뉴 정상 노출
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mobile_el']['휴대폰']))
            tab_list_el=self.FC.loading_find_csss(self.FC.var['mobile_el']['휴대폰_탭_링크'])
            tab_list=['추천','삼성','Apple','가성비폰']
            for tab in tab_list_el:
                num=tab_list_el.index(tab)
                assert tab_list[num] in tab.get_property('innerText'),self.DBG.logger.debug("모바일 > 서브메인 > 휴대폰 > 탭 정상 노출 실패")

                self.FC.move_to_click(tab)
                self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mobile_el']['휴대폰_panel']))
                self.FC.wait_datas(self.FC.var['mobile_el']['휴대폰_panel'],'p.big-title')
                list=self.FC.loading_find_csss(self.FC.var['mobile_el']['휴대폰_panel_주문하기'])
                assert len(list) > 0,self.DBG.logger.debug(f"모바일 > 서브메인 > 휴대폰 > {tab_list[num]}탭 콘텐츠 정상 노출 실패")

            # 임의 상품 이동
            tab_list_el[0].click()
            self.FC.wait_loading()
            carousel=self.FC.loading_find_css_pre(self.FC.var['mobile_el']['휴대폰_panel'])
            list=self.FC.loading_find_csss(self.FC.var['mobile_el']['휴대폰_panel_주문하기'])
            random_num=random.randrange(0,len(list))
            for n in range(-1,random_num):
                self.FC.action.click_and_hold(carousel).move_by_offset(-100,0).release().perform()
            titles=self.FC.loading_find_csss(self.FC.var['mobile_el']['휴대폰_panel_상품명'])
            title=titles[random_num].get_property('innerText')
            if 'Z Flip5' in title:
                title ='갤럭시 Z Flip 5'
            list=self.FC.loading_find_csss(self.FC.var['mobile_el']['휴대폰_panel_상품명'])
            self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['mobile_el']['휴대폰_panel_주문하기']))
            title_text=self.FC.loading_find_css_pre(self.FC.var['mobile_el']['기기상품상세_title']).get_property('innerText')
            assert title in title_text, self.DBG.logger.debug(f"모바일 > 서브메인 > 휴대폰 > {title} 상품 정상 이동 실패")
            self.FC.goto_url(self.FC.var['mobile_el']['url'])

            # 추천 요금제
            # 추천 요금제 타이틀 링크
            self.FC.swipe(4)
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mobile_el']['추천 요금제']))
            self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['mobile_el']['추천 요금제_title']))
            assert self.FC.var['mobile_el']['모바일요금제_요금제_url'] in self.FC.driver.current_url,self.DBG.logger.debug(f"모바일 > 서브메인 > 요금제 > 타이틀 정상 이동 실패")
            self.FC.goto_url(self.FC.var['mobile_el']['url'])

            # 추천요금제 임의 상품 링크 이동
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mobile_el']['추천 요금제']))
            list=self.FC.loading_find_csss(self.FC.var['mobile_el']['추천 요금제_링크'])
            random_num=random.randrange(0,len(list)-1)
            carousel=self.FC.loading_find_css_pre(self.FC.var['mobile_el']['추천 요금제_panel'])
            self.FC.wait_datas(self.FC.var['mobile_el']['추천 요금제_링크'],'p')
            self.FC.scroll_x(list[random_num])

            json_data=list[random_num].get_attribute('data-ec-product')
            data=json.loads(json_data)
            title=data['ecom_prd_name']

            self.FC.move_to_click(list[random_num])
            title_text=self.FC.loading_find_css_pre(self.FC.var['mobile_el']['요금제상품상세_title']).get_property('innerText')
            assert title in title_text, self.DBG.logger.debug(f"모바일 > 서브메인 > 요금제 > {title} 상품 정상 이동 실패")
            self.FC.goto_url(self.FC.var['mobile_el']['url'])

            # 휴대폰 결합 할인 영역 없어짐 25.01.02

            # # 휴대폰 결합 할인 계산 영역 콘텐츠 노출 확인
            # # Select.select_by_index()가 ElementNotInteractableException: Message: element not interactable: Element is not currently visible and may not be manipulated 오류로 Keys.Down으로 대체
            # # 가입 상담 신청 버튼 노출 확인
            # self.FC.swipe(6)
            # self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mobile_el']['추천 요금제']))
            # self.FC.swipe(self.FC.var['mobile_el']['휴대폰결합상품'],'true')
            # self.FC.wait_loading()
            # button=self.FC.loading_find_css_pre(self.FC.var['mobile_el']['가입상담신청_btn'])
            # self.FC.move_to_element(button)
            # assert button is not None ,self.DBG.logger.debug("모바일 > 서브메인 > 휴대폰 결합 할인 계산 영역의 가입상담 신청 버튼 노출 실패 ")
            # # 휴대폰/인터넷/IPTV 드롭다운 선택 후 가입 상담 신청 시, 임의 선택한 데이터 정상 노출 확인(선택한 데이터:check_list)
            # select_list=self.FC.loading_find_csss(self.FC.var['mobile_el']['휴대폰결합상품_select'])
            # for select in select_list:
            #     current_select=Select(select)
            #     random_num=random.randrange(0,len(current_select.options))
            #     if random_num !=0:
            #         self.FC.move_to_click(select)
            #         for _ in range(0,random_num):
            #             select.send_keys(Keys.DOWN)
            #         select.send_keys(Keys.ENTER)
            #     else:
            #         pass
            # price_value=self.FC.loading_find_csss(self.FC.var['mobile_el']['휴대폰결합상품_value'])
            # check_value=[]
            # for n in range(0,len(price_value)):
            #     check_value.append(price_value[n].get_property('innerText').replace('원',''))

            # count=0
            # while True:
            #     self.FC.move_to_element(button)
            #     self.FC.driver.execute_script("arguments[0].click();", button)
            #     count+=1
            #     if 'NATIVE_APP' in  self.driver.contexts: # Chrome App cache clear로 인해 매번 Access 허용 해줘야 함
            #         break
            #     assert count <= 3, print('while 무한 반복 오류')


            # # 가입상담 신청 팝업창으로 들어옴 (팝업창 핸들러 실행)
            # time.sleep(3)
            # self.FC.chrome_access_beta() # Chrome App cache clear로 인해 매번 Access 허용 해줘야 함
            # time.sleep(5)
            # for i in range(5):
            #     try:
            #         self.FC.switch_view('WEBVIEW_chrome')
            #         title= self.FC.loading_find_css_pre(self.FC.var['mobile_el']['가입상담신청_팝업_헤더']).get_property('innerText')  #상담 신청
            #         if '상담 신청하기' not in title:
            #             self.FC.switch_view()
            #             pass
            #         else:
            #             break
            #     except Exception:
            #         time.sleep(1.5)
            #         pass
            # title= self.FC.loading_find_css_pre(self.FC.var['mobile_el']['가입상담신청_팝업_타이틀']).get_property('innerText')  #상담 신청
            # assert "상담 신청" in title and self.FC.loading_find_css_pre(self.FC.var['mobile_el']['가입상담신청_팝업_고객명']) and self.FC.loading_find_css_pre(self.FC.var['mobile_el']['가입상담신청_팝업_휴대폰번호']) and self.FC.loading_find_css_pre(self.FC.var['mobile_el']['가입상담신청_팝업_개인정보_동의']), self.DBG.logger.debug("모바일 > 서브메인 > 휴대폰 결합 할인 계산 영역의 가입상담 신청 팝업 > 콘텐츠 정상 노출 실패 ")

            # self.FC.loading_find_csss(self.FC.var['mobile_el']['가입상담신청_팝업_data_load'])   # 로딩
            # price_list=self.FC.loading_find_csss(self.FC.var['mobile_el']['가입상담신청_팝업_data'])
            # for num in range(0,len(check_value)):
            #     assert check_value[num] in price_list[num].get_property('innerText'),self.DBG.logger.debug("모바일 > 서브메인 > 휴대폰 결합 할인 계산 영역의 가입상담 신청 팝업 > select data 정상 노출 실패 ")

            # self.FC.driver.activate_app('com.lguplus.mobile.cs')
            # time.sleep(5) # context 대기
            # self.FC.switch_view()
            # self.FC.wait_loading()

            # 태블릿/스마트워치
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mobile_el']['태블릿']))
            self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['mobile_el']['태블릿_title']))
            assert self.FC.var['mobile_el']['모바일기기_태블릿_url'] in self.FC.driver.current_url,self.DBG.logger.debug("모바일 > 서브메인 > 태블릿/스마트워치 > 타이틀 정상 이동 실패")
            self.FC.goto_url(self.FC.var['mobile_el']['url'])
            # 태블릿/스마트워치 탭 메뉴 정상 노출
            tab_list_el=self.FC.loading_find_csss(self.FC.var['mobile_el']['태블릿_탭_링크'])
            tab_list=['추천','삼성','Apple']
            for tab in tab_list_el:
                num=tab_list_el.index(tab)
                assert tab_list[num] in tab.get_property('innerText'),self.DBG.logger.debug("모바일 > 서브메인 > 태블릿/스마트워치 > 탭 정상 노출 실패")
                self.FC.move_to_click(tab)
                self.FC.move_to_element(self.FC.loading_find_css_pre((self.FC.var['mobile_el']['태블릿_panel'])))
                list=self.FC.loading_find_csss(self.FC.var['mobile_el']['태블릿_panel_주문하기'])
                assert len(list) > 0,self.DBG.logger.debug(f"모바일 > 서브메인 > 태블릿/스마트워치 > {tab_list[num]}탭 콘텐츠 정상 노출 실패")

            # 임의 상품 이동
            tab_list_el[0].click()
            self.FC.wait_loading()
            carousel=self.FC.loading_find_css_pre(self.FC.var['mobile_el']['태블릿_panel'])
            list=self.FC.loading_find_csss(self.FC.var['mobile_el']['태블릿_panel_주문하기'])
            random_num=random.randrange(0,len(list))
            for n in range(-1,random_num):
                self.FC.action.click_and_hold(carousel).move_by_offset(-100,0).release().perform()
            titles=self.FC.loading_find_csss(self.FC.var['mobile_el']['태블릿_panel_상품명'])
            title=titles[random_num].get_property('innerText')
            list=self.FC.loading_find_csss(self.FC.var['mobile_el']['태블릿_panel_상품명'])
            self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['mobile_el']['태블릿_panel_주문하기']))
            title_text=self.FC.loading_find_css_pre(self.FC.var['mobile_el']['기기상품상세_title']).get_property('innerText')
            assert title in title_text, self.DBG.logger.debug(f"모바일 > 서브메인 > 태블릿/스마트워치 > {title} 상품 정상 이동 실패")
            self.FC.goto_url(self.FC.var['mobile_el']['url'])

            # 하위메뉴
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mobile_el']['하위메뉴']))
            self.FC.scroll(3)
            tab_list=self.FC.loading_find_csss(self.FC.var['mobile_el']['하위메뉴_탭_링크'])
            check_text_tab_list=['매장에서 받기','7% 추가요금 할인','다이렉트 요금제','유심 가입','결합 할인','제휴카드 할인','제휴팩']
            for num in range(0,len(check_text_tab_list)):
                self.FC.move_to_click(tab_list[num])
                tab_panel_con=self.FC.loading_find_css_pre(self.FC.var['mobile_el']['하위메뉴_panel_콘텐츠']).get_attribute('alt')
                assert check_text_tab_list[num] in tab_panel_con, self.DBG.logger.debug("모바일 > 서브메인 > 하위메뉴 > 탭 콘텐츠 정상 출력 실패 ")

            # 구매후기 영역 출력 및 링크 이동 정상 확인
            review_section=self.FC.loading_find_css(self.FC.var['mobile_el']['구매후기'])
            self.FC.move_to_element(review_section)
            review_tap=self.FC.loading_find_csss(self.FC.var['mobile_el']['구매후기_tab_list'])
            self.FC.scroll(1)
            # check_text=['일반 구매 후기','전문가 리뷰'] #TODO DCBGQA-557 이슈로 인해 일시 주석처리
            check_text=['일반 구매 후기']
            for num in range(0,len(check_text)):
                self.FC.move_to_click(review_tap[num])
                text= review_tap[num].get_property('innerText')
                assert check_text[num] in text, self.DBG.logger.debug("모바일 > 서브메인 > 구매 후기 영역 탭 정상 출력 실패 ")
                views=self.FC.loading_find_csss(self.FC.var['mobile_el']['구매후기_콘텐츠'])
                assert len(views) >= 1, self.DBG.logger.debug(f"모바일 > 서브메인 > 구매 후기({check_text[num]}) 정상 출력 실패 ")
                for item in views:
                    assert len(item.get_property('children')) >=2 and item.get_property('children')[1].get_property('innerText') != "", self.DBG.logger.debug(f"모바일 > 서브메인 > 구매 후기({check_text[num]}) > 정상 출력 실패  ")

        except  Exception :
            self.DBG.print_dbg("모바일 페이지 정상 노출 및 이벤트 링크 이동 및 상품 페이지 정상 이동 동작 확인",False)
            self.FC.driver.activate_app('com.lguplus.mobile.cs')
            self.driver.switch_to.context('WEBVIEW_com.lguplus.mobile.cs')
            return False
        else :
            self.DBG.print_dbg("모바일 페이지 정상 노출 및 이벤트 링크 이동 및 상품 페이지 정상 이동 동작 확인")
            return True

    # 모바일 > 모바일 요금제
    def mobile_plan(self):
        self.FC.gotoHome()
        try:
            self.FC.movepage(self.FC.var['mobile_el']['mobile'],self.FC.var['mobile_el']['모바일요금제_5G/LTE'],address=self.FC.var['mobile_el']['5G/LTE_url'])

            # 상단 사용중인 요금제 정보 정상 확인
            result=[]
            self.FC.move_to_click(self.FC.loading_find_css_pre(self.FC.var['mobile_el']['사용중인_요금제_정보_btn']))
            text_list=['월정액','데이터']
            result.append(self.FC.text_list_in_element(self.FC.var['mobile_el']['사용중인_요금제_정보'],text_list))
            result.append(self.FC.wait_datas(self.FC.var['mobile_el']['사용중인_요금제_정보'],'p','strong'))
            my_plan_name = self.FC.loading_find_css_pre(self.FC.var['mobile_el']['사용중인_요금제명']).get_property('innerText')
            assert self.DBG.print_res(result),self.DBG.logger.debug("모바일 > 모바일 요금제 > 5G/LTE > 상단 사용중인 요금제 정보 정상 출력 실패")

            # 탭 페이지 이동 확인
            result.clear()
            tab_keys = ['5G/LTE', '온라인단독', '태블릿/스마트워치', '듀얼넘버']
            for key in tab_keys:
                print(f"Testing tab: {key}")
                self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['mobile_el'][f'{key}_tab']))
                self.FC.wait_loading()

                # 인터스티셜 창 닫기 추가
                self.FC.is_exists_element_click(self.FC.loading_find_xpath_pre(self.FC.var['common_el']['ins_close_button']))

                current_url = self.FC.driver.current_url
                expected_url = self.FC.var['mobile_el'][f'{key}_url']
                print(f"Current URL: {current_url}, Expected URL: {expected_url}")
                result.append(expected_url in current_url)

            assert self.DBG.print_res(result),self.DBG.logger.debug(f"모바일 > 모바일 요금제 > 5G/LTE > {key}탭 정상 이동 및 콘텐츠 확인 실패")

            # 5G/LTE탭으로 이동하여 임의 요금제 비교하기
            self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['mobile_el']['5G/LTE_tab']))
            self.FC.wait_loading()

            # 임의 요금제 비교하기
            result.clear()
            btns = self.FC.loading_find_csss(self.FC.var['mobile_el']['요금제_비교하기'])
            random_num = random.randrange(0,len(btns))
            # 요금제 정보
            datas ={
                '요금제명': None,
                '가격': None,
                '할인가격': None,
            }

            compare_plan_name = self.FC.loading_find_csss(self.FC.var['mobile_el'][f'요금제_list_요금제명'])[random_num].get_property('innerText')
            if my_plan_name in compare_plan_name and random_num == (len(btns) - 1):
                random_num -= 1
            elif my_plan_name in compare_plan_name and random_num < len(btns):
                random_num += 1

            for key in datas.keys():
                datas[key] = self.FC.loading_find_csss(self.FC.var['mobile_el'][f'요금제_list_{key}'])[random_num].get_property('innerText').strip().replace(' 원','').split('월')[-1].lstrip()
            self.FC.move_to_click(btns[random_num])
            self.FC.wait_loading()

            for key in datas.keys():

                print(self.FC.loading_find_css_pre(self.FC.var['mobile_el']['요금제비교함_신청하기_버튼']).get_attribute('disabled'))
                if self.FC.loading_find_css_pre(self.FC.var['mobile_el']['요금제비교함_신청하기_버튼']).get_attribute('disabled') == 'disabled':
                    self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['common_el']['이전화면']))
                    self.FC.move_to_click(btns[random_num])
                else:
                    pass

                result.append(datas[key] in self.FC.loading_find_css_pre(self.FC.var['mobile_el'][f'요금제비교함_{key}']).get_property('innerText'))

            result.append(self.FC.wait_datas(self.FC.var['mobile_el']['요금제비교함'],'p:not(.small)','strong'))
            assert self.DBG.print_res(result),self.DBG.logger.debug(f"모바일 > 모바일 요금제 > 5G/LTE > 요금제 비교하기 > 비교함 {datas['요금제명']} 정상 노출 확인 실패")

            # 요금제 비교 운영결함으로 주석처리
            # # 요금제 비교함 > 비교 요금제 드롭다운 변경
            # self.FC.loading_find_css(self.FC.var['mobile_el']['요금제비교함_드롭다운']).click()
            # dropdown_list = self.FC.loading_find_csss(self.FC.var['mobile_el']['요금제비교함_드롭다운_list'])
            # random_num = random.randrange(0,len(dropdown_list))
            # check_title = dropdown_list[random_num].get_property('innerText')
            # self.FC.move_to_click(dropdown_list[random_num])
            # add_btn = self.FC.loading_find_css(self.FC.var['mobile_el']['요금제비교함_추가하기_버튼'])
            # self.FC.move_to_click(add_btn)
            # assert check_title in self.FC.loading_find_css_pre(self.FC.var['mobile_el']['요금제비교함_요금제명']).get_property('innerText'),self.DBG.logger.debug(f"모바일 > 모바일 요금제 > 5G/LTE > 요금제 비교하기 > 비교함 {check_title} 드롭다운 변경 기능 정상 동작 실패")
            # /요금제 비교 운영결함으로 주석처리

            self.FC.goto_url(self.FC.var['mobile_el']['5G/LTE_url'])

            # 모바일 > 모바일 요금제 > 요금제 변경
            result.clear()
            btns = self.FC.loading_find_csss(self.FC.var['mobile_el']['요금제_변경하기'])
            random_num = random.randrange(0, len(btns))
            # 요금제 정보
            datas ={
                '요금제명': None,
                '가격': None,
                '할인가격': None,
            }

            compare_plan_name = self.FC.loading_find_csss(self.FC.var['mobile_el'][f'요금제_list_요금제명'])[random_num].get_property('innerText')
            if my_plan_name in compare_plan_name and random_num == (len(btns) - 1):
                random_num -= 1
            elif my_plan_name in compare_plan_name and random_num < len(btns):
                random_num += 1

            for key in datas.keys():
                datas[key] = self.FC.loading_find_csss(self.FC.var['mobile_el'][f'요금제_list_{key}'])[random_num].get_property('innerText').strip().replace(' 원','').split('월')[-1].lstrip()
            self.FC.move_to_click(btns[random_num])

            if self.FC.loading_find_css_pre(self.FC.var['mobile_el']['혜택_title']) is False:
                pass
            # 프리미엄 혜택
            elif '프리미엄' in self.FC.loading_find_css_pre(self.FC.var['mobile_el']['혜택_title']).get_property('innerText'):
                btns = self.FC.loading_find_csss(self.FC.var['mobile_el']['혜택_선택_list'])
                for i in range(0, len(btns)):
                    if btns[i].get_attribute('alt') == '일리커피구독':
                        self.FC.move_to_click(btns[i])
                self.FC.move_to_click(self.FC.loading_find_css_pre(self.FC.var['mobile_el']['다음_버튼']))
            # 미디어 혜택
            elif '미디어' in self.FC.loading_find_css_pre(self.FC.var['mobile_el']['혜택_title']).get_property('innerText'):
                btns = self.FC.loading_find_csss(self.FC.var['mobile_el']['혜택_선택_list'])
                self.FC.move_to_click(btns[random.randrange(0, len(btns))])
                self.FC.move_to_click(self.FC.loading_find_css_pre(self.FC.var['mobile_el']['다음_버튼']))

            check_datas=self.FC.loading_find_csss(self.FC.var['mobile_el']['요금제_변경_data'])
            result.append(datas['요금제명'] in check_datas[0].get_property('innerText'))
            result.append(datas['가격'] in check_datas[2].get_property('innerText'))
            result.append(self.FC.var['mobile_el']['요금제조회변경_url'] in self.FC.driver.current_url)

            assert self.DBG.print_res(result) ,self.DBG.logger.debug(f"모바일 > 모바일 요금제 > 5G/LTE > 요금제 변경하기 > 요금제 조회/변경 페이지 정상 이동 실패")

        except Exception:
            self.DBG.print_dbg("모바일 > 모바일 요금제 > 5G/LTE > 페이지 정상 노출 및 기능 확인", False)
            # self.FC.close_popup(self.FC.driver.window_handles)
            return False

        else:
            self.DBG.print_dbg("모바일 > 모바일 요금제 > 5G/LTE 페이지 정상 노출 및 이벤트 링크 이동 및 상품 페이지 정상 이동 동작 확인")
            return True


    # 모바일 > 모바일 기기 > 휴대폰
    def mobile_device(self):
        self.FC.gotoHome()
        try:
            self.FC.movepage(self.FC.var['mobile_el']['mobile'],self.FC.var['mobile_el']['mobile_device_phone'],address= self.FC.var['mobile_el']['phone_url'])
            self.FC.modal_ck()

            # 임의 랜덤 기기 신청하기 이동 - 0-2은 사전예약기기로 예외처리
            random_num = random.randrange(3,10)
            select_btns = self.FC.loading_find_csss(self.FC.var['mobile_el']['신청하기_btn'])
            self.FC.scroll_center(select_btns[random_num])
            select_btns[random_num].click()
            self.FC.wait_loading()
            self.FC.modal_ck()
            self.FC.wait_datas(self.FC.var['mobile_el']['phone_info'],self.FC.var['mobile_el']['phone_name'],self.FC.var['mobile_el']['phone_info2'])

            phone_name = self.FC.loading_find_css(self.FC.var['mobile_el']['phone_name']).get_property('innerText')

            # # 가입유형 클릭
            self.FC.move_to_click(self.FC.loading_find_xpaths(self.FC.var['mobile_el']['장바구니_가입유형'])[0],True)

            phone_plan_btn = self.FC.loading_find_xpaths(self.FC.var['mobile_el']['장바구니_요금제'])[0]
            self.FC.move_to_click(phone_plan_btn,True)
            phone_plan = phone_plan_btn.get_attribute('data-gtm-click-text')
            self.FC.is_exists_move_to_click(self.FC.loading_find_css(self.FC.var['mobile_el']['장바구니_요금제_특별혜택'])) # 요금제 추가 혜택

            self.FC.is_exists_move_to_click(self.FC.loading_find_xpaths(self.FC.var['mobile_el']['장바구니_할인방법'])[0],True) # 할인 방법

            self.FC.is_exists_move_to_click(self.FC.loading_find_xpaths(self.FC.var['mobile_el']['장바구니_납부기간'])[0],True) # 기기 할부

            self.FC.is_exists_move_to_click(self.FC.loading_find_xpaths(self.FC.var['mobile_el']['장바구니_배송방법'])[0],True) # 우체국 택배

            if self.FC.loading_find_csss(self.FC.var['mobile_el']['장바구니_멤버십혜택']) is True:
                self.FC.is_exists_move_to_click(self.FC.loading_find_csss(self.FC.var['mobile_el']['장바구니_멤버십혜택'])[1]) # VIP 멤버십 혜택

            if self.FC.loading_find_xpaths(self.FC.var['mobile_el']['장바구니_사은품']):
                btns = self.FC.loading_find_xpaths(self.FC.var['mobile_el']['장바구니_사은품'])
                for btn in btns:
                    if btn.get_attribute('disabled'):
                        pass
                    else:
                        self.FC.move_to_click(btn)
                        break

            self.FC.is_exists_move_to_click(self.FC.loading_find_xpaths(self.FC.var['mobile_el']['장바구니_추가혜택'])[0],True) # 혜택

            self.FC.is_exists_move_to_click(self.FC.loading_find_xpaths(self.FC.var['mobile_el']['장바구니_제휴카드'])[0],True) # 제휴카드

            self.FC.is_exists_move_to_click(self.FC.loading_find_xpaths(self.FC.var['mobile_el']['장바구니_추가할인'])[0],True) # 추가 할인 혜택


            phone_price = self.FC.loading_find_css(self.FC.var['mobile_el']['phone_price']).get_property('innerText')

            # 장바구니 바로가기
            self.FC.loading_find_css(self.FC.var['mobile_el']['장바구니_btn']).click()
            self.FC.loading_find_css(self.FC.var['mobile_el']['장바구니로_이동_btn']).click()
            self.FC.wait_loading()
            assert self.FC.driver.current_url in self.FC.var['mobile_el']['장바구니_url'], self.DBG.logger.debug("모바일 > 모바일 기기 > 휴대폰 > 장바구니 이동 실패")

            cart_list = self.FC.loading_find_csss(self.FC.var['mobile_el']['장바구니_상품_영역'])
            is_text_in_cart=[]
            for cart in cart_list:
                res = all([True if text in cart.get_property('innerText') else False for text in [phone_name,phone_plan,phone_price]])
                is_text_in_cart.append(res)

            assert any(is_text_in_cart),self.DBG.logger.debug("모바일 > 모바일 기기 > 휴대폰 > 장바구니 기능 정상 동작 실패")
            idx = is_text_in_cart.index(True)
            del_btns = self.FC.loading_find_csss(self.FC.var['mobile_el']['장바구니_삭제_버튼'])
            self.FC.move_to_click(del_btns[idx])
            del_confirm = self.FC.loading_find_css_pre(self.FC.var['mobile_el']['삭제_확인_버튼'])
            self.FC.move_to_click(del_confirm)
            self.FC.modal_ck2()


        except  Exception :

            self.DBG.print_dbg("모바일 > 모바일 기기 > 휴대폰 > 장바구니 기능",False)
            self.FC.modal_ck()
            return False

        else :
            self.DBG.print_dbg("모바일 > 모바일 기기 > 휴대폰 > 장바구니 기능")
            return True

