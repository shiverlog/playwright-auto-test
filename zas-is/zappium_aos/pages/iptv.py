def iptv(self):
        self.FC.gotoHome()
        try :
            self.FC.movepage(self.FC.var['iptv_el']['iptv'], self.FC.var['iptv_el']['direct'],address=self.FC.var['iptv_el']['iptv_url'])
            self.FC.modal_ck()

            # KV
            kv_list=self.FC.loading_find_csss(self.FC.var['iptv_el']['KV_링크'])
            assert len(kv_list) >0, self.DBG.logger.debug("인터넷/IPTV > KV 정상 노출 실패")

            # 서브메인 테마배너
            check_text_list=['맞춤상품찾기','인터넷','IPTV','스마트홈','가입 사은품']
            assert self.FC.text_list_in_element(self.FC.var['iptv_el']['테마배너'],check_text_list),self.DBG.logger.debug("인터넷/IPTV > 서브메인 > 테마베너 정상 출력 실패")
            theme_list_link=self.FC.loading_find_csss(self.FC.var['iptv_el']['테마배너_링크'])
            random_num= random.randrange(0,len(theme_list_link))
            if random_num == 0: # 1분 가입은 이동 시, 딜레이 생김
                random_num+=1
            check_link=theme_list_link[random_num].get_attribute('href')
            check_link=check_link[check_link.rfind('/'):]
            tab_name= theme_list_link[random_num].get_attribute('data-gtm-click-text')
            self.FC.move_to_click(theme_list_link[random_num])
            assert check_link in self.FC.driver.current_url,self.DBG.logger.debug(f"인터넷/IPTV > 서브메인 > 테마베너 > {tab_name}탭 정상 동작 실패")
            self.FC.goto_url(self.FC.var['iptv_el']['iptv_url'])

            # 이벤트 영역 콘텐츠 출력 및 링크 정상 이동
            event_list=self.FC.loading_find_csss(self.FC.var['iptv_el']['추천이벤트_링크'])
            assert len(event_list) >0, self.DBG.logger.debug("인터넷/IPTV > 서브메인 > 이벤트 영역 콘텐츠 정상 노출 실패")

            # 인터넷+IPTV 추천 결합 상품 영역 콘텐츠 출력 및 링크 이동 확인
            # 무작위로 추천 결합 상품 링크 이동 확인
            carousel=self.FC.loading_find_css_pre(self.FC.var['iptv_el']['추천 결합상품_carousel'])
            self.FC.move_to_element(carousel)

            # 무작위로 임의 결합 상품 선택
            random_num=random.randrange(0,3)
            for n in range(0,random_num):
                self.FC.action.click_and_hold(carousel).move_by_offset(-150,0).release().perform()

            ###### 가입상담 신청 버튼 UI 사라짐 ######
            # # 임의 선택된 결합 상품 데이터 저장
            # iptv_item_list=self.FC.loading_find_csss(self.FC.var['iptv_el']['추천 결합상품_상품정보'])
            # check_iptv_item={}
            # for num in range(0,int(len(iptv_item_list)/2)):
            #     check_iptv_item[iptv_item_list[num+num].get_property('innerText')]=iptv_item_list[num+(1*(num+1))].get_property('innerText')  # iptv_item['인터넷']='스마트기가 최대 500M, iptv_item['IPTV']='프리미엄 디즈니+
            # btn=self.FC.loading_find_css(self.FC.var['iptv_el']['추천 결합상품_가입상담 신청'])
            # self.FC.scroll_center(btn)
            # self.FC.move_to_click(btn)

            # # 가입신청 상담 팝업 정상 노출 확인
            # assert "가입상담 신청" in self.FC.loading_find_css(self.FC.var['iptv_el']['가입상담_신청_팝업_헤더']).get_property('innerText'), self.DBG.logger.debug("인터넷/IPTV > 서브메인 > 인터넷+IPTV 추천 결합 상품 임의 선택 > 가입신청 상담 페이지 정상 노출 실패")
            # consult_text = self.FC.loading_find_css(self.FC.var['iptv_el']['apply_consult']).get_property('innerText')
            # assert "전문 상담사" in consult_text, self.DBG.logger.debug("인터넷/IPTV > 서브메인 > 인터넷+IPTV 추천 결합 상품 임의 선택 > 가입신청 상담 페이지 정상 노출 실패")
            # # 가입신청 상담 페이지 데이터 정상 출력 확인
            # product_key_list=self.FC.loading_find_csss(self.FC.var['iptv_el']['가입상담_신청_팝업_data_col'])
            # product_value_list=self.FC.loading_find_csss(self.FC.var['iptv_el']['가입상담_신청_팝업_data_row'])
            # for num in range(0,len(check_iptv_item.keys())):
            #     key=product_key_list[num].get_property('innerText')     # 인터넷/IPTV/스마트홈 등
            #     value=product_value_list[num].get_property('innerText')     # 스마트기가 최대 1G/ 프리미엄 디즈니+/ 펫케어 스탠다드 등
            #     assert key in check_iptv_item, self.DBG.logger.debug(f"인터넷/IPTV > 서브메인 > 인터넷+IPTV 추천 결합 상품 임의 선택 > 가입신청 상담 페이지 데이터('{key}' 없음) 정상 노출 실패")
            #     assert value == check_iptv_item[key],self.DBG.logger.debug(f"인터넷/IPTV > 서브메인 > 인터넷+IPTV 추천 결합 상품 임의 선택 > 가입신청 상담 페이지 데이터('{value}') 정상 노출 실패")
            # self.FC.loading_find_css_pre(self.FC.var['iptv_el']['가입상담_신청_팝업_닫기']).click()

            # 온라인 가입 데이터 정상 출력 확인
            # product_value_list=self.FC.loading_find_csss(self.FC.var['iptv_el']['추천 결합상품_온라인가입_data'])

            # key는 체크X(아이콘으로 출력함)
            # for num in range(0,len(check_iptv_item.keys())):
            #     check_value_list=list(check_iptv_item.values())
            #     value=product_value_list[num].get_property('innerText')     # 스마트기가 최대 1G/ 프리미엄 디즈니+/ 펫케어 스탠다드 등
            #     assert value == check_value_list[num],self.DBG.logger.debug(f"인터넷/IPTV > 서브메인 > 인터넷+IPTV 추천 결합 상품 임의 선택 > 가입신청 상담 페이지 데이터('{value}') 정상 노출 실패")
            if self.FC.loading_find_css(self.FC.var['iptv_el']['가입상담_신청_팝업_헤더']):
                self.FC.loading_find_css_pre(self.FC.var['iptv_el']['가입상담_신청_팝업_닫기']).click()
            self.FC.move_to_element(self.FC.loading_find_css('div[section-group-id="MoSubMainInternetIptvBenefit1Section"]'))
            self.FC.move_to_click(self.FC.loading_find_css(self.FC.var['iptv_el']['추천 결합상품_온라인가입']))
            assert self.FC.var['iptv_el']['온라인가입_url'] in self.FC.driver.current_url, self.DBG.logger.debug("인터넷/IPTV > 서브메인 > 인터넷+IPTV 추천 결합 상품 임의 선택 > 온라인가입 페이지 정상노출 실패")

            self.FC.goto_url(self.FC.var['iptv_el']['iptv_url'])
            self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['iptv_el']['혜택_콘텐츠']))
            assert len(self.FC.loading_find_csss(self.FC.var['iptv_el']['혜택_콘텐츠_링크'])) > 0,self.DBG.logger.debug(f"인터넷/IPTV > 서브메인 > 혜택 콘텐츠 정상 노출 실패")

        except  Exception :
            self.DBG.print_dbg("인터넷/IPTV 페이지 정상 노출 및 기능 동작 확인",False)
            return False

        else :
            self.DBG.print_dbg("인터넷/IPTV 페이지 정상 노출 및 기능 동작 확인")
            return True
