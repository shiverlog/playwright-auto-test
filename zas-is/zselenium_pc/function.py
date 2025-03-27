
class Function():

    def modal_ck(self):
        try:
            if self.driver.find_element(By.CSS_SELECTOR, var.common_el['팝업_바디']):
                close_btn = self.driver.find_elements(By.CSS_SELECTOR, var.common_el['팝업_닫기'])
                if len(close_btn) > 1:
                    close_btn[-1].click()
                else:
                    close_btn[0].click()

        except Exception :
            pass

    def modal_ck4(self):
        try:
            self.wait_loading()
            self.driver.implicitly_wait(1)
            self.modal_ck1()
            print(self.loading_find_css_pre(self.var['common_el']['body']).get_property('className'))
            self.modal_ck2()
            print(self.loading_find_css_pre(self.var['common_el']['body']).get_property('className'))
            self.modal_ck3()
            print(self.loading_find_css_pre(self.var['common_el']['body']).get_property('className'))
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


    def movepage(self,*btns,address:str=''):
      for i in range(self.retry_count):
          try:
              for btn in btns:
                  if btn.startswith('/'):
                      self.wait.until(EC.presence_of_element_located((By.XPATH,btn)))
                      el=self.driver.find_element(By.XPATH, btn)
                  else:
                      self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, btn)))
                      el=self.driver.find_element(By.CSS_SELECTOR, btn)
                  self.action.move_to_element(el).perform()
                  self.action.reset_actions()
                  # 마지막 매개 변수 일 때, 클릭
                  if len(btns)-1 == btns.index(btn):
                      self.action.move_to_element(el).click().perform()
                      self.action.reset_actions()
                      self.action.move_by_offset(0,500).perform()
                      self.action.reset_actions()

              self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, var.common_el['GNB_list'])))
              self.wait_loading()

              # 현재 url이 address 인자값과 같으면 return(멈춤)
              print(f"{address} in {self.driver.current_url}")
              if address in self.driver.current_url:
                  return True

              print(f'movepage(address) count : {i+1}')

    def close_popup(self,num):
        '''
        새로운 창을 모두 가져와 하나씩 닫기

        :Usage:
            ::
                FC.closw_popup(driver.window_handles)
        '''
        size  = len (num)

        for i in range(size):
            if num[i]  != num[0]:
                self.driver.switch_to.window(num[i])
                self.driver.close()

        self.driver.switch_to.window(num[0])

    def text_list_in_element(self,parent,list: list):
        '''
        JS; 요소에 text가 존재하는 확인
        parent: text 존재를 확인할 요소
        list: 확인할 text list
        :Usage:
            ::
                FC.text_list_in_element(element,['text1','text2','text3 ...])
        '''
        parent_text = None
        for i in range(self.retry_count):
            try:
                # Xpath
                if parent.startswith('//'):
                    parent_el=self.wait.until(EC.presence_of_element_located((By.XPATH,parent)))
                    self.driver.execute_script("arguments[0].scrollIntoView(true);", parent_el)
                    parent_text=parent_el.get_property('innerText')
                # CSS
                else:
                    parent_el=self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR,parent)))
                    self.driver.execute_script("arguments[0].scrollIntoView(true);", parent_el)
                    parent_text=parent_el.get_property('innerText')

                if parent_text is not None and parent_text != '':
                    break
                else:
                    raise Exception()
            except Exception:
                if i == self.retry_count-1:
                    print(f"해당 페이지에 부모 요소를 찾을 수 없습니다.")
                    return False
                else:
                    continue

        for t in list:
            if t not in parent_text:
                print("'"+ t + "' 텍스트를 찾을 수 없습니다.")
                return False
        return True

    def scroll(self,count,down:bool=True):
        '''
        JS; 스크롤
        count: 스크롤 횟수
        down:  up(False)/down(True)
        '''
        if down is True:
            y = "200"
        else:
            y = "-200"

        for _ in range(count) :
            self.driver.execute_script(f"window.scrollBy(0,{y});")

    def scroll_center(self,el):
        '''
        JS; 해당 요소를 가운데로 스크롤(scrollIntoView({block:'center'})
        '''
        self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", el)
        return el

    def scroll_el(self,loc:str,view='true'):
        '''
        JS; 해당 요소까지 스크롤(scrollIntoView)
        '''
        try:
            if type(loc) == str:
                if loc.startswith('/'):
                    self.wait.until(EC.presence_of_element_located((By.XPATH, loc)))
                    el=self.driver.find_element(By.XPATH, loc)
                    self.driver.execute_script("arguments[0].scrollIntoView("+view+");", el)
                else:
                    self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, loc)))
                    el=self.driver.find_element(By.CSS_SELECTOR, loc)
                    self.driver.execute_script("arguments[0].scrollIntoView("+view+");", el)
            if type(loc) == int:
                for i in range(0,loc):
                    self.driver.swipe(75,500,75,0,800)
                    print(f"swipping {i}")
        except BaseException:
            el=None

    def drag_and_drop_x(self,elem):
        self.action.drag_and_drop_by_offset(elem,-200,0).perform()
        self.action.reset_actions()

    def gotoHome(self):
        self.driver.get(var.common_el['url'])
        self.modal_ck4()

    def is_login(self):
        '''
        현재 로그인 여부 확인
        '''
        logout_text = None
        for i in range(self.retry_count):
            try:
                icon = self.loading_find_css(self.var['login_el']['user_icon'])
                self.move_to_element(icon)
                obj=self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, self.var['login_el']['is_login'])))
                logout_text=self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, self.var['login_el']['is_login']))).get_property('innerText')

                if obj is not None and obj !=NoneType and logout_text is not None and logout_text !=NoneType and logout_text != "" and logout_text is not None:
                    break
            except Exception :
                if i == self.retry_count-1:
                    print(f'로그인 여부를 확인할 수 없습니다.')
                    raise Exception('is_login() :로그인 여부를 확인할 수 없습니다.')

        if "님" in logout_text or "반갑습니다" in logout_text:
            return True
        elif "간편조회" in logout_text or "로그인" in logout_text :
            return False
        else:
            print(f'is_login() return error => {logout_text}')
            try:
                raise Exception(f'is_login() return error => {logout_text}')
            except Exception as e:
                return print(e)

    def bring_el_to_front_css(self,css):
        '''
        요소가 깊게 중첩되어 있을 때, action이 힘든 경우, 사용
        ※주의: 사용 시, 해당 요소 style이 무너질 수 있음
        :Usage:
            ::
                FC.bring_el_to_front_css('div > a')
        '''
        self.driver.execute_script(f"document.querySelector('{css}').style.cssText='display: block!important; visibility: visible!important; position: relative !important; z-index: 1000000000000000000000000000000000000000000000000!important;'")
        el=self.loading_find_css(css)
        if el.is_displayed() is True:
            return
        else:
            self.driver.execute_script(f"document.querySelector('{css}').style.cssText='display: block!important; visibility: visible!important; position: fixed!important; z-index: 1000000000000000000000000000000000000000000000000!important;'")
            el=self.loading_find_css(css)
            if el.is_displayed() is True:
                return
            else:
                try:
                    raise Exception()
                except Exception as e:
                    print("bring_el_to_front_css() is failed => " + e)

    def bring_el_to_front_csss(self,css):
        '''
        요소들이 깊게 중첩되어 있을 때, action이 힘든 경우, 사용
        ※주의: 사용 시, 해당 요소 style이 무너질 수 있음
        :Usage:
            ::
                FC.bring_el_to_front_csss('div > a')
        '''
        self.driver.execute_script(f"document.querySelectorAll('{css}').forEach((item) => item.style.cssText='display: block!important; visibility: visible!important; position: relative !important; z-index: 1000000000000000000000000000000000000000000000000!important;')")
        el=self.loading_find_csss(css)[0]
        if el.is_displayed() is True:
            return
        else:
            self.driver.execute_script(f"document.querySelectorAll('{css}').forEach((item) =>item.style.cssText='display: block!important; visibility: visible!important; position: fixed!important; z-index: 1000000000000000000000000000000000000000000000000!important;')")
            el=self.loading_find_csss(css)[0]
            if el.is_displayed() is True:
                return
            else:
                try:
                    raise Exception()
                except Exception as e:
                    print("bring_el_to_front_csss() is failed => " +e)
            try:
                raise Exception()
            except Exception as e:
                print("bring_el_to_front_csss() is failed => " +e)

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
                    if datas is True:
                        # print(f"{tag_name}의 datas 정상 출력 확인2")
                        break
                    time.sleep(0.5)
            # print(f"{str(tag_names)}의 datas 모두 정상 출력 확인")
            self.driver.implicitly_wait(10)
            return True
        except BaseException as e:
            print(e)
            print(traceback.format_exc())
            self.driver.implicitly_wait(10)

    def random_page(self,variable,*args):

        # 모바일 기기 > 구매후기
        try:
        # 휴대폰 영역(추천 탭)에서 임의 상품 정상 이동 확인

            self.loading_find_css(variable[args[0]])    # 데이터 렌더링 대기
            self.action.move_to_element(self.loading_find_css(variable[args[1]])).perform()
            self.action.reset_actions()
            product_list=self.loading_find_csss(variable[args[2]])
            # random_num = random.randrange(0,len(mobile_list))   #임의 상품
            random_num = random.randrange(0,len(product_list))   #임의 상품
            product_json=product_list[random_num].get_attribute('data-ec-product')   # 임의 상품 json 가져오기
            product=json.loads(product_json)    # ecom_prd_name(상품명)), ecom_prd_id(상품코드), ecom_prd_brand(브랜드(apple등)), ecom_prd_category(ex.개인/모바일기기/5G휴대폰), ecom_prd_variant
            print(str(product))
            print(product['ecom_prd_name'])


    def tab_menu_check(self,variable,*args): # 탭 메뉴클릭 확인 기능 : 모바일 > 휴대폰, 태블릿 영역 적용

            tab_list_el=self.loading_find_csss(variable[args[0]])
            for tab in tab_list_el:
                self.action.move_to_element(tab).click().perform()
                self.action.reset_actions()
                tab_name=tab.get_property('innerText')
                tab_content=self.loading_find_css(variable[args[1]]).get_property('previousElementSibling').get_property('innerText')
                tab_list=self.loading_find_csss(variable[args[2]])
                assert tab_name in tab_content, self.DBG.logger.debug(f"모바일 > 서브메인 > {args[0]} > 탭({tab_name}) 변경 정상 동작 실패 ")
                # for item in tab_list:

                #     assert item.get_property('children')[2].get_property('innerText') != '' and item.get_property('children')[3].get_property('innerText') != '', self.DBG.logger.debug(f"모바일기기 > 서브메인 > 휴대폰 > 탭({tab_name}) 콘텐츠 정상 출력 실패")
                #     assert 'img' in item.get_property('children')[1].get_property('innerHTML'), self.DBG.logger.debug(f"모바일기기 > 서브메인 > 휴대폰 > 탭({tab_name}) 콘텐츠 정상 출력 실패")
            tab_list_el[0].click() # 추천탭 클릭


    def con_check (self,variable,*args): # 컨텐츠 정상출력 확인기능 : 모바일 > 이벤트 영역, iptv > 혜택 영역

            print(f"event_list_el =>> {event_list}")
            if variable == var.direct_el :
                self.action.move_to_element(self.loading_find_xpath(event_list[0])).perform()
                self.action.reset_actions()
                event_list = self.loading_find_xpath(variable[args[0]])
                assert len(event_list) == 6, self.DBG.logger.debug("다이렉트 > 이벤트 콘텐츠 및 액션 정상 동작 실패")
            else :
                self.action.move_to_element(event_list[0]).perform()
                self.action.reset_actions()
                event_list = self.loading_find_csss(variable[args[0]])
                assert len(event_list) == 4, self.DBG.logger.debug(f"{args[1]} > 서브메인 > 이벤트 콘텐츠 4개 노출 실패 ")



    def full_view(self,variable,*args): # 전체 보기 기능 :  모바일 > 이벤트 전체보기 , 휴대폰 전체보기, 태블릿/스마트워치/노트북 전체보기 적용

            self.scroll_el(variable[args[0]])
            self.action.move_to_element(self.loading_find_css(variable[args[0]])).click().perform()
            self.action.reset_actions()
            self.loading_find_css(variable[args[0]]).click()
            print(self.loading_find_css(variable[args[1]]).get_property('baseURI'))
            assert variable[args[2]] in self.loading_find_css(variable[args[1]]).get_property('baseURI'),self.DBG.logger.debug("모바일 > 서브메인 > 휴대폰 > 전체보기 액션 정상 동작 실패")
            print(">>>>>>>>>>>>>>>",variable[args[3]] != self.driver.current_url)
            if variable[args[3]] != self.driver.current_url:
                self.driver.back()
                self.scroll(10)
