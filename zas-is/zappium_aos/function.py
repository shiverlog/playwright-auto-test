from asyncio.windows_events import NULL
# from multiprocessing.connection import wait
import traceback
from types import NoneType
import time
import os       #스크린샷 삭제시 사용
from typing import List
from openpyxl import load_workbook

from appium.webdriver.common.appiumby import AppiumBy
from appium.webdriver.webelement import WebElement

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait     # 시간대기 모듈
from selenium.webdriver.support import expected_conditions as EC  # 시간대기 모듈

from base.appdriver import AppDriver
import common.variable as var


class Function():
    # wait 반복 횟수
    retry_count= 3
    def __init__(self,Driver:AppDriver):
        self.Driver=Driver
        self.driver = Driver.driver
        self.wait = Driver.wait
        self.timeout=Driver.timeout
        self.action = Driver.action
        self.var=self.set_variables()

    def set_variables(self):
        '''
        variables.xlsx 파일에 저장된 요소 변수값을 가져와 dict 타입 파싱
        '''
        # data_only=True로 해줘야 수식이 아닌 값으로 받아온다. 
        load_wb = load_workbook(f"{self.Driver.path}\\variables.xlsx", data_only=True)
        # 시트 이름으로 불러오기 
        load_ws = load_wb['Sheet']
        
        all_values = {}
        for row in load_ws.rows:
            # A1 셀은 공백으로 패스
            if row[0] == load_ws['A1']:
                print(f"{row[0]} == {load_ws['A1']}")
                continue
            # print(f"{row[0].value} == {row[1].value} == {row[2].value} == {row[3].value}")
            if row[0].value:  # 데이터 유무(count number)

                page_name =  row[1].value # B1
                key = row[2].value # C1
                value = row[3].value # D1
                assert page_name or key or value, print("일부 데이터 None")
                
                try: # {} 초기화
                    all_values[page_name] 
                except:
                    all_values[page_name] = {}

                all_values[page_name][key] = value
            elif row[0].value == row[1].value == row[2].value == row[3].value is None:
                return all_values
            else:
                print(f"{row[0].value}  {row[1].value}  {row[2].value} {row[3].value}")
                
                assert row[0] or row[1] or row[2] or row[3], print("일부 데이터 비어있음")
        load_wb.close()                
        return all_values

    def chrome_clear(self,version:str=''):
        '''
        크롬 cache clear
        '''
        if version == '':
            cmd=f"adb -s {self.Driver.udid} shell pm clear com.android.chrome"
        elif version == 'beta':
            cmd=f"adb -s {self.Driver.udid} shell pm clear com.chrome.beta"

        
        try:
            result = os.popen(cmd).read()
            if result == 'Success':
                return
            else:
                print(result)
                raise Exception
        except BaseException as e:
            print(e)

    def goto_url(self,url:str):
        '''
        url 이동
        '''
        if url.startswith('https'):
            goto=url
        elif url.startswith('/'):
            goto=self.var['common_el']['url']+url
        else:
            goto=self.var['common_el']['url']+'/'+url
        self.driver.get(goto)
        self.wait_loading()
    
    def pre_script(self):
        '''
        자동화 테스트 시작 전, 앱 권한 허용 및 시스템 창 터치 처리
        '''
        print(1)
        if self.loading_find_xpath(self.var['common_el']['다음버튼']):
            self.loading_find_xpath(self.var['common_el']['다음버튼']).click()
            self.loading_find_id(self.var['common_el']['앱_사용중에만_허용']).click()
            self.loading_find_id(self.var['common_el']['허용_버튼']).click() 
            self.loading_find_id(self.var['common_el']['허용_버튼']).click()
            self.loading_find_id(self.var['common_el']['허용_버튼']).click()
            # self.loading_find_id(self.var['common_el']['허용_버튼']).click()
            self.loading_find_id(self.var['common_el']['모두허용_버튼']).click()
            self.loading_find_id(self.var['common_el']['동의_버튼']).click()
        print(2)
        if self.loading_find_xpath(self.var['common_el']['로그인하지_않고_입장할게요']):
            self.loading_find_xpath(self.var['common_el']['로그인하지_않고_입장할게요']).click()
        print(3)
        if self.loading_find_xpath(self.var['common_el']['로그인없이_입장하기']):
            self.loading_find_xpath(self.var['common_el']['로그인없이_입장하기']).click()
            
        print("----------------------------------------------------")
        print("APP 로그인 페이지 진입")
        print(str(self.driver.contexts))
        self.driver.switch_to.context('WEBVIEW_com.lguplus.mobile.cs')
        print("current => "+ str(self.driver.context))
        print("driver => "+ str(self.driver))
        print("----------------------------------------------------")

        if self.loading_find_css(self.var['common_el']['withoutLogin']):
            self.loading_find_css(self.var['common_el']['withoutLogin']).click()

    def slide(self,el:WebElement):
        '''
        요소 el까지 slide
        '''
        try:
            print(el.location)
            x=el.location.get('x')
            y=el.location.get('y')
            print(f"x => {x} y => {y}")
            # deivice demensions
            width=self.driver.execute_script("return window.innerWidth")
            height=self.driver.execute_script("return window.innerHeight")
            print("width => "+ str(width))       
            print("height => "+ str(height))
            startx=x+int(width)*0.1
            starty=y
            endx=x-int(width)*0.15
            endy=y
            self.driver.swipe(startx,starty,endx,endy,0)
        
        except BaseException as e:
            print(e)
    
    def swipe(self,loc:str | int | WebElement,view='true'):
        '''
        JS Execute; 해당 요소 위치까지 scroll
        loc: 요소 selector path
        view: true(상단 기준)/false(하단 기준)
        '''
        try:
            if type(loc) == str:
                if loc.startswith('/'):
                    self.wait.until(EC.presence_of_element_located((AppiumBy.XPATH, loc)))
                    el=self.driver.find_element(AppiumBy.XPATH, loc)
                    self.driver.execute_script("arguments[0].scrollIntoView("+view+");", el)
                    return
                else:
                    self.wait.until(EC.presence_of_element_located((AppiumBy.CSS_SELECTOR, loc)))
                    el=self.driver.find_element(AppiumBy.CSS_SELECTOR, loc)
                    self.driver.execute_script("arguments[0].scrollIntoView("+view+");", el)
                    return
            elif type(loc) == WebElement:
                self.driver.execute_script("arguments[0].scrollIntoView("+view+");", loc)
                return
            elif type(loc) == int:
                self.switch_view('NATIVE_APP')
                for i in range(0,loc+1):
                    self.driver.swipe(75,500,75,0,800)
                    print(f"swipping {i}")
                self.switch_view()
                return
            else:
                raise Exception('swipe() type error')
        except BaseException as e:
            el=None
            print(e)
            raise Exception('swipe error')
        
    def loading_find_id(self,elem) -> (WebElement):
        '''
        id로 요소 찾기
        '''
        for i in range(self.retry_count):
            try:

                # 시간 20초로 변경
                # self.wait = WebDriverWait(self.driver, timeout=20)
                # CSS가 elem인 tag를 위에 설정한 시간 내에 검색, 그렇지 않으면 TimeoutError 발생
                self.wait.until(EC.visibility_of_element_located((AppiumBy.ID,elem)))

                # 위에 동작으로 찾고자 하는 요소 존재가 확인됐으면 클릭 함수 발생
                self.find=self.driver.find_element(AppiumBy.ID,elem)
                if self.find != NoneType:
                    # print(self.find)
                    return self.find
            except Exception:
                if i == self.retry_count-1:
                    print(f"해당 페이지에서 요소를 찾을 수 없습니다.")
                    return False

        # while True:
        #     self.find=self.driver.find_element(AppiumBy.ID,elem)

    def switch_to_view(self,context):
        try:
            self.driver.switch_to.context(context)
            print(f"switch_viwe 실행 후 뷰 : {self.driver.context}")
            if self.driver.context == 'NATIVE_APP':
                print("timeout = 2")
                self.wait = WebDriverWait(self.driver,timeout=2)
            elif self.driver.context == 'WEBVIEW_com.lguplus.mobile.cs':
                print('timeout = '+str(self.timeout))
                self.wait=WebDriverWait(self.driver,timeout=self.timeout)
            print(self.driver.current_context)
            return True
        except Exception:
            return False
            

    def switch_view(self,context:str="WEBVIEW_com.lguplus.mobile.cs",time_limit:int=5):
        '''
        view 전환
        context: 전환할 view 명칭
        time_limit: 전환 반복 횟수
        '''
        # if context == "WEBVIEW_com.lguplus.mobile.cs":
        #     context= self.driver.contexts[1]

        # 현재페이지가 변경하려는 뷰와 같다면 return 
        if self.driver.current_context == context:
            return
        print(f"현재 페이지 views -> {str(self.driver.contexts)}")
        print(f"switch_viwe 실행 전 뷰 : {self.driver.context}")
        print(self.driver.contexts)
        
        try:
            for _ in range(time_limit):
                if context in self.driver.contexts:
                    break
                else:
                    time.sleep(0.5)
            for _ in range(time_limit):
                print('완투')
                if self.switch_to_view(context):
                    return
            
        except Exception as e:
            print(traceback.format_exc())
            print(e)

