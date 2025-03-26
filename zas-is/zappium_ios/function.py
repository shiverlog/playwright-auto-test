
    def WEclass_chainge(self):
        '''
        커스텀 함수 사용을 위해, 기존 ../appium/../webelement.py 함수에 덮어쓰기
        '''
        old_file_path = "/Users/nam/dev/remotePC_batchfiles/pubsub/venv/lib/python3.11/site-packages/appium/webdriver/webelement.py"
        rewrite_file_path = "/Users/nam/dev/remotePC_batchfiles/pubsub/appium_ios/WEclass.py"

        print("Old File Path:", old_file_path)
        print("New File Path:", rewrite_file_path)
        try:
            with open(old_file_path, "r") as file:
                file_data = file.read()
                if file_data.find('re_click') > 0:
                    return
                else:
                    pass
                file_data=file_data.replace("class WebElement","class AppiumWebElement",1)

                index1 = file_data.rfind('import')
                index2 = file_data.rfind('from')

                if index1 > index2:
                    index=index1
                else:
                    index=index2

                last_index=file_data.find('\n',index)

                old_module=file_data[:last_index]
                old_script=file_data[last_index:-1]
                file.close()

            with open(rewrite_file_path,"r") as file:
                re_file_data=file.read()
                (modules,scripts) = re_file_data.split('import time')
                file.close()

            with open(old_file_path , "w") as file:
                file.write(old_module)
                file.write(modules)
                file.write(old_script)
                file.write(scripts)
                file.close()

        except FileNotFoundError:
            print("File not found.")
        except Exception as e:
            print("An error occurred:", e)

    def WebdriverClass_chainge(slef):
        '''
        커스텀 함수 사용을 위해, 기존 ../appium/../webdriver.py 함수에 덮어쓰기
        '''
        old_file_path = "/Users/nam/dev/remotePC_batchfiles/pubsub/venv/lib/python3.11/site-packages/selenium/webdriver/remote/webdriver.py"
        rewrite_file_path = "/Users/nam/dev/remotePC_batchfiles/pubsub/appium_ios/WebdriverClass.py"

        print("Old File Path:", old_file_path)
        print("New File Path:", rewrite_file_path)
        try:
            with open(old_file_path, "r") as file:
                file_data = file.read()
                if file_data.find('get_screen_size') > 0:
                    return
                file.close()

            with open(rewrite_file_path,"r") as file:
                re_file_data=file.read()
                file.close()

            with open(old_file_path , "w") as file:
                file.write(file_data)
                file.write(re_file_data)
                file.close()

        except FileNotFoundError:
            print("File not found.")
        except Exception as e:
            print("An error occurred:", e)

    # ios webview context init
    def webview_init(self):
        '''
        ios default webview 설정
        '''
        if len(self.driver.contexts)==2:
            print(f"default webview context : {self.driver.contexts[1]}")
            return self.driver.contexts[1]

    def safari_clear(self):
        '''
        NATIVE_VIEW;
        safari cache clear. NATIVE view에서 실행
        '''
        try:
            self.switch_view('NATIVE_APP')
            self.driver.activate_app('com.apple.Preferences')
            self.driver.swipe(100,700,100,150)
            # face_id_and_pw = self.loading_find_chain('**/XCUIElementTypeNavigationBar[`name == "Face ID 및 암호"`]')
            # face_id = self.loading_find_chain('**/XCUIElementTypeStaticText[`label == "Face ID 및 암호"`][2]')
            back = self.loading_find_chain('**/XCUIElementTypeButton[`label == "설정"`]')
            # if face_id_and_pw or face_id:
            #     back.click()
            app=self.loading_find_chain('**/XCUIElementTypeButton[`label == "앱"`]')
            if not app:
                back.click()
            self.driver.swipe(100,700,100,150)
            if app:
                # self.driver.swipe(100,100,app.location.get('x'),app.location.get('y'))
                app.click()
            self.driver.swipe(100,800,100,0)
            self.driver.swipe(100,800,100,0)
            safari=self.loading_find_chain('**/XCUIElementTypeWindow/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeCollectionView/XCUIElementTypeCell[8]')
            if safari:
                safari.click()
            self.driver.swipe(100,700,100,150)
            clear=self.loading_find_chain('**/XCUIElementTypeCell[`label == "방문 기록 및 웹사이트 데이터 지우기"`]')
            if clear:
                clear.click()
            check=self.loading_find_chain('**/XCUIElementTypeStaticText[`label == "모든 방문 기록"`]')
            if check:
                check.click()
            tab_close=self.loading_find_chain('**/XCUIElementTypeSwitch[`label == "모든 탭 닫기"`]')
            tab_close_value=tab_close.get_attribute('value')
            print(tab_close_value)
            if tab_close_value == '0':
                tab_close.click()
            system_btn=self.loading_find_chain('**/XCUIElementTypeButton[`label == "방문 기록 지우기"`]')
            if system_btn:
                system_btn.click()

            self.driver.activate_app('com.lguplus.mobile.cs')
            self.switch_view()
        except NoSuchElementException as e:
            print(e)
            self.driver.activate_app('com.lguplus.mobile.cs')
            self.switch_view()
            pass
        except BaseException as e:
            print(e)
            self.driver.activate_app('com.lguplus.mobile.cs')
            self.switch_view()
            pass

    def get_status_bar_height(self):
        '''
        NATIVE_VIEW 전용;
        상단 스테이터스바 높이값
        '''
        try:
            self.switch_view('NATIVE_APP')
            status_bar=self.driver.find_element(AppiumBy.IOS_CLASS_CHAIN,'**/XCUIElementTypeWindow[7]/XCUIElementTypeStatusBar')
            height=status_bar.get_attribute('height')
            print(f"status bar height -> {height}")

            self.switch_view()

            return {"height":height}

        except BaseException as e:
            print(e)
            print(traceback.format_exc())

    def pre_script(self):
        '''
        자동화 테스트 시작 전, 앱 권한 허용 및 시스템 창 터치 처리
        '''
        # self.safari_clear()

        print("get_window_size => "+ str(self.driver.get_window_size()))
        print("get_window_position => "+ str(self.driver.get_window_position()))        # time.sleep(5)
        print("get_window_rect => "+ str(self.driver.get_window_rect()))        # time.sleep(5)
        print("get_screen_size => "+ str(self.driver.get_screen_size()))        # time.sleep(5)
        print("get_current_scrollTop => "+ str(self.driver.get_current_scrollTop()))        # time.sleep(5)
        print("contexts => "+ str(self.driver.contexts))
        time.sleep(1.5)
        print("----------------------------------------------------")
        print("APP 로그인 페이지 진입")
        print(str(self.driver.current_context))
        self.driver.switch_to.context(self.driver.contexts[1])
        print("current => "+ str(self.driver.context))
        print("----------------------------------------------------")
        self.gotoHome()

    def chrome_clear(self):
        '''
        커맨드 실행;
        chrome cache clear
        '''
        cmd=f"adb -s {self.Driver.udid} shell pm clear com.android.chrome"
        try:
            result = os.popen(cmd).read()
            if result == 'Success':
                return
            else:
                print(result)
                raise Exception
        except BaseException as e:
            print(e)

    def slide(self,el:WebElement):
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

    def scroll_loc(self,loc:str):
        '''
        JS Execute; element location으로 요소를 찾아 스크롤
        '''
        num=0
        try:
            while num<self.retry_count:
                if loc.startswith('/'):
                    exit=self.wait.until(EC.visibility_of_element_located((AppiumBy.XPATH, loc)))
                else:
                    exit=self.wait.until(EC.visibility_of_element_located((AppiumBy.CSS_SELECTOR, loc)))

                if exit:
                    return
                else:
                    self.driver.execute_script('mobile: swipe', {'direction': 'down'})
        except BaseException as e:
            print(e)
            return

    def redefinition_v1(self,el:WebElement) -> WebElement:
        '''
        요소 재정의 함수 version 1
        iOS Hybrid App element 상호작용 오류(StaleElementReferenceException)로 인한 해결방안으로 사용
        '''
        if el is None:
            raise Exception("요소 is None")

        # id
        id = el.get_property('id')
        tag = el.get_property('tag_name')
        if id != "":
            print(f' id -> {tag}#{id}')
            def_el=self.driver.find_elements(By.CSS_SELECTOR,f'{tag}#{id}')
            if len(def_el)==1:
                return def_el[0]
        else: pass

        # title
        title=el.get_property('title')
        if title != "":
            print(f"title -> {tag}[title='{title}']")
            def_el=self.driver.find_elements(By.CSS_SELECTOR,f'{tag}[title="{title}""]')
            if len(def_el)==1:
                return def_el[0]
        else: pass

        # role
        role=el.get_property('role')
        if role !="":
            css_title=''
            if title != "":
                css_title=f"[title='{title}']"
                print(f"role -> {tag}[role='{role}']{css_title}")
            def_el=self.driver.find_elements(By.CSS_SELECTOR,f'{tag}[role="{role}"]{css_title}')
            if len(def_el)==1:
                return def_el[0]
        else: pass

        # class
        class_name=el.get_property('className')
        if class_name != "":
            class_name=class_name.replace(' ', '.')
            print(f' class -> {tag}.{class_name}')
            def_el=self.driver.find_elements(By.CSS_SELECTOR,f'{tag}.{class_name}')
            if len(def_el)==1:
                return def_el[0]

        # text xpath
        text= el.get_property('innerText')
        if text != "":
            xpath_class=''
            if class_name !='':
                class_name=class_name.replace('.',' ')
                xpath_class=f'@class="{class_name}" and '
            print(f' XPATH -> //{tag}[{xpath_class}text()="{text}"]')
            def_el=self.driver.find_elements(By.XPATH,f'//{tag}[{xpath_class}text()="{text}"]')
            if len(def_el) != 1:
                text=text.replace('\t','').replace('\n','')
                print(f' XPATH -> //{tag}[{xpath_class}contains(.,"{text}")]')
                def_el=self.driver.find_elements(By.XPATH,f'//{tag}[{xpath_class}contains(.,"{text}")]')
            if len(def_el)==1:
                return def_el[0]

        raise Exception("요소를 재할당 할 수 없음. redefinition 함수 보완 필요")

    def redefinition(self,el:WebElement) -> WebElement:
        try:
            if el is None:
                raise Exception("요소 is None")

            tag=el.get_property('tag_name')
            attributes=self.driver.execute_script("return arguments[0].getAttributeNames();", el)
            # print('====================')
            # print(attributes)
            # print('====================')
            css=[]
            for att in attributes:
                # print(att)
                # print(el.get_property(att))
                # print('------------------------------------')
                att_value=el.get_property(att)
                if att_value !='':
                    if att == 'href':
                        css.append(f"[{att}='{att_value.replace(var.common_el['url'],'')}']")
                    css.append(f"[{att}='{att_value}']")

            # print(css)

            for selector in css:
                def_el=self.driver.find_elements(By.CSS_SELECTOR,f'{tag}{selector}')
                if len(def_el)==1:
                    print(f'{tag}{selector}')
                    return def_el[0]

            css=''.join(css)
            def_el=self.driver.find_elements(By.CSS_SELECTOR,f'{tag}{css}')
            if len(def_el)==1:
                print(f'{tag}{css}')

                return def_el[0]


            # text xpath
            text= el.get_property('innerText')
            if text != "":
                if 'class' in attributes:
                    xpath_class=f'@class="{el.get_property("className")}" and '
                else: xpath_class =''
                # print(f' XPATH -> //{tag}[{xpath_class}text()="{text}"]')
                def_el=self.driver.find_elements(By.XPATH,f'//{tag}[{xpath_class}text()="{text}"]')
                if len(def_el) != 1:
                    if text.find('\t') > -1:
                        text=text[0:text.find('\t')]
                    elif text.find('\n') > -1:
                        text=text[0:text.find('\n')]
                    # print(f' XPATH -> //{tag}[{xpath_class}contains(.,"{text}")]')
                    def_el=self.driver.find_elements(By.XPATH,f'//{tag}[{xpath_class}contains(.,"{text}")]')
                if len(def_el)==1:
                    print('xpath')
                    return def_el[0]


            print('리턴')
            return self.driver.execute_script("return arguments[0];", el)
            # print('재정의 망함')
            # raise Exception("요소를 재할당 할 수 없음. redefinition 함수 보완 필요")
        except InvalidSelectorException as e:
            # print('리턴')
            return self.driver.execute_script("return arguments[0];", el)
        except BaseException as e:
            print(e)
            print(traceback.format_exc())

    def redefinition_v2(self,el:WebElement) -> WebElement:
        '''
        요소 재정의 함수 version 2
        iOS Hybrid App element 상호작용 오류(StaleElementReferenceException)로 인한 해결방안으로 사용
        '''
        try:
                return self.driver.execute_script("return arguments[0];", el)
        except InvalidSelectorException as e:
            print(e)
            return self.driver.execute_script("return arguments[0];", el)
        except BaseException as e:
            print(e)
            print(traceback.format_exc())


    def scroll_x(self, el:WebElement):
        '''
        JS Execute; element를 x축 기준 가운데로 스크롤
        '''
        try:
            self.driver.execute_script('return arguments[0].scrollIntoViewIfNeeded();',el)
            return self.redefinition_v2(el)


        except BaseException as e:
            print(traceback.format_exc())
            print(e)
            return

    def all_swipe(self):
        '''
        JS Execute; 최상단부터 최하단으로 스크롤
        '''
        try:
            print('all_swipe()')
            direction ='up'
            velocity = 10000
            self.driver.execute_script('mobile: swipe',{'direction':direction,'velocity':velocity})
            direction ='down'
            velocity = 10000
            self.driver.execute_script('mobile: swipe',{'direction':direction,'velocity':velocity})

        except BaseException as e:
            print(traceback.format_exc())
            print(e)
            raise Exception("all_swipe() 실패")

    def swipe_test_tq(self,fromX,fromY,toX,toY,startPress=0.1,endPress=0.1,speed=445):
        '''
        JS Execute; 스와이프 execute_script 요정
        fromX: 드래그 시작 x좌표
        fromY: 드래그 시작 y좌표
        toX: 드래그 끝 x좌표
        toY: 드래그 끝 y좌표
        startPress: 드래그 시작 지점 누르기 시간
        endPress: 드래그 끝 지점 누르기 시간
        speed: 속도(초당 이동할 픽셀 수)
        '''

        data = {'fromX':fromX,'fromY':fromY,'toX':toX,'toY':toY,'pressDuration':startPress,'holdDuration':endPress,'velocity':speed}
        self.driver.execute_script('mobile: dragFromToWithVelocity',data)


    def scroll2_v2(self, el:WebElement|str):
        '''
        실시간 요소 위치 스크롤
        el: WebElement 또는 location
        '''
        try:
            loc=None
            if type(el) is str:
                loc=el
                if el.startswith('/'):
                    self.wait.until(EC.presence_of_element_located((AppiumBy.XPATH, loc)))
                    el=self.driver.find_element(AppiumBy.XPATH, loc)
                else:
                    self.wait.until(EC.presence_of_element_located((AppiumBy.CSS_SELECTOR, loc)))
                    el=self.driver.find_element(AppiumBy.CSS_SELECTOR, loc)

            self.scroll_center(el)
            # self.wait_loading()
            return self.redefinition_v2(el)

        except BaseException as e:
            print(traceback.format_exc())
            print(e)
            raise Exception("scroll2_수정버전() 실패")


    def scroll2(self, el:WebElement|str):
        try:
            loc=None
            if type(el) is str:
                loc=el
                if el.startswith('/'):
                    self.wait.until(EC.presence_of_element_located((AppiumBy.XPATH, loc)))
                    el=self.driver.find_element(AppiumBy.XPATH, loc)
                else:
                    self.wait.until(EC.presence_of_element_located((AppiumBy.CSS_SELECTOR, loc)))
                    el=self.driver.find_element(AppiumBy.CSS_SELECTOR, loc)
            screen=self.driver.get_screen_size()
            window=self.driver.get_window_size()
            current_scroll=self.driver.get_current_scrollTop().get('scrollTop')
            # system_bar= int((screen.get('height') - windows.get('height'))/2)
            system_bar=50
            # system_bar=int(round((screen.get('height') -  window.get('height'))/2)) # TODO 상단 systembar의 정확한 비율을 확인하는 방법이 필요함

            start_x=int(screen.get('width')/2)
            start_y=int(screen.get('height')/2)
            center_y=int(round(current_scroll + (screen.get('height')/2)))
            # print("**"*50)
            el_y= self.driver.execute_script('let offsetTop=0; el=arguments[0]; while(el){offsetTop+=el.offsetTop; el=el.offsetParent;} return offsetTop;',el)
            # print(f"el_y 1 => {el_y}")

            # time.sleep(5)
            # el=self.redefinition(el)
            # el_y= self.driver.execute_script('let offsetTop=0; el=arguments[0]; while(el){offsetTop+=el.offsetTop; el=el.offsetParent;} return offsetTop;',el)
            # print(f"el_y 1 => {el_y}")

            # print("**"*50)

            # 요소 세로 크기가  50 이하면, 임의로 크기 중심값(50) 지정
            el_height=int(el.get_property('offsetHeight'))
            if el_height < 50:
                el_height = 50
            else: el_height = int(el_height/2)
            el_y += el_height

            # print(f"el_y 2 => {el_y}")
            total_scroll=int(el_y - center_y - system_bar)
            # print(f"total_scroll({total_scroll}) ======== int({el_y}-{center_y}-{system_bar})")

            stop_x1=int(start_x - 30) # 스크롤 애니메이션 멈춤
            # stop_x2=int(start_x + 50) # 스크롤 애니메이션 멈춤
            stop_x2=int(start_x + 1) # 스크롤 애니메이션 멈춤
            stop_y=int(start_y-1)
            # 방향 설정을 위한 스위치(요소의 위치에서 반대 방향으로 스와이프 해야하기 때문에 -1를 곱해줌)
            p=-1

            if abs(total_scroll) > start_y: # 스와이프 해야하는 범위가 스크린 밖인지
                if total_scroll > 0 : end_y=0+system_bar #아래로 스크롤
                else:
                    end_y=start_y*2-system_bar # 위로 스크롤
                    p=1 # 나머지값 스크롤링 시, 방향 고정
                max_swipe_value=abs(int(round(total_scroll/start_y)))
                # total_scroll = total_scroll-((max_swipe_value-1)*system_bar)


                # 풀 스와이프는 (센터,센터) -> (스크린 끝,스크린 끝)으로 이동하는 게 아님(시스템 바 건들여서).
                # 그래서 위로 스왚 하던, 아래로 스왚 하던, 풀 스왚 횟수만큼 스크롤을 더해줘야 함
                total_scroll = total_scroll+(max_swipe_value*system_bar)

                # print(f"max_swipe_value -> {max_swipe_value}")
                for _ in range(0,max_swipe_value):
                    self.app_action.long_press(None,start_x,start_y,300).move_to(None,start_x,end_y).wait(400).release().perform()
                    self.driver.execute_script('mobile: pinch',{'scale':0.5,'velocity':-0.5})
                    # self.app_action.long_press(None,start_x,start_y,300).move_to(None,stop_x2,stop_y).release().perform()
                    # self.app_action.long_press(None,start_x,start_y,300).move_to(None,stop_x2,stop_y).release().perform()
                    # self.app_action.long_press(None,start_x,start_y,450).move_to(None,start_x,end_y).long_press(None,start_x,end_y,150).release().perform()
                divm= int(round(total_scroll%start_y))*p # 남은 스크롤 * 방향 설정
                end_y=start_y+divm
                # print(f" divm -> {divm} end_y -> {end_y}")
                if abs(divm) < 30: # 나머지 스크롤이 30보다 작으면 그냥 리턴
                    print('tq1')
                    pass
                    # return self.redefinition_v2(el)
                elif abs(divm) < 100: # 나머지 스크롤이 60보다 작으면
                    print('tq2')
                    # print('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
                    self.app_action.long_press(None,start_x,start_y,400).move_to(None,start_x,end_y).wait(400).release().perform()
                    self.driver.execute_script('mobile: pinch',{'scale':0.5,'velocity':-0.5})

                    # self.app_action.long_press(None,start_x,start_y,300).move_to(None,stop_x2,stop_y).release().perform()
                else:
                    self.app_action.long_press(None,start_x,start_y,300).move_to(None,start_x,end_y).wait(300).release().perform()
                    self.driver.execute_script('mobile: pinch',{'scale':0.5,'velocity':-0.5})

            else:
                if abs(total_scroll) < 30: # 총 스크롤이 10보다 작으면 그냥 리턴
                    print("# 총 스크롤이 10보다 작으면 그냥 리턴")
                    pass
                    # return self.redefinition_v2(el)
                end_y=start_y+(total_scroll*p)
                self.app_action.long_press(None,start_x,start_y,300).move_to(None,start_x,end_y).wait(400).release().perform()
                self.driver.execute_script('mobile: pinch',{'scale':0.5,'velocity':-0.5})

            if loc:
                if loc.startswith('/'):
                    self.wait.until(EC.presence_of_element_located((AppiumBy.XPATH, loc)))
                    el=self.driver.find_element(AppiumBy.XPATH, loc)
                else:
                    self.wait.until(EC.presence_of_element_located((AppiumBy.CSS_SELECTOR, loc)))
                    el=self.driver.find_element(AppiumBy.CSS_SELECTOR, loc)

            # return self.redefinition_v2(el)
            return el


        except BaseException as e:
            pass
            # print(traceback.format_exc())
            # print(e)
            # raise Exception("scroll2() 실패")

    def swipe_ios(self, el:WebElement):
        '''
        app_action으로 스와이프
        '''
        try:
            el_x=el.location.get('x') # 클릭할 요소 좌표 X
            el_y=el.location.get('y') # 클릭할 요소 좌표 y
            el_width=el.size.get('width') # 클릭할 요소 크기 Width
            el_height=el.size.get('height') # 클릭할 요소 크기 Height

            # device screen width/height
            screen_width=self.driver.execute_script("return screen.availWidth")
            screen_height=self.driver.execute_script("return screen.availHeight")

            # windows width/height
            windows_width=self.driver.get_window_size().get('width')
            windows_height=self.driver.get_window_size().get('height')

            self.switch_view('NATIVE_APP') # Native_APP 컨텍스트로 변경

            # X/Y = 요소 중앙 좌표 * 스크린 사이즈와 윈도우 사이즈 크기 계산값#
            X=int(int(el_x+el_width/2.0)*(screen_width*1.0/windows_width))
            Y=int(int(el_y+el_height/2.0)*(screen_height*1.0/windows_height))

            self.app_action.tap(None,X,Y).perform()

            self.switch_view(self.default_webview) # Web_View 컨텍스트로 변경
        except BaseException as e:
            print(e)
            return

    def swipe(self,loc:str | int | WebElement,view='true'):
        '''
        JS Execute; 요소 스크롤
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
                for i in range(0,loc+1):
                    self.driver.swipe(100,-400,100,400,800)
                    # self.app_action.tap(None,75,300).perform()
                    print(f"swipping {i}")
                return
            else:
                raise Exception('swipe() type error')
        except BaseException as e:
            el=None
            print(e)
            raise Exception('swipe error')

    def scroll_center(self,el):
        '''
        JS Execute; el요소를 중간으로 scroll
        '''
        self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", el)
        print("scrolling")
        return

    # NATIVE
    def loading_find_chain(self,elem) -> (WebElement):
        '''NATIVE VIEW 전용;'''
        for i in range(self.retry_count):
            try:

                self.wait.until(EC.presence_of_element_located((AppiumBy.IOS_CLASS_CHAIN,elem)))

                # 위에 동작으로 찾고자 하는 요소 존재가 확인됐으면 클릭 함수 발생
                self.find=self.driver.find_element(AppiumBy.IOS_CLASS_CHAIN,elem)
                if self.find != NoneType:
                    # print(self.find)
                    return self.find

                print(f'== loading_find_chains try count: {i+1}')
            except Exception:
                print(f"해당 페이지에서 요소를 찾을 수 없습니다. => try count: {i+1}")
                if(i == self.retry_count-1):
                    return False
    # NATIVE
    def loading_find_chains(self,elem) -> (WebElement):
        '''NATIVE VIEW 전용;'''
        for i in range(self.retry_count):
            try:

                self.wait.until(EC.presence_of_element_located((AppiumBy.IOS_CLASS_CHAIN,elem)))

                # 위에 동작으로 찾고자 하는 요소 존재가 확인됐으면 클릭 함수 발생
                self.find=self.driver.find_elements(AppiumBy.IOS_CLASS_CHAIN,elem)
                if self.find != NoneType:
                    # print(self.find)
                    return self.find

                print(f'== loading_find_chains try count: {i+1}')
            except Exception:
                print(f"해당 페이지에서 요소를 찾을 수 없습니다. => try count: {i+1}")
                if(i == self.retry_count-1):
                    return False

    def loading_find_id(self,elem) -> (WebElement):
        '''NATIVE VIEW 전용;'''
        # FIXME 간헐적으로 selenium.common.exceptions.TimeoutException: Message: 에러나서 일단 3번 정도 반복
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

                print(f'== loading_find_id try count: {i+1}')
            except Exception:
                print(f"해당 페이지에서 요소를 찾을 수 없습니다. => try count: {i+1}")
                if(i == self.retry_count-1):
                    return False

        # while True:
        #     self.find=self.driver.find_element(AppiumBy.ID,elem)

    def switch_view(self,context:str="default",count:int=5):
        '''
        컨텍스트 뷰 전환
        '''
        if context == "default":
            context= self.default_webview

        print(f"현재 페이지 views -> {str(self.driver.contexts)}")
        print(f"switch_viwe 실행 전 뷰 : {self.driver.context}")

        try:
            for _ in range(0,count):
                if context in self.driver.contexts:
                    break
                else:
                    time.sleep(1)
                    print('switch_view() context waitting ...')


            self.driver.switch_to.context(context)
            print(f"switch_viwe 실행 후 뷰 : {self.driver.context}")
            print(f"switch_viwe 실행 후 views -> : {self.driver.contexts}")

            if self.driver.context == 'NATIVE_APP':
                print('timeout = 2')
                self.wait_loading()
                self.wait= WebDriverWait(self.driver,timeout=2)

            elif self.driver.context == self.default_webview:
                print(f'timeout = {self.timeout}')
                self.wait_loading()
                self.wait= WebDriverWait(self.driver, timeout=self.timeout)
            else:
                self.wait_loading()

        except Exception as e:
            print(e)


    def modal_ck(self):
        try:
            self.wait_loading()
            # self.driver.implicitly_wait(1)
            # self.loading_find_css('div.modal-content img')
            self.modal_ck1()
            # self.wait_loading()
            print(f"modal_ck1 ->{self.loading_find_css(self.var['common_el']['body']).get_property('className')}")
            self.modal_ck2()
            # self.wait_loading()
            print(f"modal_ck2 ->{self.loading_find_css(self.var['common_el']['body']).get_property('className')}")
            # self.modal_ck3()
            # self.wait_loading()
            # print(f"modal_ck3 ->{self.loading_find_css(self.var['common_el']['body']).get_property('className')}")
            # self.driver.implicitly_wait(5)
            # self.wait_loading()
        except Exception:
            # self.driver.implicitly_wait(5)
            self.wait_loading()
            pass

    def modal_ck1(self):
        try:
            if self.loading_find_css_pre(self.var['common_el']['body']).get_property('className') == "modal-open" and self.loading_find_css('div.modal-content img').is_displayed():
                # self.driver.find_element(By.CSS_SELECTOR,self.var['common_el']['모달창_체크박스']).re_click()
                self.loading_find_css(self.var['common_el']['모달창_체크박스']).re_click()
            else:
                return
        except Exception:
            pass

    def modal_ck2(self):
        try:
            if self.loading_find_css_pre(self.var['common_el']['body']).get_property('className') == "modal-open" :
                # self.driver.find_element(By.CSS_SELECTOR,self.var['common_el']['모달창_닫기']).re_click()
                self.loading_find_css(self.var['common_el']['모달창_닫기']).re_click()
            else:
                return
        except Exception:
            pass
    def modal_ck3(self):
        try:
            if self.loading_find_css_pre(self.var['common_el']['body']).get_property('className') == "modal-open" :
                self.loading_find_css(self.var['common_el']['모달창_버튼']).re_click()
            else:
                return
        except Exception:
            pass

    def modal_ck_ins(self):
        try:
            if self.loading_find_css_pre(self.var['common_el']['딤드']):
                self.loading_find_css(self.var['common_el']['모달창_버튼_ins']).re_click()
            else:
                return
        except Exception:
            pass

    # 상단 햄버거 메뉴 버튼 작동 동작
    def movepage(self,*btns:str,address:str):
        '''
        *kwarg에 address 인자가 있을 시, 햄버거 메뉴 이동 후 현재 url에 address 값이 포함될 때까지 반복
        '''
        hamburger_main = self.var['common_el']['메인_메뉴']
        for i in range(self.retry_count):
            try:
                self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, hamburger_main)))
                self.driver.find_element(By.CSS_SELECTOR, hamburger_main).re_click()
                self.wait_loading()
                # time.sleep(1)
                for btn in btns:
                    if btn.startswith('/'):
                        self.wait.until(EC.presence_of_element_located((By.XPATH, btn)))
                        el=self.driver.find_element(By.XPATH, btn)
                    else:
                        self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, btn)))
                        el=self.driver.find_element(By.CSS_SELECTOR, btn)
                    if "전체 펼침" in self.driver.find_element(By.CSS_SELECTOR, self.var['common_el']['전체펼침']).get_property('innerText'):
                        open_list=self.driver.find_element(By.CSS_SELECTOR, self.var['common_el']['전체펼침'])
                        self.driver.execute_script("arguments[0].scrollIntoView(false);", open_list)
                        self.redefinition(open_list).re_click()
                    self.driver.execute_script("arguments[0].scrollIntoView(false);", el)
                    self.redefinition(el).re_click()
                    self.wait_loading()

                # time.sleep(2)   # 시간 충분히 주기 않으면 current_url을 가져오지 못함(current_url 부분 에러발생)
                self.wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, self.var['common_el']['메인_메뉴'])))

                # 현재 url이 address 인자값과 같으면 return(멈춤)
                print(f"current_url => : {self.driver.current_url}")
                if address in self.driver.current_url:
                    return
            except Exception as e:
                # 만약 햄버거 사이드바가 열린 상태일 때, 닫기 해줌
                if self.var['common_el']['gnb_url'] in self.driver.current_url :
                    self.gotoHome()
                # num번 반복해서 요소를 찾아도 없으면 False 반환
                if(i == self.retry_count-1):
                    print(f"햄버거 메뉴로 해당 페이지로 이동하는 것에 실패했습니다.")
                    return False
                else:
                    continue

    def close_popup(self,num):
        print(f"close_popup => {num}")
        size  = len (num)       # 팝업창의 갯수만큼 리스트에 담아지므로, len을 이용하여 팝업창 갯수 확인

        # 현재 팝업창의 갯수를 세어서 메인창의 리스트 번호가 아닌 경우 (메인은 항상 [0]), 반복문을 통해 창을 닫아줌
        for i in range(size):
            if num[i]  != num[0]:
                self.driver.switch_to.window(num[i])
                self.driver.close()

        self.driver.switch_to.window(num[0])

    def text_list_in_element(self,parent:str,list: list):
        '''
        요소에 text가 존재하는 확인
        parent: text 존재를 확인할 요소
        list: 확인할 text list
        :Usage:
            ::
                FC.text_list_in_element(element,['text1','text2','text3', ...])
        '''
        for i in range(self.retry_count):
            try:
                # 부모요소에서 자식객체 찾기
                if parent.startswith('//'):
                    parent_el=self.wait.until(EC.presence_of_element_located((By.XPATH,parent)))
                    # self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", parent_el)
                    parent_text=parent_el.get_property('innerText')
                else:
                    parent_el=self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR,parent)))
                    # self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", parent_el)
                    parent_text=parent_el.get_property('innerText')
                if parent_text is not None:
                    pass
            except Exception:
                print("해당 페이지에 부모 요소를 찾을 수 없습니다.")
                if i == self.retry_count-1:
                    return False
                else:
                    pass

        try:
            for t in list:
                print(t)
                assert t in parent_text, Exception("'"+ t + "' 텍스트를 찾을 수 없습니다.")
            else:
                pass
            return True
        except Exception as e:
            print(e)
            return False
            # raise Exception()

    def scroll(self,max_count:int,switch:bool=True):
        '''
        상/하 방향으로 max_count 만큼 스와이프
        max_count: 스와이프 횟수
        switch: 위로(True)/아래로(False)
        '''
        if switch:
            direction = 'up'
        else:
            direction = 'down'
        count=0
        while count < max_count:
            self.driver.execute_script('mobile: swipe', {'direction': direction})
            print("scrolling")
            time.sleep(.5)
            count+=1

    def back(self):
        # self.loading_find_css_pre('button.c-btn-prev').re_click()
        self.driver.back()
        self.wait_loading()

    def drag_and_drop_x(self,elem):
        print("swipe")
        self.action.drag_and_drop_by_offset(elem,-200,0).perform()
        self.action.reset_actions()

    #  현재 로그인 상태인지 확인
    def is_login(self):
        '''현재 로그인 상태 확인'''
        hamburger_main = self.var['common_el']['메인_메뉴']
        for i in range(self.retry_count):
            print(f"{i} -> is_login")
            try:
                obj=self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, hamburger_main)))
                self.driver.find_element(By.CSS_SELECTOR, hamburger_main).re_click()
                self.wait_loading()
                # time.sleep(3)

                logout_text= self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, var.login_el['로그인 여부']))).get_property('innerText')
                self.driver.find_element(By.CSS_SELECTOR, self.var['common_el']['뒤로가기']).re_click()

                if obj is not None and obj !=NoneType and logout_text is not None and logout_text !=NoneType and logout_text != "" and logout_text != NULL:
                    break
                print(f'movepage(address) count : {i+1}')
            except:
                print(traceback.format_exc())
                # 만약 햄버거 사이드바가 열린 상태일 때, 닫기 해줌
                if self.var['common_el']['gnb_url'] in self.driver.current_url :
                    print("만약 햄버거 사이드바가 열린 상태일 때, 닫기 해줌")
                    self.driver.find_element(By.CSS_SELECTOR, self.var['common_el']['뒤로가기']).re_click()
                # num번 반복해서 요소를 찾아도 없으면 False 반환
                if(i == self.retry_count-1):
                    return False

        print(f"logout_text -> {logout_text}")
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
        깊게 중첩되어 상호작용이 불가할 때 사용
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

    def wait_datas(self,parent_loc:str,*tag_names:str):
        '''
        태그의 innerText 출력 확인(공백X,빈란X)
        parent_loc:태그를 검색할 상위 부모(조상)요소
        tag_names: 가장 하위(자식) 태그여야 함
        '''
        # self.driver.implicitly_wait(1) # 1초동안 요소 대기
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
                        childElementCount = self.driver.execute_script("return arguments[0].childElementCount;", data)
                        if int(childElementCount) > 0:
                            children = self.driver.execute_script("return arguments[0].children;", data)
                            if [child for child in children if child.get_property('tag_name') in tag_names] == []:
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
                    time.sleep(1)
            # print(f"{str(tagNames)}의 datas 모두 정상 출력 확인2")
            # self.driver.implicitly_wait(20)
            return True
        except BaseException as e:
            print(e)
            print(traceback.format_exc())
            # self.driver.implicitly_wait(20)

    def chorme_access(self):
        self.switch_view('NATIVE_APP')
        # self.driver.implicitly_wait(5)
        if self.loading_find_id('com.android.chrome:id/signin_fre_continue_button'):
            self.loading_find_id('com.android.chrome:id/signin_fre_continue_button').click()
        if self.loading_find_id('com.android.chrome:id/button_primary'):
            self.loading_find_id('com.android.chrome:id/button_primary').click()
        if self.loading_find_id('com.android.chrome:id/ack_button'):
            self.loading_find_id('com.android.chrome:id/ack_button').click()
        if self.loading_find_id('com.android.chrome:id/negative_button'):
            self.loading_find_id('com.android.chrome:id/negative_button').click()
            if self.loading_find_id('com.android.permissioncontroller:id/permission_allow_button'):
                self.loading_find_id('com.android.permissioncontroller:id/permission_allow_button').click()

        self.switch_view()
        return

    def animation_none(self,parent_loc):
        '''애니메이션 제거(현재 기능 구현 부족으로 미사용중이지만 업데이트 가능성 있음)'''
        self.driver.execute_script("li =document.querySelectorAll('"+parent_loc+" *'); function test(){ for(let i =0; i<  li.length; i++){li[i].style.cssText='animation: none !important; transition: none !important; trasnform: none !important; transition-delay: 0s; opacity: 1;'}; }; test();")

    def move_to_click(self,el:WebElement|str):
        '''
        scroll로 el까지 이동
        el: WebElement or location
        '''
        # self.scroll2_v2(el).re_click()
        if type(el) is str:
            loc=el
            if el.startswith('/'):
                self.wait.until(EC.presence_of_element_located((AppiumBy.XPATH, loc)))
                el=self.driver.find_element(AppiumBy.XPATH, loc)
            else:
                self.wait.until(EC.presence_of_element_located((AppiumBy.CSS_SELECTOR, loc)))
                el=self.driver.find_element(AppiumBy.CSS_SELECTOR, loc)

        self.scroll_center(el)
        el = self.redefinition_v2(el)
        # self.wait_loading()
        el.re_click()
        self.wait_loading()
        return el

    def click_until_go_page(self,el:WebElement|str,scroll_switch:bool=True):
        '''
        다른 페이지로 이동할 때 까지 클릭 반복
        el: WebElement or location
        scroll_switch: move_to_click() 사용여부(default: 사용)
        '''
        current_url = self.driver.current_url
        re_el = el
        for _ in range(self.retry_count):
            try:
                if scroll_switch:
                    re_el = self.move_to_click(re_el)
                else:
                    re_el.re_click()
                    self.wait_loading()

                # time.sleep(1)
                print(f"{current_url} != {self.driver.current_url}")
                if current_url != self.driver.current_url:
                    break
                else:
                    re_el = self.redefinition_v2(re_el)
            except Exception as e:
                print(traceback.format_exc())
                print(e)
                re_el = self.redefinition_v2(re_el)
                pass

    def click_until_not_displayed(self,el:WebElement):
        '''
        el.is_displayed() == False 까지 클릭 반복
        el: WebElement
        '''
        for _ in range(self.retry_count):
            try:
                self.move_to_click(el)
                el = self.redefinition_v2(el)
                # time.sleep(1)
                print(f"{el.is_displayed()} == False")
                if el.is_displayed() is False:
                    break
                else:
                    el = self.redefinition_v2(el)

            except Exception as e:
                # print(traceback.format_exc())
                print(e)
                el = self.redefinition_v2(el)
                pass

    def click_until_modal_displayed(self,el:WebElement|str):
        '''
        modal이 노출 될 때 까지 클릭 반복
        el: WebElement or location
        '''
        for _ in range(self.retry_count):
            try:
                el=self.move_to_click(el)
                # time.sleep(1)
                print(self.loading_find_css_pre(self.var['common_el']['modal']).is_displayed())
                if self.loading_find_css_pre(self.var['common_el']['modal']).is_displayed():
                    break
                else:
                    el = self.redefinition_v2(el)

            except Exception as e:
                # print(traceback.format_exc())
                print(e)
                el = self.redefinition_v2(el)
                pass
