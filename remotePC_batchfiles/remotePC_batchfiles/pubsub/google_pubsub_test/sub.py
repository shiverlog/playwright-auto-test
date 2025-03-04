import subprocess
from google.cloud import pubsub_v1
import json
from google.auth import jwt
import os

# TODO 수정
# sub.py 실행 시, powerShell 로 실행
PROJECT_ID = 'gcp-dev-uhdc-id'
SUB = f'projects/{PROJECT_ID}/subscriptions/qa-test-os-windows'
TIMEOUT=None

def auth():
    service_account_info = json.load(
        open("C:/dev/remotePC_batchfiles/pubsub/google_pubsub_test/service-account-punsub-key.json"))
    audience = "https://pubsub.googleapis.com/google.pubsub.v1.Subscriber"
    credentials = jwt.Credentials.from_service_account_info(
        service_account_info, audience=audience
    )
    return credentials

def running_port_chk(start_port) -> list:
    '''
    start_port를 기준으로 start_port+10까지 중 실행중인 포트 확인
    '''
    chk_ports = []
    running_ports = []
    for i in range(start_port,start_port+10):
        chk_ports.append(i)
    
    print(f"체크할 포트: {chk_ports}")
    for p in chk_ports:
        res = subprocess.getstatusoutput(f"netstat -ano |findstr {p} |findstr /v 'TIME_WAIT'") 
        if str(p) in res[1]:
            running_ports.append(p)
        
    print(f"현재 실행중인 포트 {running_ports}")
    return running_ports


