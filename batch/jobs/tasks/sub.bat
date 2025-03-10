@echo off
SETLOCAL EnableDelayedExpansion

:: POC 타입 설정 (pc, mw, aos, ios 중 하나)
set POC=%1

:: 각 POC별 설정 (Appium, Python 실행 경로 등)
set "PC_PATH=C:\dev\remotePC_batchfiles\pubsub\appium_pc"
set "MW_PATH=C:\dev\remotePC_batchfiles\pubsub\appium_mw"
set "AOS_PATH=C:\dev\remotePC_batchfiles\pubsub\appium_aos"
set "IOS_PATH=C:\dev\remotePC_batchfiles\pubsub\appium_ios"

set "VENV_PATH=C:\dev\remotePC_batchfiles\pubsub\venv\Scripts\activate.bat"
set "SUB_PY_PATH=C:\dev\remotePC_batchfiles\pubsub\google_pubsub_test\sub.py"
set "LOG_PATH=C:\dev\remotePC_batchfiles\slack_appium_aos_batchfiles\batchfiles_result"

:: POC 타입 확인 및 경로 설정
if "%POC%"=="pc" (
    set "SCRIPT_PATH=%PC_PATH%"
) else if "%POC%"=="mw" (
    set "SCRIPT_PATH=%MW_PATH%"
) else if "%POC%"=="aos" (
    set "SCRIPT_PATH=%AOS_PATH%"
) else if "%POC%"=="ios" (
    set "SCRIPT_PATH=%IOS_PATH%"
) else (
    echo 잘못된 POC 타입입니다. 사용 가능한 값: pc | mw | aos | ios
    exit /b 1
)

:: ADB 실행 (안드로이드 디바이스 초기화)
for /f "tokens=1" %%t in ('adb devices') do (
    set device=%%t
    adb -s !device! shell pm clear com.android.chrome
)

:: Slack Webhook 알림 전송 (Appium 종료 메시지)
curl -k https://hooks.slack.com/services/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 -X POST -H "Authorization:xoxb-3457711939825-4548963274739-5Edb3DkHcSGcRZV306jp483n" --data "{""text"":""%POC% 강제 종료"",""color"":""#36a64f""}"

:: 실행 중인 프로세스 종료
taskkill /f /im chrome.exe
taskkill /t /f /im mintty.exe
taskkill /f /im cmd.exe
taskkill /f /im python.exe

:: Appium 경로로 이동
cd /d "%SCRIPT_PATH%"

:: 가상환경 실행
call "%VENV_PATH%"

:: sub.py 실행 및 로그 저장
python "%SUB_PY_PATH%" > "%LOG_PATH%\step3_automation_test_result_%POC%.log" 2>&1

:: 실행 결과 확인
if %errorlevel% neq 0 (
    echo Python 실행 중 오류 발생!
    exit /b 1
)

echo %POC% Playwright 테스트 완료. 로그 파일: %LOG_PATH%\step3_automation_test_result_%POC%.log
exit /b 0
