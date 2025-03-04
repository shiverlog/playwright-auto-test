import os,signal
import time
import subprocess
import urllib3

from common.slack import Slack


class AppiumServer():
    def __init__(self,port:int|str=4723):
        self.port=port
        self.server_process=None  
        self.server_log_path=self.set_log_path(f'result/debug/server_step_{self.port}.log') 

    
    def set_log_path(self,log_path:str="result/debug/server_step.log"):
        '''
        result_path: 서버 로그를 저장할 경로
        ex) 'result\\debug\\server_step.log'
        '''

        if '/' not in log_path:
            raise Exception("서버 로그 파일 경로를 '/'로 구분지어 사용해주세요")
        current_path = os.getcwd()
        parent_folder_name = log_path.split('/',1)[0]
        for _ in range(2):
            is_result_folder = os.path.join(current_path, parent_folder_name)
            if not os.path.exists(is_result_folder):
                current_path = os.path.dirname(current_path)
                pass
            else:
                break
        path = os.path.join(current_path,log_path)
        return path



    @property
    def is_running(self) -> bool:
        """
        appium 서버가 실행 중이면 True 반환
        """
        return self.server_process is not None and self.server_process.poll() is None

    def stop(self):
        """
        appium 서버가 정상적으로 멈추면 True 반환
        """
        is_terminated = False
        print(f"is running ->{self.is_running}")
        if self.is_running:
            assert self.server_process

            print(f"os.kill({self.server_process.pid},signal.SIGTERM)")
            print(f"pid : {self.server_process.pid}")
            print(f"lsof -P -i :"+str(self.port)+" |awk NR==2'{print $2}'|xargs kill -9")
            os.kill(self.server_process.pid,signal.SIGTERM) # == SIGKILL, SIGINT
            
        # is_terminated = True
        self.server_process = None
        try:
            print("----------- Appium Server Stop -----------")
            os.system(f"lsof -P -i :"+str(self.port)+" |awk NR==2'{print $2}'|xargs kill -9")
        except BaseException as e:
            print(e)
    
    def kill_port(self) -> bool:
        """
        appium 포트가 실행중일 때, 강제 종료
        appium server port 4723이 사용가능하여도 wda port 8100이 실행중이면 정상 시작 불가
        """
        try:
            os.system(f"lsof -P -i :"+str(self.port)+" |awk NR==2'{print $2}'|xargs kill -9")
            os.system(f"ios-deploy --kill --bundle_id com.lguplus.mobile.cs")
        except BaseException as e:
            print(e)
        self.server_process = None
        return 
    
    @property
    def is_listening(self) -> bool:
        """
        appium 서버가 정상 listening 중이면 True 반환
        """
        # if not self.is_running:
        #     return False
        try:
            return self._poll_status()
        except Exception:
            return False
        
    def _poll_status(self,timeout_ms: int=1000) -> bool:
        time_started_sec = time.time()
        conn = urllib3.PoolManager(timeout=1.0)
        while time.time() < time_started_sec + timeout_ms / 1000.0:
            if not self.is_running:
                raise Exception("appium server를 실행하세요.")
            try:
                resp = conn.request('GET', f"http://127.0.0.1:{self.port}/status")
                print(f"resp.status ==> {resp.status}")
                if resp.status < 400:
                    print(resp.data.decode())
                    return True
            except urllib3.exceptions.HTTPError:
                pass
            time.sleep(1.0)
        return False
    
    
    def waiting(self) -> bool:
        if self.is_listening:
            print("서버가 이미 실행 중")
            return
        count = 0
        try:
            while True:
                time.sleep(1)
                count+=1
                print(count)
                if count > 15:
                    raise BaseException("서버 실행 불가")
                if self.is_listening == self.is_running == True:
                    print("-"*15+" Appium Server Starting "+"-"*15)
                    break
            return True
        except BaseException as e:
            self.stop()
            self.kill_port()
            return False
        
    def appium_service(self):
        """
        실행중인 포트번호 시, 임의로 포트번호 지정
        서버 실행 후, 임의 지정된 포트번호 반환
        """

        # 포트 실행 여부 확인
        while True:
            res=subprocess.getstatusoutput(f"lsof -P -i :{self.port}")
            if res[1].find(f"{str(self.port)}") > 0:
                print(f"현재 {self.port} 포트는 사용중인 포트입니다.")
                self.kill_port()
                # self.port = int(self.port) +1
            else:
                print(f"{self.port} 는 사용가능한 포트 입니다.")
                self.server_log_path=self.set_log_path(f"result/debug/server_step_{self.port}.log")
                break
        Slack.send_slack_server_title()
        if self.is_running == False:

            env=os.environ.copy()
            print(self.port)
            # print(f"env(ANDROID_HOME): {os.environ['ANDROID_HOME']}")
            # print(f"env(JAVA_HOME): {os.environ['JAVA_HOME']}")
            # print(f"env: {env}")
            # print(" ===== appium thread start =====")
            try:
                # server_logfile_path=os.path.join(os.getcwd(),'result/debug/server_step.log')

                # self.server_process=subprocess.Popen(['appium','-a','0.0.0.0','-p',f'{self.port}','--session-override','>',f'{server_logfile_path}','2>&1'],shell=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE,env=env,creationflags=subprocess.CREATE_NEW_PROCESS_GROUP)
                # self.server_process=subprocess.Popen(['appium','-p',f'{self.port}','--use-plugins=images','>',f'{server_logfile_path}','2>&1'],shell=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE,env=env)
                self.server_process=subprocess.Popen(f"appium -p {self.port} --use-plugins=images > {self.server_log_path} 2>&1",shell=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE,env=env)
                print(f"--> {self.server_process.pid}")
                return self.port
            
            except BaseException as e:
                print('ERROR!')
                print(e)
            except Exception(RuntimeError):
                print('ERROR!')
                self.stop()
                raise Exception(RuntimeError)
        else: 
            print("is running")