#    # 경로가 id나 class인 요소 찾기 
#     def find_css(self,loc):
#         self.find = self.driver.find_element(By.CSS_SELECTOR, loc)
#         return self.find

#    # 경로가 id나 class인 요소들 찾기 
#     def find_csss(self,loc):
#         self.find = self.driver.find_elements(By.CSS_SELECTOR, loc)
#         return self.find

#     # 경로가 x-path인 요소 찾기
#     def find_xpath(self,loc):
#         self.find = self.driver.find_element(By.XPATH, loc)
#         return self.find

#     # 경로가 x-path인 요소들 찾기
#     def find_xpaths(self,loc):
#         self.find = self.driver.find_elements(By.XPATH, loc)
#         return self.find

    # 모달 광고창 제거 
    # def modal_ck(self):
    #     try:
    #         self.driver.implicitly_wait(5)
    #         self.modal_ck1()
    #         if self.loading_find_css_pre('html[lang="ko"]>body').get_property('className') == "modal-open":
    #             self.driver.find_element(By.CSS_SELECTOR,'.modal-body')
    #             self.driver.find_element(By.CSS_SELECTOR,'div.modal-body input[type=checkbox]').click()
    #             self.driver.find_element(By.CSS_SELECTOR,'.c-btn-close').click()
    #         else:
    #             return

    #     except Exception as e :
    #         pass

    # # 모달 광고창 제거2 (2023.02.22 개인정보 유출 공지 팝업 제거)
    # def modal_ck2(self):
    #     try:
    #         self.driver.find_element(By.CSS_SELECTOR,'.modal-body')
    #         self.driver.find_element(By.CSS_SELECTOR,'.optional-box')
    #         # print(self.driver.find_element(By.CSS_SELECTOR,'button.c-btn-rect-3').is_displayed)
    #         # print(self.driver.find_element(By.CSS_SELECTOR,'button.c-btn-rect-3').text)
    #         self.driver.find_element(By.CSS_SELECTOR,'input[type="checkbox"]').click()
    #         self.driver.find_element(By.CSS_SELECTOR,'button.c-btn-rect-3').send_keys(Keys.ENTER)
    #         return

    #     except Exception as e :
    #         pass

    def modal_ck(self):
        try:
            self.wait_loading()
            self.driver.implicitly_wait(1)
            self.modal_ck1()
            print(self.loading_find_css_pre(self.var['common_el']['body']).get_property('className'))
            self.modal_ck2()
            print(self.loading_find_css_pre(self.var['common_el']['body']).get_property('className'))
            # self.modal_ck3()
            # print(self.loading_find_css_pre(self.var['common_el']['body']).get_property('className'))
            self.driver.implicitly_wait(7)
            self.wait_loading()
        except Exception:
            self.driver.implicitly_wait(7)
            self.wait_loading()
            pass

    def modal_ck1(self):
        try:
            if self.loading_find_css_pre(self.var['common_el']['body']).get_property('className') == "modal-open":
                self.driver.find_element(By.CSS_SELECTOR,self.var['common_el']['모달창_체크박스']).click()
            else:
                return
        except Exception:
            pass

    def modal_ck2(self):
        try:
            if self.loading_find_css_pre(self.var['common_el']['body']).get_property('className') == "modal-open":
                self.driver.find_element(By.CSS_SELECTOR,self.var['common_el']['모달창_닫기']).click()
            else:
                return
        except Exception:
            pass

    def modal_ck3(self):
        try:
            if self.loading_find_css_pre(self.var['common_el']['body']).get_property('className') == "modal-open":
                self.loading_find_css_pre(self.var['common_el']['모달창_버튼']).click()
            else:
                return
        except Exception:
            pass
    
    def modal_ck_ins(self):
        try:
            if self.loading_find_css_pre(self.var['common_el']['딤드']):
                self.loading_find_css_pre(self.var['common_el']['모달창_버튼_ins']).click()
            else:
                return
        except Exception:
            pass

    def movepage(self,*btns:str,address:str=''):
        '''
        *kwarg에 address 인자가 있을 시, 햄버거 메뉴 이동 후 현재 url에 address 값이 포함될 때까지 반복
        
        :Usage:
            ::
                FC.movepage(btn1,btn2,btn3,address="https://app.lguplus.com")
        '''
        hamburger_main = self.var['common_el']['메인_메뉴']

        for i in range(self.retry_count):
            try:
                self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, hamburger_main)))
                menu = self.loading_find_css(hamburger_main)
                self.move_to_click(menu)
                time.sleep(0.5)
                for btn in btns:
                    # Xpath
                    if btn.startswith('/'):
                        self.wait.until(EC.presence_of_element_located((By.XPATH, btn)))
                        el=self.driver.find_element(By.XPATH, btn)
                    # CSS Selector
                    else:
                        self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, btn)))
                        el=self.driver.find_element(By.CSS_SELECTOR, btn)
                    # 메뉴 전체 펼침 버튼 클릭
                    if "전체 펼침" in self.driver.find_element(By.CSS_SELECTOR, self.var['common_el']['전체펼침']).get_property('innerText'):
                        open_list=self.driver.find_element(By.CSS_SELECTOR,self.var['common_el']['전체펼침'])
                        self.driver.execute_script("arguments[0].scrollIntoView(false);", open_list)
                        open_list.click()
                        time.sleep(0.5)

                    self.driver.execute_script("arguments[0].scrollIntoView(false);", el)
                    el.click()
                    self.wait_loading()

                self.wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR,self.var['common_el']['메인_메뉴'])))

                # 현재 url이 address 인자값과 같으면 return(멈춤)
                if address in self.driver.current_url:
                    return
            except Exception:
                
                # 만약 햄버거 사이드바가 열린 상태일 때, 닫기 해줌
                if var.common_el['gnb_url'] in self.driver.current_url :
                    self.driver.find_element(By.CSS_SELECTOR,self.var['common_el']['뒤로가기']).click()
                    time.sleep(0.5)

                # num번 반복해서 요소를 찾아도 없으면 False 반환
                if i == self.retry_count-1:
                    print(f'movepage({address}) 실패했습니다.')
                    return False 
                else:
                    continue

    def close_popup(self,num):
        '''
        창 닫기
        '''
        print(f"close_popup => {num}")
        size  = len (num) # 팝업창의 갯수만큼 리스트에 담아지므로, len을 이용하여 팝업창 갯수 확인

        # 현재 팝업창의 갯수를 세어서 메인창의 리스트 번호가 아닌 경우 (메인은 항상 [0]), 반복문을 통해 창을 닫아줌
        for i in range(size):
            if num[i]  != num[0]:
                self.driver.switch_to.window(num[i])
                self.driver.close()

        self.driver.switch_to.window(num[0])

    # css로 요소 검색
    def loading_find_css(self,elem) -> (WebElement):
        '''
        페이지 로드 후, css 요소 찾기
        '''
        for i in range(self.retry_count):
            try:
                self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR,elem)))
                self.find=self.driver.find_element(By.CSS_SELECTOR,elem)
                if self.find != NoneType:
                    # print(self.find)
                    return self.find
            except Exception:
                if i == self.retry_count-1:
                    print(f"해당 페이지에서 요소를 찾을 수 없습니다.")
                    return False

    # css로 요소 검색 
    def loading_find_csss(self,elem) -> (List[WebElement]):
        '''
        페이지 로드 후, css 요소 List 찾기
        '''
        for i in range(self.retry_count):
            try:
                self.wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR,elem)))
                self.find=self.driver.find_elements(By.CSS_SELECTOR,elem)
                if self.find != NoneType:
                    # print(self.find)
                    return self.find
            except Exception:
                if i == self.retry_count-1:
                    print(f"해당 페이지에서 요소를 찾을 수 없습니다.")
                    return [False]

    # css로 요소 검색
    def loading_find_css_pre(self,elem) -> (WebElement):
        '''
        페이지 로드 후, 페이지의 DOM에서 css 요소 찾기
        '''
        for i in range(self.retry_count):
            try:
                self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR,elem)))
                self.find=self.driver.find_element(By.CSS_SELECTOR,elem)
                if self.find != NoneType  :
                    return self.find
            except Exception:
                if i == self.retry_count-1:
                    print(f"해당 페이지에서 요소를 찾을 수 없습니다.")
                    return False

    # xpath로 요소 검색
    def loading_find_xpath(self,elem) -> (WebElement):
        '''
        페이지 로드 후, xpath 요소 찾기
        '''
        for i in range(self.retry_count):
            try: 
                self.wait.until(EC.visibility_of_element_located((By.XPATH,elem)))
                self.find=self.driver.find_element(By.XPATH,elem)
                if self.find != NoneType:
                    return self.find
            except Exception:
                if i == self.retry_count-1:
                    print(f"해당 페이지에서 요소를 찾을 수 없습니다.")
                    return False

    # xpath로 요소 검색
    def loading_find_xpath_pre(self,elem) -> (WebElement):
        '''
        페이지 로드 후, xpath 요소 찾기
        '''
        for i in range(self.retry_count):
            try: 
                self.wait.until(EC.presence_of_element_located((By.XPATH,elem)))
                self.find=self.driver.find_element(By.XPATH,elem)
                if self.find != NoneType:
                    return self.find
            except Exception:
                if i == self.retry_count-1:
                    print(f"해당 페이지에서 요소를 찾을 수 없습니다.")
                    return False

    # xpath로 요소들 검색
    def loading_find_xpaths(self,elem) -> (List[WebElement]):
        '''
        페이지 로드 후, xpath 요소 List 찾기
        '''
        for i in range(self.retry_count):
            try: 
                self.wait.until(EC.presence_of_all_elements_located((By.XPATH,elem)))
                self.find=self.driver.find_elements(By.XPATH,elem)
                if self.find != NoneType:
                    return self.find
            except Exception:
                if i == self.retry_count-1:
                    print(f"해당 페이지에서 요소를 찾을 수 없습니다.")
                    return [False]
    
    def wait_loading(self):
        '''
        해당 페이지 렌더링이 끝날 때 까지 대기
        '''
        loading_elem_css='div.c-loading-1'
        loading_elem_css1='*.b-skeleton'
        # loading_elem_css2='p>img.isLoaded'
        # loading_elem_css3='html[lang="ko"]>body.modal-open'

        self.loading(loading_elem_css)
        self.loading(loading_elem_css1)
        # self.loading(loading_elem_css2)
        # print("로딩 완료")
        max_count=10
        count=0
        while True:
            page_loading = self.driver.execute_script('return document.readyState;')
            # print(page_loading)
            if page_loading == 'complete':
                break
            count +=1
            if count >= max_count:
                raise Exception("무한로딩")

    def loading(self,css):
        max_count=10
        count=0
        self.driver.implicitly_wait(1)
        while True:
            try:
                time.sleep(0.5)
                loading_elem=self.driver.find_element(By.CSS_SELECTOR,css)
                count+=1
                if count>max_count:
                    raise UserWarning("무한 로딩")
            except UserWarning :
                print(f"{max_count} 무한 로딩 ")
                self.driver.implicitly_wait(10)
                break
            except Exception:
                break

    def text_list_in_element(self,parent:str,list: list):
        '''
        요소에 text가 존재하는 확인
        parent: text 존재를 확인할 요소
        list: 확인할 text list
        :Usage:
            ::
                FC.text_list_in_element(element,['text1','text2','text3 ...])
        '''
        for i in range(self.retry_count):
            try:
                # 부모요소에서 자식객체 찾기
                if parent.startswith('//'):
                    parent_el=self.wait.until(EC.presence_of_element_located((By.XPATH,parent)))
                    self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", parent_el)
                    parent_text=parent_el.get_property('innerText')                
                else:
                    parent_el=self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR,parent)))
                    self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", parent_el)
                    parent_text=parent_el.get_property('innerText')                
                        
                if parent_text is not None:
                    pass
            except Exception:
                if i == self.retry_count-1:
                    print("해당 페이지에 부모 요소를 찾을 수 없습니다.")
                    return False
        try:
            for t in list:
                assert t in parent_text, Exception("'"+ t + "' 텍스트를 찾을 수 없습니다.")                 
            else:
                pass
            return True    
        except Exception as e:
            print(e)
            return False
                    
    def scroll_x(self,el):
        '''
        JS Execute; 요소를 가로 스크롤 center로 이동 
        '''
        self.driver.execute_script('return arguments[0].scrollIntoViewIfNeeded();',el)
        print("scrolling")
        return

    def scroll_center(self,el):
        '''
        JS Execute; el요소를 중간으로 scroll 
        '''
        self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", el)
        print("scrolling")
        return

    def scroll_to_top(self):
        '''
        JS Execute; 최상단 까지 scroll 
        '''
        self.driver.execute_script(f"window.scrollTo(0,0);")
        print("scrolling")
    
    def scroll(self,count:int,switch=False):
        '''
        JS Execute; count 만큼 (0,200) scroll 반복
        count: 반복 횟수
        switch: 아래로 스크롤(False), 위로 스크롤(True)
        '''
        if switch:
            n = '200'
        else:
            n = '-200'
        for _ in range(count):
            self.driver.execute_script(f'window.scrollBy(0, {n});')

    def back(self):
        '''
        뒤로가기
        '''
        self.driver.back()
        self.wait_loading()

    def drag_and_drop_x(self,elem):
        print("swipe")
        self.action.drag_and_drop_by_offset(elem,-200,0).perform()
        self.action.reset_actions()

    def gotoHome(self):
        self.driver.get(self.var['common_el']['url'])
        self.modal_ck()
        

    def is_login(self):
        '''
        현재 로그인 상태 확인
        '''
        hamburger_main = self.var['common_el']['메인_메뉴'] 
        logout_text=""
        for i in range(self.retry_count):
            try:
                obj=self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, hamburger_main)))
                self.driver.find_element(By.CSS_SELECTOR, hamburger_main).click()
                self.wait_loading()

                logout_text=self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, var.login_el['로그인 여부']))).get_property('innerText')
                self.driver.find_element(By.CSS_SELECTOR,self.var['common_el']['뒤로가기']).click()

                if obj is not None and obj !=NoneType and logout_text is not None and logout_text !=NoneType and logout_text != "" and logout_text != NULL:
                    break
            except:
                # num번 반복해서 요소를 찾아도 없으면 False 반환
                if i == self.retry_count-1:
                    print(f'logout_text를 찾을 수 없음')
                    raise Exception("logout_text를 찾을 수 없음") 

        print(f"logout_text ->{logout_text}")
        if "로그아웃" in logout_text or "반갑습니다" in logout_text:
            return True
        elif "로그인" in logout_text:
            return False
        else:
            print(f'is_login() return error => {logout_text}')
            try:
                raise Exception(f'is_login() return error => {logout_text}')
            except Exception as e:
                return print(e)

    def bring_el_to_front(self,loc:str):
        '''
        JS Execute; xpath or css로 요소를 찾아 앞으로 가져오기
        '''
        if loc.startswith('/'):
            self.driver.execute_script(f"document.evaluate('{loc}',document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue.style.cssText='display: block!important; visibility: visible!important; position: relative!important; z-index: 10000000000000000!important;'")
            el=self.loading_find_xpath_pre(loc)
        else:
            self.driver.execute_script(f"document.querySelector('{loc}').style.cssText='display: block!important; visibility: visible!important; position: relative!important; z-index: 10000000000000000!important;'") 
            el=self.loading_find_css_pre(loc)

        if el.is_displayed() is True:
            return
        else:
            if loc.startswith('/'):    
                self.driver.execute_script(f"document.evaluate('{loc}',document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue.style.cssText='display: block!important; visibility: visible!important; position: fixed!important; z-index: 10000000000000000!important; bottom: 300px!important;'")
                el=self.loading_find_xpath_pre(loc)
            else:
                self.driver.execute_script(f"document.querySelector('{loc}').style.cssText='display: block!important; visibility: visible!important; position: fixed!important; z-index: 10000000000000000!important;bottom: 300px!important;'") 
                el=self.loading_find_css_pre(loc)

            if el.is_displayed() is True:
                return
            else:
                try:
                    raise Exception()
                except Exception as e:
                    print("bring_el_to_front() is failed => " +e)
    
    def bring_el_to_front_css(self,css):
        '''
        JS Execute; css로 요소를 찾아 앞으로 가져오기
        '''
        self.driver.execute_script(f"document.querySelector('{css}').style.cssText='display: block!important; visibility: visible!important; position: relative !important; z-index: 1000000000000000000000000000000000000000000000000!important;'") 
        el=self.loading_find_css_pre(css)
        if el.is_displayed() is True:
            return
        else:        
            self.driver.execute_script(f"document.querySelector('{css}').style.cssText='display: block!important; visibility: visible!important; position: fixed!important; z-index: 1000000000000000000000000000000000000000000000000!important;'") 
            el=self.loading_find_css_pre(css)
            if el.is_displayed() is True:
                return
            else:
                try:
                    raise Exception()
                except Exception as e:
                    print("bring_el_to_front_css() is failed => " +e)

    def wait_datas(self,parent_loc:str,*tag_names:str):
        '''
        태그의 innerText 출력 확인(공백X,빈란X)
        parent_loc:태그를 검색할 상위 부모(조상)요소
        tag_names: 가장 하위(자식) 태그여야 함
        '''
        self.driver.implicitly_wait(1) # 1초동안 요소 대기
        # 태그 Selector 전처리
        if parent_loc.startswith('//'):
            by=By.XPATH
            tags=[]
            for tag_name in tag_names:
                tags.append('//'+tag_name)
            tag_names=tags
        else:
            by=By.CSS_SELECTOR
            tags=[]
            for tag_name in tag_names:
                tags.append(' '+tag_name)
            tag_names=tags
        # print(f"{parent_loc}{tag_names[0]}")
        try:
            for tag_name in tag_names:
                count=0
                # print(f"검색 : {parent_loc}{tag_name} ")
                while True:
                    datas=self.driver.find_elements(by, f"{parent_loc}{tag_name}")
                    # print(f"datas => {len(datas)}")
                    for data in datas:
                        if data.get_property('childElementCount') >0:
                            if [child for child in data.get_property('children') if child.get_property('tag_name') in tag_names] == []: 
                                #자식요소가 있지만, 자식 요소 중 동일한 태그명이 존재하지 않으면 내가 확인을 원하는 데이터일 확률이 높으므로 이어서 실행 
                                pass
                            else:
                                if len(datas)-1 == datas.index(data): # 마지막 요소면 True 반환
                                    datas = True
                                    break
                                # 아니면 실행X
                                continue
                        data_txt=data.get_property('innerText')
                        # print(f"data_txt => {data_txt}")
                        # if data_txt == '' or data_txt..startswith(' ') : # data 미출력 시, max_count까지 반복
                        if data_txt.strip(' ') == ''  : # data 미출력 시, max_count까지 반복
                            break
                        elif len(datas)-1 == datas.index(data): # 특정 태그의 데이터가 모두 정상 출력 시, 다음 태그 체크를 위해 datas = True 할당
                            # print(f"{tag_name}의 datas 정상 출력 확인1")
                            datas = True
                            break
                    count+=1              
                    if count >=self.retry_count: # max_count 이상일 경우, 해당 tag_name return
                        print(f"{tag_name} 미출력")
                        return tag_name
                    if datas is True: # datas 모두 정상출력 확인
                        break
                    time.sleep(0.5)
            # print(f"{str(tag_names)}의 datas 모두 정상 출력 확인2")
            self.driver.implicitly_wait(20)
            return True
        except BaseException as e:
            print(e)
            print(traceback.format_exc())
            self.driver.implicitly_wait(20)

    # chrome v117 이상
    def chorme_access_v117(self):
        '''
        chrome view 이동 시, 시스템 팝업 허용(chrome v117 이상)
        '''
        self.switch_view('NATIVE_APP')
        self.driver.implicitly_wait(5)
        if self.loading_find_id('com.android.chrome:id/signin_fre_continue_button'):
            self.loading_find_id('com.android.chrome:id/signin_fre_continue_button').click()
        if self.loading_find_id('com.android.chrome:id/button_primary'):
            self.loading_find_id('com.android.chrome:id/button_primary').click()
        # if self.loading_find_id('com.android.chrome:id/ack_button'):
        #     self.loading_find_id('com.android.chrome:id/ack_button').click()
        if self.loading_find_id('com.android.chrome:id/negative_button'):
            self.loading_find_id('com.android.chrome:id/negative_button').click()
            if self.loading_find_id('com.android.permissioncontroller:id/permission_allow_button'):
                self.loading_find_id('com.android.permissioncontroller:id/permission_allow_button').click()
        
        self.driver.implicitly_wait(20)
            
        return
    
    # chrome v104 
    def chorme_access(self):
        '''
        chrome view 이동 시, 시스템 팝업 허용(chrome v104)
        '''
        self.switch_view('NATIVE_APP')
        self.driver.implicitly_wait(2)
        
        
        # 동의하고 계속
        if self.loading_find_id('com.android.chrome:id/terms_accept'):
            self.loading_find_id('com.android.chrome:id/terms_accept').click()
        # 이번(김이번)으로 계속
        if self.loading_find_id('com.android.chrome:id/signin_fre_continue_button'):
            self.loading_find_id('com.android.chrome:id/signin_fre_continue_button').click()
        # 사용
        if self.loading_find_id('com.android.chrome:id/positive_button'):
            self.loading_find_id('com.android.chrome:id/positive_button').click()
        # 알림 > 차단 or 알림으로 더 간편하게 작업하세요 > 취소
        if self.loading_find_id('com.android.chrome:id/negative_button'):
            self.loading_find_id('com.android.chrome:id/negative_button').click()
        # Chrome에서 알림을 보내도록 하용하시겠습니까
        if self.loading_find_id('com.android.permissioncontroller:id/permission_allow_button'):
            self.loading_find_id('com.android.permissioncontroller:id/permission_allow_button').click()
        # if self.loading_find_id('com.android.chrome:id/negative_button'):
        #     self.loading_find_id('com.android.chrome:id/negative_button').click()
        self.driver.implicitly_wait(20)
            
        return
    
    # chrome v102
    def chorme_access(self):
        '''
        chrome view 이동 시, 시스템 팝업 허용(chrome v102)
        '''
        self.switch_view('NATIVE_APP')
        self.driver.implicitly_wait(2)
        
        
        # 동의하고 계속
        if self.loading_find_id('com.android.chrome:id/terms_accept'):
            self.loading_find_id('com.android.chrome:id/terms_accept').click()
        # 이번(김이번)으로 계속
        if self.loading_find_id('com.android.chrome:id/signin_fre_continue_button'):
            self.loading_find_id('com.android.chrome:id/signin_fre_continue_button').click()
        # 사용
        if self.loading_find_id('com.android.chrome:id/positive_button'):
            self.loading_find_id('com.android.chrome:id/positive_button').click()
        # 알림 > 차단 or 알림으로 더 간편하게 작업하세요 > 취소
        if self.loading_find_id('com.android.chrome:id/negative_button'):
            self.loading_find_id('com.android.chrome:id/negative_button').click()
        # Chrome에서 알림을 보내도록 하용하시겠습니까
        if self.loading_find_id('com.android.permissioncontroller:id/permission_allow_button'):
            self.loading_find_id('com.android.permissioncontroller:id/permission_allow_button').click()
        # if self.loading_find_id('com.android.chrome:id/negative_button'):
        #     self.loading_find_id('com.android.chrome:id/negative_button').click()
        self.driver.implicitly_wait(20)
            
        return
    
    # chrome v120 and S22_계진 
    def chrome_access_S22_계진(self):
        '''
        chrome view 이동 시, 시스템 팝업 허용(chrome v120)
        '''
        self.switch_view('NATIVE_APP')
        self.driver.implicitly_wait(2)
        
        # 계진 계정 사용
        if self.loading_find_id('com.android.chrome:id/signin_fre_continue_button'):
            self.loading_find_id('com.android.chrome:id/signin_fre_continue_button').click()
        # 동기화
        if self.loading_find_id('com.android.chrome:id/button_primary'):
            self.loading_find_id('com.android.chrome:id/button_primary').click()
        # 동의하고 계속
        if self.loading_find_id('com.android.chrome:id/terms_accept'):
            self.loading_find_id('com.android.chrome:id/terms_accept').click()
        # www.mylgid.com에서 알림을 보내려고 합니다
        if self.loading_find_id('com.android.chrome:id/positive_button'):
            self.loading_find_id('com.android.chrome:id/positive_button').click()
        # Chrome에서 알림을 보내도록 하용하시겠습니까
        if self.loading_find_id('com.android.permissioncontroller:id/permission_allow_button'):
            self.loading_find_id('com.android.permissioncontroller:id/permission_allow_button').click()
        # if self.loading_find_id('com.android.chrome:id/negative_button'):
        #     self.loading_find_id('com.android.chrome:id/negative_button').click()
        self.driver.implicitly_wait(20)
            
        return
    
    # chrome v126_beta
    def chrome_access_beta(self):
        '''
        chrome view 이동 시, 시스템 팝업 허용(chrome v126 beta)
        '''
        self.switch_view('NATIVE_APP')
        self.driver.implicitly_wait(2)
        
        # 계정 계속
        if self.loading_find_id('com.chrome.beta:id/signin_fre_continue_button'):
            self.loading_find_id('com.chrome.beta:id/signin_fre_continue_button').click()
        # 동기화
        if self.loading_find_id('com.chrome.beta:id/button_primary'):
            self.loading_find_id('com.chrome.beta:id/button_primary').click()
        # 동의하고 계속
        if self.loading_find_id('com.chrome.beta:id/terms_accept'):
            self.loading_find_id('com.chrome.beta:id/terms_accept').click()
        # www.mylgid.com에서 알림을 보내려고 합니다
        if self.loading_find_id('com.chrome.beta:id/positive_button'):
            self.loading_find_id('com.chrome.beta:id/positive_button').click()
        # Chrome에서 알림을 보내도록 하용하시겠습니까
        if self.loading_find_id('com.android.permissioncontroller:id/permission_allow_button'):
            self.loading_find_id('com.android.permissioncontroller:id/permission_allow_button').click()
        # if self.loading_find_id('com.android.chrome:id/negative_button'):
        #     self.loading_find_id('com.android.chrome:id/negative_button').click()
        self.driver.implicitly_wait(20)
            
        return

    def animation_none(self,parent_loc):
        '''
        애니메이션 제거(현재 미사용중이지만 업데이트 가능성 있음)
        '''
        self.driver.execute_script("li =document.querySelectorAll('"+parent_loc+" *'); function test(){ for(let i =0; i<  li.length; i++){li[i].style.cssText='animation: none !important; transition: none !important; trasnform: none !important; transition-delay: 0s; opacity: 1;'}}")

    def move_to_element(self,el):
        '''
        action chain으로 el까지 이동
        '''
        self.action.move_to_element(el).perform()
        self.action.reset_actions()

    def move_to_click(self,el,JS_switch=False):
        '''
        action chain으로 el까지 이동 후 클릭
        '''
        if JS_switch is False:
            self.action.move_to_element(el).click().perform()
            self.action.reset_actions()
            self.wait_loading()
        else:
            self.scroll_center(el)
            self.action.move_to_element(el).click().perform()
            self.action.reset_actions()
            self.wait_loading()

    def again_click(self,click_el:WebElement,display_el_selector:str=''):
        '''
        해당 요소 정상 클릭까지 반복
        click_el: 클릭을 반복할 요소
        display_el_selecto: 클릭 정상여부 확인
        '''
        current_url = self.driver.current_url
        for _ in range(self.retry_count):
            self.move_to_click(click_el)
            # click_el.click()
            self.wait_loading()
            if display_el_selector == '':
                if current_url != self.driver.current_url:
                    return
            elif display_el_selector.startswith('//'):
                if self.loading_find_xpath_pre(display_el_selector):
                    return
            else:
                if self.loading_find_css_pre(display_el_selector):
                    return
        return False

    def is_exists_element_click(self,el:WebElement):
        '''
        현재 페이지에 el이 존재하면 클릭
        '''
        if el:
            el.click()

    def is_exists_move_to_click(self,el:WebElement,JS_switch=False):
        '''
        현재 페이지에 el이 존재하면 이동 후 클릭
        '''
        if el:
            if JS_switch:
                self.move_to_click(el,True)
            else:
                self.move_to_click(el)
    