# from asyncio.windows_events import NULL
# from multiprocessing.connection import wait
import inspect
import io
import sys
import traceback
import time
import logging
import logging.handlers
from datetime import datetime
import os       #스크린샷 삭제시 사용
import glob     #스크린샷 삭제시 사용 
from typing import Callable,Any

from selenium.common.exceptions import *
from appium.common.exceptions import *

from base.appdriver import AppDriver
from common.slack import Slack

sys.path.append('/Users/nam/dev/remotePC_batchfiles/pubsub/appium_ios')


# mac 환경 전용
import ssl
import certifi
import socket
import requests
import getpass

NULL=type(None)

class CustomLogger(logging.Logger):
    def __init__(self, name, level=logging.NOTSET):
        super().__init__(name, level)
        self.DETAIL = 15
        self.PASS = 25
        self.FAIL = 35
        logging.addLevelName(self.DETAIL, "DETAIL")
        logging.addLevelName(self.PASS, "PASS")
        logging.addLevelName(self.FAIL, "FAIL")

    def _find_caller(self, stack_info=False, stacklevel=1):
        """
        Find the stack frame of the caller so that we can note the source
        file name, line number and function name.
        """
        frame = inspect.currentframe()
        # On some versions of IronPython, currentframe() returns None if
        # IronPython isn't run with -X:Frames.
        if frame is not None:
            frame = frame.f_back
        rv = "(unknown file)", 0, "(unknown function)", None
        while hasattr(frame, "f_code"):
            co = frame.f_code
            filename = os.path.normcase(co.co_filename)
            if filename == logging.__file__:
                frame = frame.f_back
                continue
            if 'debug.py' not in filename:
                sinfo = None
                if stack_info:
                    sio = io.StringIO()
                    sio.write('Stack (most recent call last):\n')
                    traceback.print_stack(frame, file=sio)
                    sinfo = sio.getvalue()
                    if sinfo[-1] == '\n':
                        sinfo = sinfo[:-1]
                    sio.close()
                rv = (co.co_filename, frame.f_lineno, co.co_name, sinfo)
                break
            frame = frame.f_back
        return rv

    def _log_with_location(self, level, msg, args, exc_info=None, extra=None, stack_info=False):
        filename, lineno, func, _ = self._find_caller(stack_info)
        if extra is None:
            extra = {}
        extra['real_filename'] = filename
        extra['real_lineno'] = lineno
        extra['real_funcName'] = func

        # Create a LogRecord with empty args
        record = self.makeRecord(self.name, level, filename, lineno, msg, (), exc_info, func, extra, sinfo=None)
        
        # Format the message here if args are provided
        if args:
            record.msg = msg % args
        
        self.handle(record)
        

    def detail(self, msg, *args, **kwargs):
        return self._log_with_location(self.DETAIL, msg, args, **kwargs)

    def pass_(self, msg, *args, **kwargs):
        return self._log_with_location(self.PASS, msg, args, **kwargs)

    def fail(self, msg, *args, **kwargs):
        return self._log_with_location(self.FAIL, msg, args, **kwargs)

