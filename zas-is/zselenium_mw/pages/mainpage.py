
class MainPage():

    def mainpage_new(self):
        '''
        로그인 후, 메인페이지 테스트
        '''
        self.FC.gotoHome()
        try:
            result=[]
            self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['개인화/다운로드 콘텐츠'])
            # KV
            assert len(self.FC.loading_find_xpaths(self.FC.var['mainpage_el']['kv_링크'])) >= 1,self.DBG.logger.debug("메인(로그인 후) > KV 콘텐츠 정상 노출 실패")

            # 앱 다운로드
            self.FC.click_until_go_page(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['앱 다운로드']))
            result.append(self.FC.var['mainpage_el']['앱 다운로드_url'] in self.FC.driver.current_url)
            self.FC.gotoHome()

            # 마이페이지
            self.FC.click_until_go_page(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['마이페이지']))
            self.FC.wait_loading()
            result.append(self.FC.var['mypage']['mypage_url'] in self.FC.driver.current_url)
            self.FC.gotoHome()

            # 닷컴 회원 전용 혜택
            self.FC.scroll_center(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['닷컴 회원 전용 혜택']))
            self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['닷컴 회원 전용 혜택']).click()
            self.FC.wait_loading()
            result.append(self.FC.var['mainpage_el']['닷컴 회원 전용 혜택_url'] in self.FC.driver.current_url)

            assert self.DBG.print_res(result), self.DBG.logger.debug("메인(로그인 후) > 개인화/다운로드 콘텐츠 노출 및 기능 정상 동작 실패")
            self.FC.gotoHome()
            result.clear()

            # 추천 지금 인기모바일
            # 타이틀
            self.FC.scroll_center(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['추천기기']))
            self.FC.loading_find_css(self.FC.var['mainpage_el']['추천기기_title']).click()
            self.FC.wait_loading()
            result.append(self.FC.var['mobile_el']['모바일기기_휴대폰_url'] in self.FC.driver.current_url)
            self.FC.gotoHome()

            # 기기 리스트 노출 및 링크 이동
            self.FC.scroll_center(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['추천기기']))
            product_list = self.FC.loading_find_csss(self.FC.var['mainpage_el']['추천기기_링크'])
            product_name_list = self.FC.loading_find_csss(self.FC.var['mainpage_el']['추천기기_기기명'])
            result.append(len(product_list) >=1)
            index = random.randrange(0,len(product_name_list))
            product_name = product_name_list[index].get_property('innerText')
            self.FC.move_to_click(product_list[index])
            name = self.FC.loading_find_css_pre(self.FC.var['mobile_el']['기기상품상세_title']).get_property('innerText')
            result.append(product_name in name)
            self.FC.gotoHome()
            self.FC.scroll_center(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['추천기기']))
            assert self.DBG.print_res(result),self.DBG.logger.debug("메인(로그인 후) > 추천 기기 콘텐츠 및 링크 정상 노출 실패")
            result.clear()

            # 추천 헤택 좋은 요금제
            # 타이틀
            self.FC.scroll_center(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['추천요금제']))
            self.FC.loading_find_css(self.FC.var['mainpage_el']['추천요금제_title']).click()
            self.FC.wait_loading()
            result.append(self.FC.var['mobile_el']['모바일요금제_요금제_url'] in self.FC.driver.current_url)
            self.FC.gotoHome()

            # 요금제 리스트 노출 및 링크 이동
            self.FC.scroll_center(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['추천요금제']))
            product_list = self.FC.loading_find_csss(self.FC.var['mainpage_el']['추천요금제_링크'])
            product_name_list = self.FC.loading_find_csss(self.FC.var['mainpage_el']['추천요금제_제품명'])
            result.append(len(product_list) >= 1)
            index = random.randrange(0,len(product_name_list))
            product_name = product_name_list[index].get_property('innerText')
            self.FC.move_to_click(product_list[index])
            name = self.FC.loading_find_css_pre(self.FC.var['mobile_el']['요금제상품상세_title']).get_property('innerText')
            result.append(product_name in name)
            self.FC.gotoHome()
            self.FC.scroll_center(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['추천요금제']))
            assert self.DBG.print_res(result), self.DBG.logger.debug("메인(로그인 후) > 추천 요금제 콘텐츠 및 링크 정상 노출 실패")

            # 추천 홈상품 가입
            # 타이틀
            self.FC.scroll_center(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['추천홈상품']))
            self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['추천홈상품_title']).click()
            self.FC.wait_loading()
            assert self.FC.var['mainpage_el']['인터넷iptv_url'] in self.FC.driver.current_url, self.DBG.logger.debug("메인(로그인 후) > 추천 홈상품 가입 타이틀 링크 정상 이동 실패")
            self.FC.gotoHome()
            items=self.FC.loading_find_csss(self.FC.var['mainpage_el']['추천홈상품_링크'])
            items_titles=self.FC.loading_find_csss(self.FC.var['mainpage_el']['추천홈상품_콘텐츠_title'])
            random_num=random.randrange(0,len(items))
            title=items_titles[random_num].get_property('innerText')
            self.FC.move_to_click(items[random_num])
            titles=title.split(' + ')
            text_el=self.FC.loading_find_csss(self.FC.var['mainpage_el']['iptv상품상세_title'])
            assert self.FC.var['mainpage_el']['iptv상품상세_url'] in self.FC.driver.current_url and titles[0] in text_el[0].get_property('innerText') and titles[1] in text_el[1].get_property('innerText') ,self.DBG.logger.debug("메인(로그인 후) > 추천 홈상품 가입 임의 상품 링크 정상 이동 실패")
            self.FC.gotoHome()

            # 유플닷컴 이용 가이드
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['유플닷컴_이용가이드']))
            contents=self.FC.loading_find_csss(self.FC.var['mainpage_el']['유플닷컴_이용가이드_콘텐츠'])
            assert len(contents) == 4, self.DBG.logger.debug("메인(로그인 후) > 유플 닷컴 이용 가이드 콘텐츠 정상 이동 실패")

            # 이벤트
            result.clear()
            self.FC.move_to_click(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['진행중인_이벤트_헤더']))
            result.append(self.FC.var['mainpage_el']['진행중인_이벤트_url'] in self.FC.driver.current_url)
            self.FC.gotoHome()

            # 현재 시간과, a alt 안의 이벤트 시간과 비교 후 기간내의 이벤트이면 True로 넘어가도록 수정
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['진행중인_이벤트']))
            current_date = datetime.now()
            # print(current_date)
            contents = self.FC.loading_find_csss(self.FC.var['mainpage_el']['진행중인_이벤트_콘텐츠'])
            # print(f"이벤트 콘텐츠 개수: {len(contents)}")
            for content in contents:
                event_text = content.get_attribute('data-gtm-click-text')
                # print(f"이벤트 콘텐츠 텍스트: {event_text}")
                if event_text and (matches := re.findall(r"(\d{4}\.\d{2}\.\d{2})", event_text)):
                    end_date_str = matches[-1]
                    end_date = datetime.strptime(end_date_str, "%Y.%m.%d")
                    # print(f"이벤트 종료일: {end_date}")
                    result.append(f"유효한 이벤트: {event_text}" if current_date <= end_date else f"기간이 만료된 이벤트: {event_text}")
            result.append(len(contents) >= 1)
            assert self.DBG.print_res(result), self.DBG.logger.debug("메인(로그인 후) > 이벤트 타이틀 및 콘텐츠 정상 노출 실패")

            # 추천 콘텐츠 잼
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['추천콘텐츠_잼']))
            contents=self.FC.loading_find_csss(self.FC.var['mainpage_el']['추천콘텐츠_콘텐츠'])
            assert len(contents) == 3, self.DBG.logger.debug("메인(로그인 후) > 추천 콘텐츠(잼) 콘텐츠 정상 노출 실패")

            # 유플닷컴 통신 생활
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['유플닷컴_통신_생활']))
            contents=self.FC.loading_find_csss(self.FC.var['mainpage_el']['유플닷컴_통신_생활_콘텐츠'])
            assert len(contents) == 4, self.DBG.logger.debug("메인(로그인 후) > 유플닷컴 통신 생활 콘텐츠 정상 노출 실패")

            # 고객지원(이럴 땐 U렇게)
            result.clear()
            self.FC.move_to_click(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['이럴땐_U렇게_헤더']))
            result.append(self.FC.var['mainpage_el']['이럴땐_U렇게_url'] in self.FC.driver.current_url)
            self.FC.gotoHome()
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['이럴땐_U렇게']))
            contents=self.FC.loading_find_csss(self.FC.var['mainpage_el']['이럴땐_U렇게_콘텐츠'])
            result.append(len(contents) == 3)
            assert self.DBG.print_res(result), self.DBG.logger.debug("메인(로그인 후) > 고객지원 타이틀 및 콘텐츠 정상 노출 실패")

        except  Exception :
            self.DBG.print_dbg("메인 페이지(로그인 후) 정상 노출 확인",False)
            return False

        else :
            self.DBG.print_dbg("메인 페이지(로그인 후) 정상 노출 확인")
            return True