def sub():

    def callback(message):
        msg=message.data.decode()
        OS=message.attributes["os"]
        if OS == "windows":
            print(msg)
            message.ack()
        elif "slack" in OS:
            if "windows" in msg :
                print(msg,"slack")
                message.ack()
            else:
                message.nack()
        else:
            message.nack()
        if  msg == 'windows-appium-aos-kill' and message.attributes["os"]=='windows':
            PORT = msg[-4:]
            print('aos kill')
            
            os.system("for /f \"tokens=1\" %t in (\'adb devices\') do ( adb -s %t shell pm clear com.android.chrome") # 안드로이드 단말 크롬 캐시날림
            os.system("for /f \"tokens=1\" %t in (\'adb devices\') do ( adb -s %t shell am force-stop com.lguplus.mobile.cs)") # 앱 강제종료
            os.system('adb uninstall io.appium.uiautomator2.server.test') # appium server 강제 종료
            os.system('adb uninstall io.appium.uiautomator2.server') # appium server 강제 종료
            os.system('taskkill /t /f /im mintty.exe') #git bash shell 강제종료

            ports = running_port_chk(4723)
            for port in ports:
                os.system(f"for /f \"tokens=5\" %t in ('netstat -ano ^|findstr {port}') do (if %t == 0 (echo '0') else (taskkill /f /pid %t))")

        elif msg == 'windows-selenium-mw-kill'and message.attributes["os"]=='windows':
            print('mw kill')
            res = subprocess.getstatusoutput("tasklist /m /fi \"imagename eq chrome.exe\"")
            if res[1].count("chrome.exe") > 0:
                ports=running_port_chk(9222)

                for port in ports:
                    os.system(f"for /f \"tokens=5\" %t in ('netstat -ano ^|findstr {port}') do (taskkill /f /pid %t)")

        elif msg == 'windows-selenium-pc-kill'and message.attributes["os"]=='windows':
            print('pc kill')
            res = subprocess.getstatusoutput("tasklist /m /fi \"imagename eq chrome.exe\"")
            if res[1].count("chrome.exe") > 0:
                ports=running_port_chk(9333)

                for port in ports:
                    os.system(f"for /f \"tokens=5\" %t in ('netstat -ano ^|findstr {port}') do (taskkill /f /pid %t)")

        # slack 실행용
        elif  msg == 'slack_windows-appium-aos-kill' and message.attributes["os"]=='windows':
            print('slack_aos kill')
            
            
            os.system("for /f \"tokens=1\" %t in (\'adb devices\') do ( adb -s %t shell pm clear com.android.chrome") # 안드로이드 단말 크롬 캐시날림
            os.system("for /f \"tokens=1\" %t in (\'adb devices\') do ( adb -s %t shell am force-stop com.lguplus.mobile.cs)") # 앱 강제종료
            os.system('for /f \"tokens=5\" %t in (\'netstat -ano | findstr :4723) do (taskkill /f /pid %t)') # appium server 강제 종료
            os.system('adb uninstall io.appium.uiautomator2.server.test') # appium server 강제 종료
            os.system('adb uninstall io.appium.uiautomator2.server') # appium server 강제 종료
            os.system('taskkill /t /f /im mintty.exe') #git bash shell 강제종료

            ports = running_port_chk(4723)
            for port in ports:
                os.system(f"for /f \"tokens=5\" %t in ('netstat -ano ^|findstr {port}') do (if %t == 0 (echo '0') else (taskkill /f /pid %t))")


        elif 'slack_windows-appium-aos-kill' in msg and message.attributes["os"]=='windows':
            PORT = msg[-4:]
            print(f'aos kill {PORT}')
            
            
            os.system("for /f \"tokens=1\" %t in (\'adb devices\') do ( adb -s %t shell pm clear com.android.chrome") # 안드로이드 단말 크롬 캐시날림
            os.system("for /f \"tokens=1\" %t in (\'adb devices\') do ( adb -s %t shell am force-stop com.lguplus.mobile.cs)") # 앱 강제종료
            os.system(f'for /f \"tokens=5\" %t in (\'netstat -ano | findstr :{PORT}) do (taskkill /f /pid %t)') # appium server 강제 종료
            os.system('adb uninstall io.appium.uiautomator2.server.test') # appium server 강제 종료
            os.system('adb uninstall io.appium.uiautomator2.server') # appium server 강제 종료
            os.system('taskkill /t /f /im mintty.exe') #git bash shell 강제종료
        

        elif msg == 'slack_windows-selenium-mw-kill'and message.attributes["os"]=='windows':
            print('slack_mw kill')            
            subprocess.call([r'C:/dev/remotePC_batchfiles/slack_selenium_mw_batchfiles/sub.bat'])

        elif msg == 'slack_windows-selenium-pc-kill'and message.attributes["os"]=='windows':
            print('slack_pc kill')
            subprocess.call([r'C:/dev/remotePC_batchfiles/slack_selenium_pc_batchfiles/sub.bat'])

        
        elif msg == 'windows-selenium-mw' and message.attributes["os"]=='windows':
            subprocess.call([r'C:/dev/remotePC_batchfiles/selenium_mw_batchfiles/main.bat'])
        elif msg == 'windows-selenium-pc' and message.attributes["os"]=='windows' :
            subprocess.call([r'C:/dev/remotePC_batchfiles/selenium_pc_batchfiles/main.bat'])
        elif msg == 'windows-appium-aos' and message.attributes["os"]=='windows' :
            os.system('adb kill-server')
            subprocess.call([r'C:/dev/remotePC_batchfiles/appium_aos_batchfiles/main.bat'])
        elif msg == 'windows-selenium-stg-mw' and message.attributes["os"]=='windows':
            subprocess.call([r'C:/dev/remotePC_batchfiles/selenium_stg_mw_batchfiles/main.bat'])
        elif msg == 'windows-selenium-stg-pc' and message.attributes["os"]=='windows' :
            subprocess.call([r'C:/dev/remotePC_batchfiles/selenium_stg_pc_batchfiles/main.bat'])
        elif msg == 'windows-appium-stg-aos' and message.attributes["os"]=='windows' :
            os.system('adb kill-server')
            subprocess.call([r'C:/dev/remotePC_batchfiles/appium_stg_aos_batchfiles/main.bat'])
        elif msg == 'slack-windows-selenium-mw' and 'slack' in message.attributes["os"]:                    # 아래로 slack 실행용
            print("slack-windows-selenium-mw---elif")
            batch_file_path = "C:\\dev\\remotePC_batchfiles\\slack_selenium_mw_batchfiles\\main.bat"
            working_directory = os.path.dirname(batch_file_path) 
            result = subprocess.run(batch_file_path, cwd=working_directory, shell=True) 
            print("Return code:", result.returncode)
        elif msg == 'slack-windows-selenium-pc' and 'slack' in message.attributes["os"] :
            print("windows-selenium-pc---elif")
            batch_file_path = "C:\\dev\\remotePC_batchfiles\\slack_selenium_pc_batchfiles\\main.bat"
            working_directory = os.path.dirname(batch_file_path) 
            result = subprocess.run(batch_file_path, cwd=working_directory, shell=True) 
            print("Return code:", result.returncode)
        elif msg == 'slack-windows-appium-aos' and 'slack' in message.attributes["os"] :
            os.system('adb kill-server')
            print("slack-windows-aos---elif")
            batch_file_path = "C:\\dev\\remotePC_batchfiles\\slack_appium_aos_batchfiles\\main.bat"
            working_directory = os.path.dirname(batch_file_path) 
            result = subprocess.run(batch_file_path, cwd=working_directory, shell=True) 
            print("Return code:", result.returncode)
        else:
            pass

    subscriber_audience = "https://pubsub.googleapis.com/google.pubsub.v1.Subscriber"  
    with pubsub_v1.SubscriberClient(credentials=auth().with_claims(audience=subscriber_audience)) as subscriber:
        future = subscriber.subscribe(SUB, callback)
        print(f"Listening for messages on {SUB}..\n")
        try:
            future.result(timeout=TIMEOUT) # error 구간
        except TimeoutError:
            future.cancel()
            future.result() 

def main():
        sub()


if __name__ == '__main__':
    main()