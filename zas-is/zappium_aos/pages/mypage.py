class MypagePage():

    # 마이페이지 바로가기
    def mypage(self):
        self.FC.gotoHome()
        try:
            # 메인 > 마이페이지 > 바로가기
            self.FC.movepage(self.FC.var['mypage']['mypage'],self.FC.var['mypage']['direct'],address=self.FC.var['mypage']['mypage_url'])

            # 액션 정상 동작 확인은 상단 청구서 더보기 버튼으로 모바일에서 인터넷으로 전환되는지 동작 확인
            payment_list=['모바일','인터넷','결합']
            for payment in payment_list:
                dropdown = self.FC.loading_find_css_pre(self.FC.var['mypage']['청구서_드롭다운'])
                self.FC.move_to_element(dropdown)
                self.FC.driver.execute_script("arguments[0].click();", dropdown)
                self.FC.wait_loading()
                dropdown_list=self.FC.loading_find_csss(self.FC.var['mypage']['청구서_list'])

                is_continue=False
                for list in dropdown_list:
                    # 드롭다운 리스트에 모바일/인터넷/결합 상품이 존재하는지 확인 후, 드롭다운 기능 확인
                    if payment in list.get_property('innerText'):
                        index=dropdown_list.index(list)
                        radio_button=self.FC.loading_find_csss(self.FC.var['mypage']['청구서_radio_btn'])
                        radio_button[index].click()
                        self.FC.loading_find_css(self.FC.var['mypage']['청구서_하단_확인_버튼']).click()
                        self.FC.wait_loading()
                        mypage_info_text = self.FC.loading_find_css_pre(self.FC.var['mypage']['청구서_드롭다운']).get_property('innerText')      # 상단에 표시된 영역이 모바일인지 인터넷인지 확인
                        assert payment in mypage_info_text, self.DBG.logger.debug("마이페이지 > 서브메인 > 드롭다운 액션 오류(청구서 드롭다운 변경 실패)")
                        break
                    else:
                        # 드롭다운 리스트 마지막 요소에도 payment가 존재하지 않을 떄,
                        if list == dropdown_list[-1] :
                            self.FC.loading_find_css(self.FC.var['mypage']['청구서_하단_확인_버튼']).click()
                            is_continue=True
                            break
                        else:
                            pass

                # 모바일/인터넷/결합 상품 정보가 없다면, 다음 로직은 무시
                if is_continue is True:
                    continue

                text_list_result=[]

                # 콘텐츠 정상 출력 및 액션 정상 동작 확인 부분
                if "모바일" in mypage_info_text :
                    self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mypage']['모바일_정보']))
                    text_list=['총 제공량','사용량','잔여량']
                    text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['모바일_정보'],text_list))

                    self.FC.move_to_element(self.FC.loading_find_css_pre(self.FC.var['mypage']['청구_및_납부_정보']))
                    text_list=['청구 및 납부정보','청구요금','모바일']
                    text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['청구_및_납부_정보'],text_list))

                    self.FC.move_to_element(self.FC.loading_find_xpath_pre(self.FC.var['mypage']['주문정보']))
                    text_list_result.append(self.FC.loading_find_xpath_pre(self.FC.var['mypage']['주문정보']).is_displayed())

                    self.FC.move_to_element(self.FC.loading_find_xpath_pre(self.FC.var['mypage']['가입서비스']))
                    text_list=['모바일']
                    text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['가입서비스'],text_list))
                    assert all(text_list_result) is True, self.DBG.logger.debug(f"마이페이지 > 서브메인 > {mypage_info_text} 컨텐츠 정상 노출 확인 실패")


                # FIXME '인터넷' 청구서 정보를 가지고있는 계정 필요
                #...

                # 콘텐츠 정상 출력 및 액션 정상 동작 확인 부분
                text_list_result.clear()
                if "결합" in mypage_info_text :
                    self.FC.move_to_element(self.FC.loading_find_css(self.FC.var['mypage']['청구_및_납부_정보']))
                    text_list=['청구 및 납부정보','청구요금','결합']
                    text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['청구_및_납부_정보'],text_list))

                    self.FC.move_to_element(self.FC.loading_find_xpath(self.FC.var['mypage']['주문정보']))
                    text_list_result.append(self.FC.loading_find_xpath(self.FC.var['mypage']['주문정보']).is_displayed())

                    self.FC.move_to_element(self.FC.loading_find_xpath(self.FC.var['mypage']['가입서비스']))
                    text_list=['모바일','결합상품']
                    text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['가입서비스'],text_list))

                    text_list=['멤버십','사용 가능한 ez포인트' ]
                    text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['멤버십_정보'],text_list))

                    assert all(text_list_result) is True, self.DBG.logger.debug(f"마이페이지 > 서브메인 > {mypage_info_text} 컨텐츠 정상 노출 확인 실패")

        except  Exception :
            self.DBG.print_dbg("마이페이지 정상 노출 및 기능 동작 확인",False)
            return False

        else :
            self.DBG.print_dbg("마이페이지 정상 노출 및 기능 동작 확인")
            return True



    # 마이페이지 > 요금 조회/납부 > 요금 조회/납부 홈
    def mypage_bill(self):
        self.FC.gotoHome()

        try:
            self.FC.movepage(self.FC.var['mypage']['mypage'],self.FC.var['mypage']['bill_direct'],address=self.FC.var['mypage']['bill_url'])

            self.FC.move_to_click(self.FC.loading_find_css_pre(self.FC.var['mypage']['요금/납부_이동']))
            # 상단 유저 정보
            result=[]
            result.append(self.FC.wait_datas(self.FC.var['mypage']['납부_정보'],'p'))
            result.append(self.FC.text_list_in_element(self.FC.var['mypage']['납부_정보'],['납부방법','예금주/결제일','청구 받는 방법']))
            assert self.DBG.print_res(result),self.DBG.logger.debug(f"마이페이지 > 요금 조회/납부 > 요금 조회/납부 홈 > 상단 유저 컨텐츠 정상 노출 확인 실패")

            ## 마이페이지 > 청구요금 및 납부 > 드롭다운 액션(청구서 변경)
            payment_list=['모바일','인터넷','결합']
            for payment in payment_list:
                dropdown = self.FC.loading_find_css(self.FC.var['mypage']['청구서_드롭다운'])
                self.FC.move_to_element(dropdown)
                self.FC.driver.execute_script("arguments[0].click();", dropdown)
                self.FC.wait_loading()
                dropdown_list=self.FC.loading_find_csss(self.FC.var['mypage']['청구서_list'])

                # 이중 for문 탈출 변수
                is_continue=False
                for list in dropdown_list:
                    # 드롭다운 리스트에 모바일/인터넷/결합 상품이 존재하는지 확인 후, 드롭다운 기능 확인
                    if payment == list.get_property('innerText'):
                        index=dropdown_list.index(list)
                        radio_button=self.FC.loading_find_csss(self.FC.var['mypage']['청구서_radio_btn'])
                        radio_button[index].click()
                        self.FC.loading_find_css(self.FC.var['mypage']['청구서_하단_확인_버튼']).click()
                        self.FC.wait_loading()
                        mypage_info_text = self.FC.loading_find_css_pre(self.FC.var['mypage']['청구서_드롭다운']).get_property('innerText')      # 상단에 표시된 영역이 모바일인지 인터넷인지 확인
                        assert payment in mypage_info_text, self.DBG.logger.debug("마이페이지 > 요금 조회/납부 > 요금 조회/납부 홈 > 드롭다운 액션 오류(청구서 드롭다운 변경 실패)")
                        break
                    else:
                        # 드롭다운 리스트 마지막 요소에도 payment가 존재하지 않을 떄,
                        if list == dropdown_list[-1] :
                            self.FC.loading_find_css(self.FC.var['mypage']['청구서_하단_확인_버튼']).click()
                            is_continue=True
                            break
                        else:
                            pass

                # 모바일/인터넷/결합 상품 정보가 없다면, 다음 로직은 무시
                if is_continue is True:
                    continue

                # 콘텐츠 정상 출력 및 액션 정상 동작 확인 부분
                text_list_result=[]

                # 상단 섹션 정보(납부방법/예금주/결제일/청구받는방법) 출력 확인
                text_list=['납부방법','예금주','결제일','청구 받는 방법']
                text_list_result.append(self.FC.text_list_in_element('div.c-section-sm',text_list))

                # 청구내역/납부내역 데이터 출력 여부 확인
                tab_list=self.FC.loading_find_csss(self.FC.var['mypage']['청구_납부내역_tab'])
                for tab in tab_list:
                    self.FC.move_to_click(tab)
                    bill=self.FC.loading_find_csss(self.FC.var['mypage']['내역_list'])
                    if len(bill) == 0 :
                        self.DBG.logger.debug(f"마이페이지 > 요금 조회/납부 > 요금 조회/납부 홈 > {mypage_info_text} {tab.get_property('innerText')} 정보 없음")
                        raise Exception()
                    else:
                        text_list_result.append(True)

                assert all(text_list_result) is True, self.DBG.logger.debug(f"마이페이지 > 요금 조회/납부 > 요금 조회/납부 홈 > {mypage_info_text} 컨텐츠 정상 노출 확인 실패")

        except  Exception :
            self.DBG.print_dbg("마이페이지 > 요금 조회/납부 > 요금 조회/납부 홈 > 청구/납부내역에 대한 동작 및 정보 확인",False)
            return False

        else :
            self.DBG.print_dbg("마이페이지 > 요금 조회/납부 > 요금 조회/납부 홈 > 청구/납부내역에 대한 동작 및 정보 확인")
            return True

    # 마이페이지 > 사용현황 > 사용내역 조회
    def mypage_use(self):
        self.FC.gotoHome()
        try:
            self.FC.movepage(self.FC.var['mypage']['mypage'], self.FC.var['mypage']['use_direct'],address=self.FC.var['mypage']['use_url'])
            assert self.FC.var['mypage']['use_url'] in self.FC.loading_find_css(self.FC.var['mypage']['청구서_드롭다운']).get_property('baseURI'), self.DBG.logger.debug("마이페이지 > 사용현황 > 서브메인 페이지 이동 실패")

            payment_list=['모바일','인터넷','결합']
            for payment in payment_list:
                dropdown = self.FC.loading_find_css(self.FC.var['mypage']['청구서_드롭다운'])
                self.FC.move_to_element(dropdown)
                self.FC.driver.execute_script("arguments[0].click();", dropdown)
                self.FC.wait_loading()
                dropdown_list=self.FC.loading_find_csss(self.FC.var['mypage']['사용현황_청구서_list'])

                # 이중 for문 탈출 변수
                is_continue=False
                for list in dropdown_list:
                    # 드롭다운 리스트에 모바일/인터넷/결합 상품이 존재하는지 확인 후, 드롭다운 기능 확인
                    if payment == list.get_property('innerText'):
                        index=dropdown_list.index(list)
                        radio_button=self.FC.loading_find_csss(self.FC.var['mypage']['청구서_radio_btn'])
                        radio_button[index].click()
                        self.FC.loading_find_css(self.FC.var['mypage']['청구서_하단_확인_버튼']).click()
                        self.FC.wait_loading()

                        mypage_info_text = self.FC.loading_find_css_pre(self.FC.var['mypage']['청구서_드롭다운']).get_property('innerText')      # 상단에 표시된 영역이 모바일인지 인터넷인지 확인
                        assert payment in mypage_info_text, self.DBG.logger.debug("마이페이지 > 사용현황 > 사용내역 조회 > 드롭다운 액션 오류(청구서 드롭다운 변경 실패)")
                        break
                    else:
                        # 드롭다운 리스트 마지막 요소에도 payment가 존재하지 않을 떄,
                        if list == dropdown_list[-1] :
                            is_continue=True
                            break
                        else:
                            pass

                # 모바일/인터넷/결합 상품 정보가 없다면, 다음 로직은 무시
                if is_continue is True:
                    continue

                # 각 콘텐츠 출력 확인 결과 배열
                text_list_result=[]

                if '모바일' in mypage_info_text:

                    ##### 실시간 요금 조회 #####
                    tab=self.FC.loading_find_css(self.FC.var['mypage']['실시간요금조회'])
                    self.FC.move_to_click(tab)

                    # 실시간 요금 조회 콘텐츠 출력 확인
                    top_bill_total = self.FC.loading_find_xpath(self.FC.var['mypage']['top_bill']).text
                    if top_bill_total == '0원':
                        bottom_bill_total=self.FC.loading_find_xpath(self.FC.var['mypage']['실시간이용요금_정보']).text
                    else:
                        bottom_bill_total = self.FC.loading_find_xpath(self.FC.var['mypage']['bottom_bill']).text   # 하단 합계

                    text_list_result.append(top_bill_total == bottom_bill_total)

                    text_list=['현재까지 사용한 요금','조회기간','남은기간','사용기간']
                    text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['내역_정보'],text_list))

                    if top_bill_total == '0원':
                        text_list=['실시간 이용요금','합계']
                    else:
                        text_list=['실시간 이용요금','이동통신','월정액','미납합계','합계']
                    text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['사용내역_정보_상세'],text_list))

                    assert all(text_list_result) is True, self.DBG.logger.debug(f"마이페이지 > 사용현황 > 사용내역 조회 > {payment} 상품 실시간 요금조회 컨텐츠 정상 노출 확인 실패")

                    ##### 월별사용량 조회 #####
                    text_list_result.clear()
                    tab=self.FC.loading_find_css(self.FC.var['mypage']['월별사용량조회'])
                    self.FC.move_to_click(tab)

                    text_list=['메뉴','상세항목','비고']
                    text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['월별사용량조회_data_col'],text_list))

                    # 금월 텍스트
                    month=self.FC.loading_find_css(self.FC.var['mypage']['월_정보']).get_property('innerText')
                    month=month[:-1]
                    if month.startswith('0'):
                        month=month[1:]
                    month=int(month)

                    for i in range(0,4):
                        self.FC.wait_loading()
                        prev_month=self.FC.loading_find_css(self.FC.var['mypage']['월_정보']).get_property('innerText')
                        if month-i <= 0:
                            gab=month-i
                            monthly=12+gab
                        else:
                            monthly=month-i
                        assert str(monthly) in prev_month, self.DBG.logger.debug(f"마이페이지 > 사용현황 > 사용내역 조회 > {payment} 상품 월별사용량조회 최근 4개월 사용량 조회 실패")
                        self.FC.move_to_element(self.FC.loading_find_css(self.FC.var['mypage']['이전_월_버튼']))
                        self.FC.driver.execute_script("arguments[0].click();", self.FC.loading_find_css(self.FC.var['mypage']['이전_월_버튼']))

                    # 월별 사용량 상세 조회
                    self.FC.wait_loading()
                    self.FC.move_to_click(self.FC.loading_find_css_pre(self.FC.var['mypage']['월별사용량_상세조회_버튼']))
                    text_list=['국내통화','데이터', '메시지', '부가서비스']
                    text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['월별사용량_상세조회_tab'],text_list))
                    text_list_result.append(str(monthly) in self.FC.loading_find_css(self.FC.var['mypage']['월별사용량_상세_날짜']).get_property('innerText'))
                    self.FC.move_to_element(self.FC.loading_find_css(self.FC.var['mypage']['월별사용량_상세_확인_버튼']))
                    # TODO 가끔 확인 버튼이 클릭이 안됄 때가 있어서 스크립트로 실행
                    self.FC.driver.execute_script("arguments[0].click();", self.FC.loading_find_css(self.FC.var['mypage']['월별사용량_상세_확인_버튼']))

                    assert all(text_list_result) is True, self.DBG.logger.debug(f"마이페이지 > 사용현황 > 사용내역 조회 > {payment} 상품 월별사용량조회 컨텐츠 정상 노출 확인 실패")

                    ##### 통화 상세 내역 조회 #####
                    text_list_result.clear()
                    while True:
                        self.FC.scroll_to_top()
                        tab=self.FC.loading_find_css_pre(self.FC.var['mypage']['통화상세내역'])
                        self.FC.move_to_click(tab)
                        if 'is-active' in self.FC.loading_find_css_pre(self.FC.var['mypage']['통화상세내역']).get_property('className'):
                            break

                    text_list=['이름','서비스 유형','국내통화','해외통화','전화번호']
                    text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['내역_정보'],text_list))

                    self.FC.loading_find_css(self.FC.var['mypage']['조회_버튼']).click()
                    text_list=['가까운 매장찾기','서비스 신청방법 보기']
                    text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['통화상세내역_조회'],text_list))
                    self.FC.loading_find_css(self.FC.var['mypage']['통화상세내역_조회_확인_버튼']).click()

                    assert all(text_list_result) is True, self.DBG.logger.debug(f"마이페이지 > 사용현황 > 사용내역 조회 > {payment} 상품 월별사용량조회 컨텐츠 정상 노출 확인 실패")


                # TODO '인터넷' 출력 확인 필요
                # ...

                if '결합' in mypage_info_text:

                    ##### 통화 상세 내역 조회 #####
                    tab=self.FC.loading_find_xpath(self.FC.var['mypage']['결합_통화상세내역_조회'])
                    self.FC.move_to_click(tab)

                    # TODO DCBGQA-343 이슈로 수정 및 추가 필요<<<
                    text_list=['이름','서비스 유형','전화번호']
                    text_list_result.append(self.FC.text_list_in_element('div.mypage-usedinfo-callhistory',text_list))

                    if all(text_list_result) is False:
                        self.DBG.logger.debug(f"마이페이지 > 사용현황 > 사용내역 조회 > {payment} 상품 월별사용량조회 컨텐츠 정상 노출 확인 실패")
                        raise Exception()



                    ##### 기가 인터넷 사용량 #####
                    tab=self.FC.loading_find_xpath('//*[@class="swiper-wrapper"]/li[2]/a')
                    self.FC.move_to_click(tab)

                    text_list=['고객정보','이름','요금제','설치장소']
                    text_list_result.append(self.FC.text_list_in_element('div.mypage-usedinfo >div.c-section-md:not(.use-amount)',text_list))

                    text_list=['사용량','일일 기본제공량']
                    text_list_result.append(self.FC.text_list_in_element('div.use-amount',text_list))

                    if all(text_list_result) is False:
                        self.DBG.logger.debug(f"마이페이지 > 사용현황 > 사용내역 조회 > {payment} 상품 월별사용량조회 컨텐츠 정상 노출 확인 실패")
                        raise Exception()




                    ##### IPTV컨텐츠 사용내역 #####
                    tab=self.FC.loading_find_xpath('//*[@class="swiper-wrapper"]/li[3]/a')
                    self.FC.move_to_click(tab)

                    text_list=['고객정보','이름','가입상품','설치장소','인증']
                    text_list_result.append(self.FC.text_list_in_element('div.used-info >div.c-section-md:nth-of-type(1)',text_list))

                    text_list=['본인인증','휴대폰','바이오','PASS','TOSS','카카오','네이버','아이핀']
                    text_list_result.append(self.FC.text_list_in_element('div.used-info >div.c-section-md:nth-of-type(2) div.component__inner',text_list))

                    # 본인인증 인증하기 버튼 정상 출력 확인
                    button_list=self.FC.loading_find_csss('div.used-info >div.c-section-md:nth-of-type(2) div.component__inner label')
                    text_list_result.append(len(button_list) == 7)

                    assert all(text_list_result) is True, self.DBG.logger.debug(f"마이페이지 > 사용현황 > 사용내역 조회 > {payment} 상품 월별사용량조회 컨텐츠 정상 노출 확인 실패")



        except  Exception :
            self.DBG.print_dbg("마이페이지 > 사용현황 > 사용내역 조회 대한 내역 확인 및 페이지 정상 노출 확인",False)
            if self.FC.loading_find_css_pre('div.modal-content li.c-radio-box-3 >span>label>span.tit:nth-of-type(1)'):
                self.FC.loading_find_css_pre('div.modal-content footer>div>button.c-btn-solidbox-2').click()
            return False

        else :
            self.DBG.print_dbg("마이페이지 > 사용현황 > 사용내역 조회 대한 내역 확인 및 페이지 정상 노출 확인")
            return True