class Debug():
    def __init__(self,Driver:AppDriver):
        self.Driver=Driver
        self.driver = Driver.driver           # 드라이버 셋팅 
        self.logger = self.get_log()            # 로그 셋팅
        # self.os = Driver.os           # os 분기 처리시 필요
        # self.count = Driver.getCount()     # 디버그 스크린샷 파일명 연번
        # self.count = Driver.getCount()     # 디버그 스크린샷 파일명 연번
        self.wait = Driver.wait
        self.action = Driver.action #스크롤/스와이프 액션 객체
        
    def return_cbk():
        return
    
    def test_case(self,function:Callable[...,Any],fail_text:str,callback:Callable[...,Any]=None,args=None):
        # sys._getframe().f_code.co_name 현재 호출되는 함수명을 불러옴
        try:
            if not args is None:
                function(args)
                
            else:
                function()

        except Exception as e:
            print(e)

            # if e != '' and e !="" and e != None:
            #     print(e)
            #     self.logger.debug(fail_text + f" 실패({e})")
                
            # else:
            #     self.logger.debug(fail_text + " 실패")
            self.logger.debug(fail_text + " 실패")           
            self.screenshot()
            self.send_slack_message_slack_sdk(fail_text,False)
            # if callback is not None:
            #     callback(fail_text + " 실패")
        else:
            self.logger.info(fail_text + " 성공")
            self.send_slack_message_slack_sdk(fail_text)
            # callback(fail_text + " 성공")
            return True

    def get_log2(self):
        '''디버깅 로그 세팅 v1'''

        # 커스텀 로그 레밸 및 로그 추가
        logging.addLevelName(15,'PASS')
        def PASS(self, msg, *args, **kwargs):
            if self.isEnabledFor(15):
                self._log(15, msg, args, **kwargs)
        logging.PASS=15
        logging.Logger.PASS=PASS

        logging.addLevelName(16,'FAIL')
        def FAIL(self, msg, *args, **kwargs):
            if self.isEnabledFor(16):
                self._log(15, msg, args, **kwargs)
        logging.FAIL=16
        logging.logger.debug=FAIL

        # print(logging.getLevelNamesMapping()) #addLevelName PASS/FAIL 추가되었는지 확인


        logger = logging.getLogger('test')
        logger.setLevel(logging.DEBUG)
        
        
        # 로그 이중 출력 방지
        if len(logger.handlers) > 0:
            return logger # Logger already exists
        
        # 로그 내용 형식 설정
        formatter = logging.Formatter('%(asctime)s - [%(funcName)s] - %(message)s')
        # formatter_defore = logging.Formatter('%(asctime)s - %(levelname)s - [%(funcName)s : %(lineno)d] - %(message)s')


        

        
        
        # 파일명 지정 (20230103_debug.log 형식으로 지정됨)
        # 단순히 debug.log 형식으로 지정원하면 FileHandler 괄호 안에 filename='result/debug.log',encoding='ANSI', mode='w' 로 변경하면 됨
        # mode='a' 의 경우 로그가 누적 (mode 삭제시 디폴트 값) / mode ='w' 경우 새로운 로그로만 기록됨
        console = logging.StreamHandler()
        # file_handler_debug = logging.FileHandler(filename='result/debug/' + datetime.now().strftime('%Y%m%d') + '_debug.log',encoding='utf-8', mode='w')
        # file_handler_info = logging.FileHandler(filename='result/debug/' + datetime.now().strftime('%Y%m%d') + '_info.log',encoding='utf-8', mode='w')

        file_handler_pass = logging.FileHandler(filename=self.Driver.path + '/result/debug/' + datetime.now().strftime('%Y%m%d') + f'_{self.Driver.udid}_info.log',encoding='utf-8', mode='w')
        file_handler_fail = logging.FileHandler(filename=self.Driver.path + '/result/debug/' + datetime.now().strftime('%Y%m%d') + f'_{self.Driver.udid}_info.log',encoding='utf-8', mode='w')

        # 레벨 지정
        console.setLevel(logging.DEBUG)
        # file_handler_debug.setLevel(logging.DEBUG)
        # file_handler_info.setLevel(logging.INFO)
        file_handler_pass.setLevel(logging.PASS)
        file_handler_fail.setLevel(logging.FAIL)

        # format 설정
        console.setFormatter(formatter)
        # file_handler_debug.setFormatter(formatter)
        # file_handler_info.setFormatter(formatter)
        file_handler_pass.setFormatter(formatter)
        file_handler_fail.setFormatter(formatter)

        # handler 추가
        logger.addHandler(console)
        # logger.addHandler(file_handler_debug)
        # logger.addHandler(file_handler_info)
        logger.addHandler(file_handler_pass)
        logger.addHandler(file_handler_fail)
 

        return logger

    def get_log(self):
        '''디버깅 통합 로그 세팅 v2'''
        logging.setLoggerClass(CustomLogger)
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.DEBUG)
        
        if len(logger.handlers) > 0:
            return logger

        formats = {
                logger.DETAIL: '%(asctime)s - [DETAIL] - %(real_filename)s, line, %(real_lineno)d in %(real_funcName)s, "%(message)s"',
                logger.debug: '%(asctime)s - [FAIL] - [%(real_funcName)s] - %(message)s',
                logger.PASS: '%(asctime)s - [PASS] - [%(real_funcName)s] - %(message)s',
                'default': '%(asctime)s - %(levelname)s - [%(real_funcName)s] - %(message)s'
            }

        class LevelSpecificFormatter(logging.Formatter):
            def __init__(self, formats):
                super().__init__()
                self.formats = formats

            def format(self, record):
                log_fmt = self.formats.get(record.levelno, self.formats['default'])
                formatter = logging.Formatter(log_fmt)
                # Use the formatted message if available, otherwise format it here
                if not hasattr(record, 'message'):
                    record.message = record.msg % record.args if record.args else record.msg
                return formatter.format(record)

        formatter = LevelSpecificFormatter(formats)
        console = logging.StreamHandler()
        file_handler = logging.FileHandler(filename='result/debug/' + datetime.now().strftime('%Y%m%d') + '_info.log', encoding='utf-8', mode='w')

        console.setLevel(logging.INFO)
        file_handler.setLevel(logger.DETAIL)

        console.setFormatter(formatter)
        file_handler.setFormatter(formatter)

        logger.addHandler(console)
        logger.addHandler(file_handler)

        return logger


    # 에러 발생 시 스크린 샷 
    def screenshot(self):

        # self.driver.save_screenshot("result/screenshot/" + datetime.now().strftime('%Y%m%d') +"_" + func_name + str(var) +"_fail.png")            # 스크린 샷 저장
        print(f"result/screenshot/img_{self.Driver.udid}_{self.Driver.getCount()}.png")
        print(f"self.count =>>> {self.Driver.getCount()}")
        self.driver.save_screenshot(f"result/screenshot/img_{self.Driver.udid}_{self.Driver.getCount()}.png")            # 스크린 샷 저장
        Slack.setFilePath(f"result/screenshot/img_{self.Driver.udid}_{self.Driver.getCount()}.png")
        self.Driver.Counting()
        time.sleep(2)
        return self.Driver.getCount()



    # 스크린샷 폴더에 쌓이는 이미지 파일 지우기 ( glob.glob()함수 이용 )
    def screenshot_del(self):


        # 스크린샷 경로    
        path_png = './result/screenshot/*.png'

        # 이미지 파일 삭제
        for i in glob.glob(path_png):
            os.remove(i)

        time.sleep(1)

    def exception_pretreatment(self) -> {}:
        exception_type, exception_value, trace = sys.exc_info()
        trace_text = ''.join(traceback.format_tb(trace))
        # print("-"*30)
        # print("-"*30)
        # print(exception_type)
        # print("-"*30)
        # print("-"*30)
        # print(exception_value)
        # print("-"*30)
        # print("-"*30)
        # print(trace)
        # print("-"*30)
        # print("-"*30)

        try:
            raise exception_type
        except TypeError:
                print("해당 요소는 상호작용 할 수 없음")
                type_text = "해당 상호작용 할 수 없음" 
                trace_text=''.join(traceback.format_tb(trace))
                msg = {"type_text":type_text, "exception_value":exception_value,"traceback":trace_text}
                return msg

        except KeyError:
            print("키값 에러")
            type_text = "키값 에러" 
            trace_text=''.join(traceback.format_tb(trace))
            msg = {"type_text":type_text, "exception_value":exception_value,"traceback":trace_text}
            return msg
            
        except IndexError:
            print("인덱스값 에러")
            type_text = "인덱스값 에러" 
            trace_text=''.join(traceback.format_tb(trace))
            msg = {"type_text":type_text, "exception_value":exception_value,"traceback":trace_text}
            return msg

        except NoSuchContextException:
            print("컨텍스트를 찾을 수 없음")
            type_text = "컨텍스트를 찾을 수 없음" 
            trace_text=''.join(traceback.format_tb(trace))
            msg = {"type_text":type_text, "exception_value":exception_value,"traceback":trace_text}
            return msg
        except ElementNotInteractableException:
            print("해당 요소는 상호작용 할 수 없음")
            type_text = "해당 상호작용 할 수 없음" 
            trace_text=''.join(traceback.format_tb(trace))
            msg = {"type_text":type_text, "exception_value":exception_value,"traceback":trace_text}
            return msg

        except NoSuchElementException:
            print("요소를 찾을 수 없음")
            type_text = "요소를 찾을 수 없음" 
            trace_text=''.join(traceback.format_tb(trace))
            msg = {"type_text":type_text, "exception_value":exception_value,"traceback":trace_text}
            return msg

        except ElementClickInterceptedException:
            print("해당 요소를 클릭할 수 없음")
            type_text = "해당 요소를 클릭할 수 없음" 
            trace_text=''.join(traceback.format_tb(trace))
            msg = {"type_text":type_text, "exception_value":exception_value,"traceback":trace_text}
            return msg

        except AttributeError:
            print("요소를 찾을 수 없음")
            type_text = "요소를 찾을 수 없음" 
            trace_text=''.join(traceback.format_tb(trace))
            msg = {"type_text":type_text, "exception_value":exception_value,"traceback":trace_text}
            return msg

        except AssertionError:
            print("이슈")
            type_text = "이슈" 
            trace_text=''.join(traceback.format_tb(trace))
            msg = {"type_text":type_text, "exception_value":exception_value,"traceback":trace_text}
            return msg
        
        except BaseException:
            type_text = "" 
            trace_text=''.join(traceback.format_tb(trace))
            msg = {"type_text":type_text, "exception_value":exception_value,"traceback":trace_text}
            return msg

    def print_res(self, res:list):
        if all(res):
            return all(res)
        else:
            print(str(res))
            return all(res)

    def print_dbg(self,msg:str,switch:bool=True):
        '''
        디버깅 통합 함수
        msg: 로그 메시지
        switch: pass(True)/fail(False)
        '''
        if switch:
            self.logger.pass_(msg+" 성공")
            Slack.send_slack(msg+" 성공")
        else:
            self.screenshot()
            Slack.send_slack(msg+" 실패",False)
            self.logger.debug(msg+" 실패")
            self.logger.detail(traceback.format_exc(1))
