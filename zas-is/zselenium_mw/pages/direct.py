class DirectPage():
    def __init__(self,WebDriver:WebDriver,FC:Function):
        self.FC=FC
        self.DBG=Debug(WebDriver)

    def direct(self):
        self.FC.gotoHome()

        try:
            self.FC.movepage(self.FC.var['direct_el']['direct'],self.FC.var['iptv_el']['direct'],address=self.FC.var['direct_el']['url'])

            # KV
            kv_list_el=self.FC.loading_find_csss(self.FC.var['direct_el']['kv_list'])
            assert (len(kv_list_el)) >= 1, self.DBG.logger.debug("다이렉트 > 서브메인 > KV 콘텐츠 정상 출력 실패")

            # 모달 제거
            self.FC.is_exists_element_click(self.FC.loading_find_css_pre(self.FC.var['common_el']['popup_close']))

            # 인터스티셜 창 닫기 추가
            self.FC.is_exists_element_click(self.FC.loading_find_xpath_pre(self.FC.var['common_el']['ins_close_button']))

            result=[]
            ## sec1(cont-01) 콘텐츠 확인
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['direct_el']['con_01']))

            text_list=['유심 가입 방법 확인']
            result.append(self.FC.text_list_in_element(self.FC.var['direct_el']['con_01'],text_list))
            assert self.DBG.print_res(result), self.DBG.logger.debug("다이렉트 > 유심 가입 컨텐츠 출력 실패")



            # 유플닷컴 전용 요금제
            result.clear()
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['direct_el']['con_02']))
            # direct_plan_tit = self.FC.loading_find_csss(self.FC.var['direct_el']['con_02_title'])
            # direct_plan_price = self.FC.loading_find_csss(self.FC.var['direct_el']['con_02_price'])
            direct_plan_btn = self.FC.loading_find_csss(self.FC.var['direct_el']['con_02_가입하기'])
            random_num = 0

            self.FC.scroll_center(direct_plan_btn[random_num])
            self.FC.click_until_go_page(direct_plan_btn[random_num])

            assert self.FC.var['direct_el']['전용요금제_가입하기_url'] in self.FC.driver.current_url, self.DBG.logger.debug("다이렉트 > 유플닷컴 전용 요금제 가입하기 페이지 이동 실패")
            self.FC.goto_url(self.FC.var['direct_el']['url'])

            self.FC.move_to_element(self.FC.loading_find_css(self.FC.var['direct_el']['con_03']))
            plan_list=self.FC.loading_find_csss(self.FC.var['direct_el']['con_03_li'])

            self.FC.move_to_element(plan_list[0])
            assert len(plan_list) == 4 , self.DBG.logger.debug("다이렉트 > 다이렉트 요금제 혜택 콘텐츠 노출 실패")

            #고객리뷰
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['direct_el']['con_04']))
            reviews = self.FC.loading_find_csss(self.FC.var['direct_el']['con_04_li'])
            assert len(reviews) >= 3 , self.DBG.logger.debug("다이렉트 > 고객리뷰 콘텐츠 노출 실패")

            #다이렉트를 가장 쉽게 만나는 방법
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['direct_el']['con_05']))
            li = self.FC.loading_find_csss(self.FC.var['direct_el']['con_05_li'])
            assert len(li) == 3 , self.DBG.logger.debug("다이렉트 > 다이렉트를 가장 쉽게 만나는 방법 콘텐츠 노출 실패")

            # 이번달 꿀혜택 영역
            self.FC.move_to_element(self.FC.loading_find_css(self.FC.var['direct_el']['con_06']))
            li = self.FC.loading_find_csss(self.FC.var['direct_el']['con_06_li'])
            assert len(li) == 3 , self.DBG.logger.debug("다이렉트 > 이번달 꿀헤택 콘텐츠 노출 실패")

        except  Exception :
            self.DBG.print_dbg("다이렉트 페이지 정상 노출 및 기능 동작 확인",False)
            return False

        else :
            self.DBG.print_dbg("다이렉트 페이지 정상 노출 및 기능 동작 확인")
            return True


