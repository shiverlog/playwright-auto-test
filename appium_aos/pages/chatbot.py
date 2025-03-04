import common.variable as var               # 지정한 변수 모듈
import traceback        # 콘솔창에 오류 메세지 출력
import sys  # 현재 호출하는 함수명 반환 모듈
from common.function import Function
from base.appdriver import AppDriver
import time
from common.debug import Debug


class ChatbotPage():
    def __init__(self,AppDriver:AppDriver,FC:Function):
        # self.driver=WebDriver.driver
        self.FC=FC
        self.DBG=Debug(AppDriver)

####################### 챗봇 #################################
    def chatbot(self):
        self.FC.gotoHome()
        try:
            # time.sleep(3)
            self.FC.loading_find_xpath(self.FC.var['chatbot_el']['chatbot_id']).click()                                               # 챗봇 메인 클릭
            # time.sleep(1)
            
            # 쇼핑상담 챗봇
            self.FC.loading_find_xpath(self.FC.var['chatbot_el']['chatbot_shopping']).click()                                         # 빠른가입 챗봇 클릭
            # time.sleep(2)
            self.FC.driver.switch_to.window(self.FC.driver.window_handles[-1])
            self.FC.loading_find_xpath(self.FC.var['chatbot_el']['device_buy']).click()                                               # 핸드폰 구매 영역 선택
            # time.sleep(1)
            time.sleep(1)
            self.FC.loading_find_xpath(self.FC.var['chatbot_el']['device_search']).click()                                           # 기기 검색 영역 선택
            time.sleep(1)
            # device_select = self.FC.driver.find_elements(By.XPATH, self.FC.var['chatbot_el']['device_area'])
            device_select=self.FC.loading_find_xpaths(self.FC.var['chatbot_el']['device_area'])
            device_elem = device_select[0]
            print(f"휴대폰 == {device_elem.get_property('innerText')}")
            device_elem.click()                                                                                             # 휴대폰 영역 선택
            time.sleep(1)
            self.FC.loading_find_xpath(self.FC.var['chatbot_el']['device_search_page']).is_displayed()                                # 휴대폰 검색 페이지 노출 확인
            self.FC.loading_find_xpath(self.FC.var['chatbot_el']['device_search_close']).click()                                      # 휴대폰 검색 페이지 닫기 버튼 선택
            # self.FC.driver.implicitly_wait(10)
            self.FC.loading_find_xpath(self.FC.var['chatbot_el']['reset_page']).click()                                               # 초기 선택 영역으로 이동
            time.sleep(1)
            self.FC.loading_find_xpath(self.FC.var['chatbot_el']['price_area']).click()                                               # 요금제 변경/청구 요금 등 영역 선택
            # time.sleep(2)
            self.FC.driver.switch_to.window(self.FC.driver.window_handles[-1])
            self.FC.loading_find_xpath(self.FC.var['chatbot_el']['select_item']).click()                                              # 항목 선택 (현재 9번째 항목 : 홈 이전설치 설정된 상태)
            # time.sleep(2)
            # num1 = self.FC.driver.find_elements(By.XPATH, self.FC.var['chatbot_el']['satisfied_1'])
            time.sleep(1)
            num1 = self.FC.loading_find_xpaths(self.FC.var['chatbot_el']['satisfied_1'])
            num_elem1 = len(num1)
            print(f"--->>>>>num_elem1 => {num_elem1}")
            self.FC.loading_find_xpath_pre('//*[@id="container"]/section['+ str(num_elem1) +']/div/section/button[1]').click() # 만족해요 선택
            # time.sleep(2)
            self.FC.loading_find_xpath(self.FC.var['chatbot_el']['left_close']).click()                                               # 좌측 상단 닫기 버튼 선택
            self.FC.driver.switch_to.window(self.FC.driver.window_handles[-1])
            # time.sleep(2)
            self.FC.loading_find_xpath(self.FC.var['chatbot_el']['right_close']).click()                                              # 우측 상단 닫기 버튼 선택
            # time.sleep(1)
            star5 = self.FC.loading_find_xpath(self.FC.var['chatbot_el']['star5_el'])
            self.FC.driver.execute_script("arguments[0].click();", star5)                                          # 별점 5점 선택
            # time.sleep(1)
            self.FC.loading_find_xpath(self.FC.var['chatbot_el']['thirty']).click()                                                   # 30대 선택
            # time.sleep(1)
            self.FC.loading_find_xpath(self.FC.var['chatbot_el']['send_rating']).click()                                              # 평가 보내기 선택
            # self.FC.driver.implicitly_wait(10)
            self.FC.driver.switch_to.window(self.FC.driver.window_handles[0])
            
            # 고객센터 챗봇
            # time.sleep(1)
            self.FC.loading_find_xpath(self.FC.var['chatbot_el']['chatbot_cs']).click()                                               # 고객센터 챗봇 선택 
            time.sleep(1)
            self.FC.driver.switch_to.window(self.FC.driver.window_handles[1])
            self.FC.loading_find_xpath(self.FC.var['chatbot_el']['select_sale']).click()                                              # 요금 납부 선택
            # time.sleep(3)
            # num2 = self.FC.driver.find_elements(By.XPATH, self.FC.var['chatbot_el']['select_sale_el'])
            # num_elem2 = len(num2)
            # num_elem3 = len(num2)+1
            # print(str(num_elem2))
            # print(str(num_elem3))
            # print('//*[@id="container"]/section['+ str(num_elem2) +']/div/div/button[1]')
            # self.FC.loading_find_xpath('//*[@id="container"]/section['+ str(num_elem2) +']/div/div/button[1]').click()     # 새로운 유심 구매하기(가입) 선택 (정상)
            # self.FC.loading_find_xpath('//*[@id="container"]/section['+ str(num_elem3) +']/div/div/button[1]').click()     # 유심 가입 자세히보기 선택 (에러발생 지점)
            # self.FC.driver.switch_to.window(self.FC.driver.window_handles[1])


            # # time.sleep(2)
            self.FC.loading_find_xpath(self.FC.var['chatbot_el']['satisfied_2']).click()                                              # 만족해요 선택
            # time.sleep(1)
            self.FC.loading_find_xpath(self.FC.var['chatbot_el']['left_close']).click()                                               # 좌측 상단 닫기 버튼 선택
            self.FC.driver.switch_to.window(self.FC.driver.window_handles[0])
            # time.sleep(1)
            self.FC.loading_find_xpath(self.FC.var['chatbot_el']['chatbot_id']).click()                                               # 챗봇 닫기  
            

            # time.sleep(5)
        
        except  Exception :
            
            # self.DBG.logger.debug(sys._getframe().f_code.co_name + " 정상 이동 실패")
            # self.FC.screenshot()
            self.DBG.logger.debug(sys._getframe().f_code.co_name + " 정상 이동 실패")
            self.DBG.screenshot()
            print(traceback.format_exc())


            # 챗봇의 경우엔 팝업창으로 작동되므로, 에러 발생시 현재 팝업창의 갯수를 세어서 (self.FC.driver.window_handles)
            # 생성해놓은 current_popup_num 함수로 팝업창 인위적으로 닫아줌
            self.FC.close_popup(self.FC.driver.window_handles)    

            # 챗봇의 경우 팝업창이 다 닫혀도 메인창에 여전히 챗봇 기능이 활성화 되어 있어서 X 버튼을 눌러야 완젼히 종료됨
            self.FC.find_xpath(self.FC.var['chatbot_el']['chatbot_id']).click()  

            pass



        else :
            # self.DBG.logger.info(sys._getframe().f_code.co_name + " 성공")
            self.DBG.logger.info(sys._getframe().f_code.co_name + " 성공")
