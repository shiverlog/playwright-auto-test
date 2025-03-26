class MainPage():
    def __init__(self,AppDriver:AppDriver,FC:Function):
        self.FC=FC
        self.DBG=Debug(AppDriver)


    def mainpage_new(self):
        self.FC.gotoHome()
        try:
            result = []
            #KV
            self.FC.scroll_center(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['KV']))
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['KV']))
            assert len(self.FC.loading_find_csss(self.FC.var['mainpage_el']['KV_링크'])) > 0,  self.DBG.logger.debug("메인(로그인 후) > KV 콘텐츠 정상 노출 실패")

            # 이벤트
            self.FC.swipe(2)
            self.FC.again_click(self.FC.loading_find_css(self.FC.var['mainpage_el']['이벤트_title']))
            result.append(self.FC.var['benefit_el']['진행 중인 이벤트_url'] in self.FC.driver.current_url)
            self.FC.goto_url(self.FC.var['common_el']['url'])

            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['이벤트']))
            contents=self.FC.loading_find_csss(self.FC.var['mainpage_el']['이벤트_콘텐츠'])
            result.append(len(contents) >= 1)

            assert self.DBG.print_res(result), self.DBG.logger.debug("메인(로그인 후) > 이벤트 타이틀 및 콘텐츠 정상 노출 실패")

            # 추천 지금 인기모바일
            # 타이틀
            self.FC.scroll_center(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['추천모바일']))
            self.FC.wait_loading()
            self.FC.loading_find_css(self.FC.var['mainpage_el']['추천모바일_title']).click()
            self.FC.wait_loading()
            assert self.FC.var['mobile_el']['모바일기기_휴대폰_url'] in self.FC.driver.current_url,self.DBG.logger.debug("메인(로그인 후) > 추천 기기 타이틀 링크 정상 이동 실패")
            self.FC.goto_url(self.FC.var['common_el']['url'])

            # 무작위 랜덤 기기 이동
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['추천모바일']))
            product_list=self.FC.loading_find_csss(self.FC.var['mainpage_el']['추천모바일_콘텐츠'])
            random_num=random.randrange(0,len(product_list)-1) # 모바일 더보기 링크 박스 제외
            product_title=self.FC.loading_find_csss(self.FC.var['mainpage_el']['추천모바일_콘텐츠_title'])[random_num].get_property('innerText')

            self.FC.scroll_center(product_list[random_num])
            product_list[random_num].click()

            text=self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['상품상세_title']).get_property('innerText')
            assert product_title == text, self.DBG.logger.debug("메인(로그인 후) > 추천 기기 상세 링크 정상 이동 실패")
            self.FC.goto_url(self.FC.var['common_el']['url'])

            # 더보기
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['추천모바일']))
            self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['mainpage_el']['추천모바일_콘텐츠_더보기']))
            assert self.FC.var['mobile_el']['모바일기기_휴대폰_url'] in self.FC.driver.current_url,  self.DBG.logger.debug("메인(로그인 후) > 추천 모바일 더보기 링크 정상 이동 실패")
            self.FC.goto_url(self.FC.var['common_el']['url'])

            # 추천 요금제
            # 타이틀
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['추천요금제']))
            self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['mainpage_el']['추천요금제_title']))
            result.append(self.FC.var['mobile_el']['모바일요금제_요금제_url'] in self.FC.driver.current_url)
            self.FC.goto_url(self.FC.var['common_el']['url'])

            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['추천요금제']))
            items=self.FC.loading_find_csss(self.FC.var['mainpage_el']['추천요금제_콘텐츠'])
            items_titles=self.FC.loading_find_csss(self.FC.var['mainpage_el']['추천요금제_콘텐츠_title'])
            random_num=random.randrange(0,len(items)-1)
            title=items_titles[random_num].get_property('innerText')
            self.FC.move_to_click(items[random_num])

            assert title in self.FC.loading_find_css_pre(self.FC.var['mobile_el']['요금제상품상세_title']).get_property('innerText'), self.DBG.logger.debug("메인(로그인 후) > 추천 요금제 임의 상품 링크 정상 이동 실패")
            self.FC.goto_url(self.FC.var['common_el']['url'])
            self.FC.scroll_center(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['추천요금제_title']))
            # 더보기
            self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['mainpage_el']['추천요금제_콘텐츠_더보기']))

            assert self.FC.var['mobile_el']['모바일요금제_요금제_url'] in self.FC.driver.current_url,  self.DBG.logger.debug("메인(로그인 후) > 추천 요금제 더보기 링크 정상 이동 실패")
            self.FC.goto_url(self.FC.var['common_el']['url'])

            # 추천 홈상품 가입
            self.FC.scroll_center(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['추천홈상품']))
            self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['mainpage_el']['추천홈상품_title']))
            assert self.FC.var['mainpage_el']['인터넷iptv_url'] in self.FC.driver.current_url, self.DBG.logger.debug("메인(로그인 후) > 추천 홈상품 가입 타이틀 링크 정상 이동 실패")
            self.FC.goto_url(self.FC.var['common_el']['url'])

            items=self.FC.loading_find_csss(self.FC.var['mainpage_el']['추천홈상품_콘텐츠'])
            items_titles=self.FC.loading_find_csss(self.FC.var['mainpage_el']['추천홈상품_콘텐츠_title'])
            random_num=random.randrange(0,len(items))
            title=items_titles[random_num].get_property('innerText')
            self.FC.move_to_click(items[random_num])

            titles=title.split(' + ')

            text_el=self.FC.loading_find_csss(self.FC.var['mainpage_el']['iptv상품상세_title'])
            assert self.FC.var['mainpage_el']['iptv상품상세_url'] in self.FC.driver.current_url and titles[0] in text_el[0].get_property('innerText') and titles[1] in text_el[1].get_property('innerText') ,self.DBG.logger.debug("메인(로그인 후) > 추천 홈상품 가입 임의 상품 링크 정상 이동 실패")
            self.FC.goto_url(self.FC.var['common_el']['url'])


        except  Exception :
            self.DBG.print_dbg("메인 페이지(로그인 후) 정상 노출 확인",False)
            return False

        else :
            self.DBG.print_dbg("메인 페이지(로그인 후) 정상 노출 확인")
            return True


    def mainpage_myinfo_new(self):
        self.FC.gotoHome()
        try:
            # 상단 개인 정보 영역
            self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['개인화'])
            result=[]

            text_list=['데이터','잔여량','청구요금','부가서비스 / 약정 / 할부 보기']
            result.append(self.FC.text_list_in_element(self.FC.var['mainpage_el']['개인화'],text_list))

            # FIXME 다른 상품이 없음으로 조회 불가(차후 주석 해제 필요)
            # self.FC.loading_find_css(self.FC.var['mainpage_el']['개인화_상품 조회 변경']).click()
            # result.append(len(self.FC.loading_find_csss(self.FC.var['mainpage_el']['개인화_모달_상품'])) > 0)
            # assert self.DBG.print_res(result), self.DBG.logger.debug("메인(로그인 후) > 상단 유저 정보 카드 > 콘텐츠 및 기능 정상 노출 실패")
            # self.FC.loading_find_css(self.FC.var['common_el']['modal_close']).click()

            self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['mainpage_el']['부가서비스_약정_할부 버튼']))
            self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['부가서비스_약정_할부 콘텐츠'])
            result.append(self.FC.wait_datas(self.FC.var['mainpage_el']['부가서비스_약정_할부 콘텐츠'],'p','dt','dd') != str)
            # text_list=['결합 상품','부가서비스','선택 약정'] # FIXME 다른 상품이 없음으로 조회 불가(차후 주석 해제 필요)
            text_list=['부가서비스']
            result.append(self.FC.text_list_in_element(self.FC.var['mainpage_el']['부가서비스_약정_할부 콘텐츠'],text_list))

            # FIXME 다른 상품이 없음으로 조회 불가(차후 주석 해제 필요)
            # links=[self.FC.var['mainpage_el']['이용중인 나의 상품 정보_url'],self.FC.var['mainpage_el']['부가서비스 조회/변경_url'],self.FC.var['mainpage_el']['할인반환금 정보_url'],self.FC.var['mainpage_el']['휴대폰 할부 약정 정보_url']]
            links=[self.FC.var['mainpage_el']['부가서비스 조회/변경_url']]
            extra_content=self.FC.loading_find_csss(self.FC.var['mainpage_el']['부가서비스_약정_할부 링크'])
            for link in links:
                index=links.index(link)
                extra_content=self.FC.loading_find_csss(self.FC.var['mainpage_el']['부가서비스_약정_할부 링크'])
                self.FC.move_to_click(extra_content[index])
                result.append(link in self.FC.driver.current_url)
                self.FC.goto_url(self.FC.var['common_el']['url'])
                self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['mainpage_el']['부가서비스_약정_할부 버튼']))

            assert self.DBG.print_res(result),self.DBG.logger.debug("메인(로그인 후) > 상단 유저 정보 카드 > 콘텐츠 및 기능 정상 노출 실패")

            #  퀵메뉴 탭
            self.FC.scroll_center(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['퀵메뉴']))
            text_list=['내 가입정보','해외로밍','데이터 선물','휴대폰 구매','인터넷/IPTV','일시정지/해제']
            assert self.FC.text_list_in_element(self.FC.var['mainpage_el']['퀵메뉴'],text_list), self.DBG.logger.debug("메인(로그인 후) > 퀵메뉴 콘텐츠 정상 노출 실패")

            # 혜택
            # 내가 받은 혜택/멤버십
            self.FC.wait_datas(self.FC.var['mainpage_el']['내가 받은 혜택'],'strong')
            self.FC.move_to_click(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['내가 받은 혜택']))
            assert self.FC.var['mainpage_el']['report_url'] in self.FC.driver.current_url,  self.DBG.logger.debug("메인(로그인 후) > 내가 받은 혜택 정상 이동 실패")
            self.FC.goto_url(self.FC.var['common_el']['url'])

            # FIXME 멤버십 바코드 확인 구간
            result.clear()
            self.FC.move_to_click(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['멤버십_바코드_버튼']))
            result.append(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['멤버십_바코드']).is_displayed())
            self.FC.loading_find_css(self.FC.var['mainpage_el']['멤버십_바코드_상세보기']).click()
            self.FC.wait_loading()
            result.append('/benefit/membership' in self.FC.driver.current_url)
            assert self.DBG.print_res(result),self.DBG.logger.debug("메인(로그인 후) > 멤버십 바코드 정상 기능 실패")
            self.FC.goto_url(self.FC.var['common_el']['url'])


            # 나의 멤버십
            tag_el=self.FC.loading_find_csss(self.FC.var['mainpage_el']['나의 멤버십_태그명'])
            tags=[]
            for i in range(len(tag_el)):
                tags.append(tag_el[i].get_property('innerText'))
            self.FC.scroll_center(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['나의 멤버십_링크']))
            self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['나의 멤버십_링크']).click()
            self.FC.wait_loading()
            assert self.FC.var['mainpage_el']['나의 멤버십_url'] in self.FC.driver.current_url, self.DBG.logger.debug("메인(로그인 후) > 나의 멤버십 정상 이동 실패")
            assert all(tag in self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['나의 멤버십_등급']).get_property('innerText') for tag in tags) , self.DBG.logger.debug("메인(로그인 후) > 나의 멤버십 > 나의 멤버십 등급 정상 노출 실패")
            self.FC.goto_url(self.FC.var['common_el']['url'])

            # 혜택 리스트
            result.clear()
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mainpage_el']['더 받을 수 있는 혜택']))
            result.append(3 == len(self.FC.loading_find_csss(self.FC.var['mainpage_el']['더 받을 수 있는 혜택_콘텐츠'])))
            # 더보기
            self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['mainpage_el']['더 받을 수 있는 혜택_더보기']))
            result.append(self.FC.var['mainpage_el']['나의 혜택 모아보기_url'] in self.FC.driver.current_url)
            self.FC.goto_url(self.FC.var['common_el']['url'])

            assert self.DBG.print_res(result), self.DBG.logger.debug("메인(로그인 후) > 나의 혜택 모아보기 콘텐츠 및 기능 정상 노출 실패")
            result.clear()

        except  Exception :
            self.DBG.print_dbg("메인 페이지(로그인 후) > 개인화 영역 정상 노출 확인",False)
            return False
        else :
            self.DBG.print_dbg("메인 페이지(로그인 후) > 개인화 영역 정상 노출 확인")
            return True
