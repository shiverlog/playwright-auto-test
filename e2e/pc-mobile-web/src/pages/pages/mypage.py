import sys
import traceback
import time
from base.webdriver import WebDriver
from common.function import Function
from common.debug import Debug
from pages.login import LoginPage

class MypagePage():
    def __init__(self,WebDriver:WebDriver,FC:Function):
        self.FC=FC
        self.DBG=Debug(WebDriver)
        

    # 마이페이지 서브메인
    def mypage(self):           
        self.FC.gotoHome()
        try:
            self.FC.movepage(self.FC.var['mypage']['mypage'],self.FC.var['mypage']['direct'],address=self.FC.var['mypage']['mypage_url'])

            # 상단 청구서 더보기로 상품 변경
            payment_list=['모바일','인터넷','결합']
            for payment in payment_list:
                dropdown = self.FC.loading_find_css_pre(self.FC.var['mypage']['dropdown'])
                self.FC.move_to_element(dropdown)
                self.FC.driver.execute_script("arguments[0].click();", dropdown)
                self.FC.wait_loading()
                dropdown_list=self.FC.loading_find_csss(self.FC.var['mypage']['dropdown_list'])

                is_continue=False
                for list in dropdown_list:
                    # 드롭다운 리스트에 모바일/인터넷/결합 상품이 존재하는지 확인 후, 드롭다운 기능 확인
                    if payment in list.get_property('innerText'):
                        index=dropdown_list.index(list)
                        radio_button=self.FC.loading_find_csss(self.FC.var['mypage']['dropdown_list_radio_btn'])
                        radio_button[index].click()
                        self.FC.loading_find_css_pre(self.FC.var['mypage']['dropdown_close']).click()
                        self.FC.wait_loading()
                        mypage_info_text = self.FC.loading_find_css_pre(self.FC.var['mypage']['dropdown_select_text']).get_property('innerText') # 상단에 표시된 영역이 모바일인지 인터넷인지 확인
                        mypage_info_detail_text= self.FC.loading_find_css_pre(self.FC.var['mypage']['dropdown_select_detail_text']).get_property('innerText')
                        assert payment == mypage_info_text, self.DBG.logger.debug("마이페이지 > 서브메인 > 드롭다운 액션 오류(청구서 드롭다운 변경 실패)")
                        break
                    else:
                        # 드롭다운 리스트 마지막 요소에도 payment가 존재하지 않을 떄, 
                        if list == dropdown_list[-1] :
                            is_continue=True
                            self.FC.loading_find_csss(self.FC.var['mypage']['dropdown_close'])[0].click()
                            break
                        else:
                            pass
                    
                # 모바일/인터넷/결합 상품 정보가 없다면, 다음 로직은 무시
                if is_continue == True:
                    continue  

                text_list_result=[]

                ## 콘텐츠 정상 출력 및 액션 정상 동작 확인 부분
                # TODO 모바일/인터넷 청구서 정보를 가지고있는 계정 필요
                #...

                # 콘텐츠 정상 출력 및 액션 정상 동작 확인 부분
                text_list_result.clear()
                if "결합" in mypage_info_text :
                    if "이동통신" in mypage_info_detail_text:
                        text_list=['총 제공량','사용량','잔여량']
                        text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['서브메인_상단 데이터 사용량'],text_list))

                    text_list=['청구 및 납부정보','청구요금','결합']
                    text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['서브메인_상단 청구 및 납부정보'],text_list))

                    data_list=self.FC.loading_find_csss(self.FC.var['mypage']['서브메인_상단 데이터'])
                    for data in data_list:
                        text_list_result.append(data.get_property('innerText') != '')

                    assert all(text_list_result), self.DBG.logger.debug(f"마이페이지 > 서브메인 > {mypage_info_text} 상단 콘텐츠 정상 노출 확인 실패")

                    self.FC.move_to_element(self.FC.loading_find_xpath_pre(self.FC.var['mypage']['주문정보']))
                    assert self.FC.loading_find_xpath_pre(self.FC.var['mypage']['주문정보']).is_displayed(),self.DBG.logger.debug(f"마이페이지 > 서브메인 > 주문정보 콘텐츠 정상 노출 확인 실패")

                    self.FC.move_to_element(self.FC.loading_find_xpath_pre(self.FC.var['mypage']['가입서비스']))
                    text_list=['모바일','인터넷','IPTV','인터넷전화','스마트홈','결합상품']
                    assert self.FC.text_list_in_element(self.FC.var['mypage']['가입서비스'],text_list),self.DBG.logger.debug(f"마이페이지 > 서브메인 > 가입서비스 콘텐츠 정상 노출 확인 실패")

                    text_list=['멤버십','사용 가능한 ez포인트' ]
                    assert self.FC.text_list_in_element(self.FC.var['mypage']['멤버십'],text_list),self.DBG.logger.debug(f"마이페이지 > 서브메인 > 가입서비스 콘텐츠 정상 노출 확인 실패")
           
        except  Exception :
            self.DBG.print_dbg("마이페이지 정상 노출 및 기능 동작 확인",False)
            return False

        else :
            self.DBG.print_dbg("마이페이지 정상 노출 및 기능 동작 확인")
            return True

    # 마이페이지  > 요금 조회/납부
    def mypage_bill(self):
        self.FC.gotoHome()
        try:
            self.FC.movepage(self.FC.var['mypage']['mypage'],self.FC.var['mypage']['bill_direct'],address=self.FC.var['mypage']['bill_url'])

            ## 마이페이지 > 요금 조회/납부 > 드롭다운 액션(청구서 변경)
            payment_list=['모바일','인터넷','결합']
            for payment in payment_list:
                dropdown = self.FC.loading_find_css_pre(self.FC.var['mypage']['dropdown'])
                self.FC.move_to_element(dropdown)
                self.FC.driver.execute_script("arguments[0].click();", dropdown)
                self.FC.wait_loading()
                dropdown_list=self.FC.loading_find_csss(self.FC.var['mypage']['dropdown_list'])

                is_continue=False
                for list in dropdown_list:
                    # 드롭다운 리스트에 모바일/인터넷/결합 상품이 존재하는지 확인 후, 드롭다운 기능 확인
                    if payment == list.get_property('innerText'):
                        index=dropdown_list.index(list)
                        radio_button=self.FC.loading_find_csss(self.FC.var['mypage']['dropdown_list_radio_btn'])
                        radio_button[index].click()
                        self.FC.loading_find_css_pre(self.FC.var['mypage']['dropdown_close']).click()
                        self.FC.wait_loading()
                        # time.sleep(2)      #드롭다운 변경 후 반영 대기시간
                        mypage_info_text = self.FC.loading_find_css_pre(self.FC.var['mypage']['dropdown_select_text']).get_property('innerText')      # 상단에 표시된 영역이 모바일인지 인터넷인지 확인
                        assert payment == mypage_info_text, self.DBG.logger.debug("마이페이지 > 요금 조회/납부 > 서브메인 > 드롭다운 액션 오류(청구서 드롭다운 변경 실패)")
                        break
                    else:
                        # 드롭다운 리스트 마지막 요소에도 payment가 존재하지 않을 떄, 
                        if list == dropdown_list[-1] :
                            is_continue=True
                            self.FC.loading_find_csss(self.FC.var['mypage']['dropdown_close'])[0].click()
                            break
                        else:
                            pass
                    
                # 모바일/인터넷/결합 상품 정보가 없다면, 다음 로직은 무시
                if is_continue == True:
                    continue  


                ## 마이페이지 > 요금 조회/납부 > 상단 정보 
                # 결합
                if "결합" in mypage_info_text :
                    # 상단 섹션 정보(납부방법/예금주/결제일/청구받는방법) 출력 확인
                    text_list=['납부방법','예금주','결제일','청구 받는 방법']
                    assert self.FC.text_list_in_element(self.FC.var['mypage']['상단 청구정보'],text_list),self.DBG.logger.debug(f"마이페이지 > 요금 조회/납부 > 서브메인 > 상단 납부 정보 미출력")
                    data_list=self.FC.loading_find_csss(self.FC.var['mypage']['상단 청구정보 데이터'])
                    for data in data_list:
                        assert data.get_property('innerText') != '',self.DBG.logger.debug(f"마이페이지 > 요금 조회/납부 > 서브메인 > 상단 납부 정보 미출력")
                    

                    ## 마이페이지 > 요금 조회/납부 > 청구내역/납부내역 데이터 출력 여부 확인
                    tab_list=self.FC.loading_find_csss(self.FC.var['mypage']['청구요금 및 납부 탭'])
                    assert '청구내역' in tab_list[0].get_property('innerText') and '납부내역' in tab_list[1].get_property('innerText'), self.DBG.logger.debug(f"마이페이지 > 요금 조회/납부 > 탭 정상 출력 실패")

                    for tab in tab_list:
                        self.FC.move_to_click(tab)
                        bill_list=self.FC.loading_find_csss(self.FC.var['mypage']['panel_list'])
                        bill_list_len=len(bill_list)
                        assert  bill_list_len > 0 , self.DBG.logger.debug(f"마이페이지 > 요금 조회/납부 > 서브메인 > {mypage_info_text} {tab.get_property('innerText')} 정보 없음")
                        for bill in bill_list:
                            assert bill.get_property('children')[0].get_property('innerText') != '', self.DBG.logger.debug(f"마이페이지 > 요금 조회/납부 > {tab.get_property('innerText')}탭 데이터 비정상 출력")
                            assert bill.get_property('children')[1].get_property('innerText') != '', self.DBG.logger.debug(f"마이페이지 > 요금 조회/납부 > {tab.get_property('innerText')}탭 데이터 비정상 출력")

                        self.FC.move_to_click(self.FC.loading_find_xpath(self.FC.var['mypage']['더보기 버튼']))

                        bill_list=self.FC.loading_find_csss(self.FC.var['mypage']['panel_list'])
                        assert len(bill_list) >= bill_list_len, self.DBG.logger.debug(f"마이페이지 > 요금 조회/납부 > 서브메인 > {tab.get_property('innerText')}탭 더보기 액션 정상 동작")

                ## TODO 모바일, 인터넷 데이터 확인 필요
                # ...

        except  Exception :
            self.DBG.print_dbg("마이페이지 > 요금 조회/납부 > 서브메인 > 요금 조회/납부내역에 대한 동작 및 정보 확인",False)
            return False

        else :
            self.DBG.print_dbg("마이페이지 > 요금 조회/납부 > 서브메인 > 요금 조회/납부내역에 대한 동작 및 정보 확인")
            return True


    # 마이페이지 > 사용현황 > 사용내역 조회 진입 
    def mypage_use(self):
        self.FC.gotoHome()
        try:
            self.FC.movepage(self.FC.var['mypage']['mypage'], self.FC.var['mypage']['use_direct'],address=self.FC.var['mypage']['use_url'])

            payment_list=[['모바일'],['인터넷'],['결합','이동통신'],['결합','인터넷']]
            for payment in payment_list:
                dropdown = self.FC.loading_find_css_pre(self.FC.var['mypage']['dropdown'])
                self.FC.move_to_element(dropdown)
                self.FC.driver.execute_script("arguments[0].click();", dropdown)
                self.FC.wait_loading()
                dropdown_list=self.FC.loading_find_csss(self.FC.var['mypage']['사용현황_dropdown_list'])

                # 이중 for문 탈출 변수
                is_continue=False
                for list in dropdown_list:
                    # 드롭다운 리스트에 모바일/인터넷/결합 상품이 존재하는지 확인 후, 드롭다운 기능 확인
                    if payment == list.get_property('innerText'):
                        index=dropdown_list.index(list)
                        radio_button=self.FC.loading_find_csss(self.FC.var['mypage']['dropdown_list_radio_btn'])
                        radio_button[index].click()
                        self.FC.loading_find_csss(self.FC.var['mypage']['dropdown_close'])[1].click()
                        self.FC.wait_loading()

                        mypage_info_text = self.FC.loading_find_css_pre(self.FC.var['mypage']['사용현황_dropdown_select_text']).get_property('innerText') 
                        assert all(key in mypage_info_text for key in payment ), self.DBG.logger.debug("마이페이지 > 사용현황 > 서브메인 > 드롭다운 액션 오류(청구서 드롭다운 변경 실패)")
                        break
                    else:
                        # 드롭다운 리스트 마지막 요소에도 payment가 존재하지 않을 떄, 
                        if list == dropdown_list[-1] :
                            is_continue=True
                            self.FC.loading_find_csss(self.FC.var['mypage']['dropdown_close'])[0].click()
                            break
                        else:
                            pass
                    
                # 모바일/인터넷/결합 상품 정보가 없다면, 다음 로직은 무시
                if is_continue == True:
                    continue  

                # 각 콘텐츠 출력 확인 결과 배열
                text_list_result=[]


                # TODO 모바일/인터넷 출력 확인 필요
                # ...

                if '모바일' in mypage_info_text or all(key in mypage_info_text for key in ['결합','이동통신']):
                    ##  마이페이지 > 사용현황 > 실시간 요금 조회 탭(모바일 상품)
                    tab=self.FC.loading_find_xpath(self.FC.var['mypage']['실시간요금조회'])
                    self.FC.move_to_click(tab)

                    # 실시간 요금 조회 콘텐츠 출력 확인
                    top_bill_total = self.FC.loading_find_xpath(self.FC.var['mypage']['top_bill']).text     # 상단 실시간 요금
                    if top_bill_total == '0원':
                        bottom_bill_total=self.FC.loading_find_xpath(self.FC.var['mypage']['이동통신요금']).text
                    else:    
                        bottom_bill_total = self.FC.loading_find_xpath(self.FC.var['mypage']['bottom_bill']).text   # 하단 합계
                    text_list_result.append(top_bill_total == bottom_bill_total)
                    text_list=['현재까지 사용한 요금','조회기간','남은기간','사용기간']
                    text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['현재까지_사용한_요금'],text_list))

                    if top_bill_total == '0원':
                        text_list=['실시간 이용요금','합계']
                    else:
                        text_list=['실시간 이용요금','이동통신','월정액','미납합계','합계']
                    text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['실시간이용요금_panel'],text_list))
                    
                    assert all(text_list_result), self.DBG.logger.debug(f"마이페이지 > 사용현황 > 서브메인 > {payment} 상품 실시간 요금조회 컨텐츠 정상 노출 확인 실패")

                    ## 마이페이지 > 사용현황 > 월별사용량조회
                    text_list_result.clear()
                    tab=self.FC.loading_find_xpath(self.FC.var['mypage']['월별사용량조회'])
                    self.FC.move_to_click(tab)
                    text_list=['메뉴','상세항목','비고']
                    text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['월별사용량조회_column'],text_list))

                    # 금월 텍스트
                    month=self.FC.loading_find_css(self.FC.var['mypage']['월별사용량조회_월']).get_property('innerText')
                    month=month[:-1]
                    if month.startswith('0'):
                        month=month[1:]
                    month=int(month)

                    for i in range(0,4):
                        self.FC.wait_loading()
                        prev_month=self.FC.loading_find_css(self.FC.var['mypage']['월별사용량조회_월']).get_property('innerText')
                        if month-i <= 0:
                            gab=month-i
                            monthly=12-gab
                        else:
                            monthly=month-i
                        assert str(monthly) in prev_month,self.DBG.logger.debug(f"마이페이지 > 사용현황 > 서브메인 > {payment} 상품 월별사용량조회 최근 4개월 사용량 조회 실패")
                        self.FC.action.move_to_element(self.FC.loading_find_css(self.FC.var['mypage']['월별사용량조회_뒤로가기'])).perform()
                        self.FC.action.reset_actions()
                        self.FC.driver.execute_script("arguments[0].click();", self.FC.loading_find_css(self.FC.var['mypage']['월별사용량조회_뒤로가기'])) 

                    ##  마이페이지 > 사용현황 > 월별사용량조회 > 월별 사용량 상세 조회
                    self.FC.wait_loading()
                    self.FC.move_to_click(self.FC.loading_find_css_pre(self.FC.var['mypage']['월별사용량상세조회']))
                    text_list=['국내통화','데이터', '메시지', '부가서비스']
                    text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['월별사용량상세_탭'],text_list))
                    text_list_result.append(str(monthly) in self.FC.loading_find_css(self.FC.var['mypage']['월별사용량상세_월']).get_property('innerText'))
                    self.FC.move_to_element(self.FC.loading_find_css(self.FC.var['mypage']['월별사용량상세_확인']))
                    # TODO 가끔 확인 버튼이 클릭이 안됄 때가 있어서 스크립트로 실행
                    self.FC.driver.execute_script("arguments[0].click();", self.FC.loading_find_css(self.FC.var['mypage']['월별사용량상세_확인']))    
                    assert all(text_list_result), self.DBG.logger.debug(f"마이페이지 > 사용현황 > 서브메인 > {payment} 상품 월별사용량조회 컨텐츠 정상 노출 확인 실패")

                    ## 마이페이지 > 사용현황 > 통화상세내역
                    text_list_result.clear()
                    while True:
                        self.FC.scroll(0)
                        tab=self.FC.loading_find_xpath_pre(self.FC.var['mypage']['통화상세내역'])
                        self.FC.move_to_click(tab)
                        if 'is-active' in self.FC.loading_find_css_pre(self.FC.var['mypage']['통화상세내역']).get_property('className'):
                            break
                                            
                    text_list=['이름','서비스 유형','국내통화','해외통화','전화번호']
                    text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['통화상세내역_panel'],text_list))
                    self.FC.loading_find_css(self.FC.var['mypage']['통화상세내역_조회']).click()
                    text_list=['가까운 매장찾기','서비스 신청방법 보기']
                    text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['통화상세내역_조회_팝업'],text_list))
                    self.FC.loading_find_css(self.FC.var['mypage']['통화상세내역_조회_팝업_확인']).click()
                    assert all(text_list_result), self.DBG.logger.debug(f"마이페이지 > 사용현황 > 서브메인 > {payment} 상품 월별사용량조회 컨텐츠 정상 노출 확인 실패")

                    if all(key in mypage_info_text for key in ['결합','인터넷']):
                        ##  마이페이지 > 사용현황 > 통화상세내역
                        tab=self.FC.loading_find_xpath_pre(self.FC.var['mypage']['통화상세내역'])
                        self.FC.move_to_click(tab)
                        text_list=['이름','서비스 유형','전화번호']
                        assert self.FC.text_list_in_element(self.FC.var['mypage']['통화상세내역_panel'],text_list),self.DBG.logger.debug(f"마이페이지 > 사용현황 > 서브메인 > 통화상세내역 콘텐츠 정상 노출 확인 실패")

                        if all(text_list_result)== False:
                            self.DBG.logger.debug(f"마이페이지 > 사용현황 > 서브메인 > {payment} 상품 월별사용량조회 컨텐츠 정상 노출 확인 실패")
                            raise Exception() 

                        ##  마이페이지 > 사용현황 > 기가인터넷사용량
                        tab=self.FC.loading_find_xpath(self.FC.var['mypage']['기가인터넷사용량'])
                        self.FC.move_to_click(tab)
                        text_list=['고객정보','이름','요금제','설치장소']
                        text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['기가인터넷사용량_고객정보'],text_list))
                        
                        if all(text_list_result) is False:
                            self.DBG.logger.debug(f"마이페이지 > 사용현황 > 서브메인 > {payment} 상품 월별사용량조회 컨텐츠 정상 노출 확인 실패")
                            raise Exception() 


                        ## 마이페이지 > 사용현황 > IPTV컨텐츠사용내역
                        tab=self.FC.loading_find_xpath(self.FC.var['mypage']['IPTV컨텐츠사용내역'])
                        self.FC.move_to_click(tab)
                        text_list=['고객정보','이름','가입상품','설치장소','인증']
                        text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['iptv컨텐츠사용내역_고객정보'],text_list))
                        text_list=['본인인증','휴대폰','PASS','TOSS','카카오','네이버','아이핀']
                        text_list_result.append(self.FC.text_list_in_element(self.FC.var['mypage']['iptv컨텐츠사용내역_본인인증'],text_list))

                        # 본인인증 인증하기 버튼 정상 출력 확인
                        button_list=self.FC.loading_find_csss(self.FC.var['mypage']['iptv컨텐츠사용내역_본인인증_btns'])
                        text_list_result.append(len(button_list) == 6)
                        assert all(text_list_result), self.DBG.logger.debug(f"마이페이지 > 사용현황 > 서브메인 > {payment} 상품 월별사용량조회 컨텐츠 정상 노출 확인 실패")
            
        except  Exception :
            self.DBG.print_dbg("마이페이지 > 사용현황 > 사용현황 대한 내역 확인 및 페이지 정상 노출 확인",False)
            return False

        else :
            self.DBG.print_dbg("마이페이지 > 사용현황 > 사용현황 대한 내역 확인 및 페이지 정상 노출 확인")
            return True



if __name__ == "__main__":
    driver = WebDriver()
    fc = Function(driver)
    mypage = MypagePage(driver,fc)
    login = LoginPage(driver,fc)

    # 공통모듈로 분리?
    if fc.is_login():
        login.logout()
        
    login.u_plus_login()

    mypage.mypage()
    mypage.mypage_bill()
    mypage.mypage_use()
    mypage.mypage_membership()
    driver.driver.quit()
    driver.kill()

