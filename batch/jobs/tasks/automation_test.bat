@echo off
SETLOCAL EnableDelayedExpansion

:: POC 환경 설정 (pc, mw, aos, ios)
set POC=%1

:: POC별 설정
set "VENV_PATH=C:\dev\remotePC_batchfiles\pubsub\venv\Scripts\activate.bat"
set "SLACK_SCRIPTS=C:\dev\remotePC_batchfiles\slack_appium_aos_batchfiles"
set "RESULT_PATH=C:\dev\remotePC_batchfiles\slack_appium_aos_batchfiles\batchfiles_result"

:: POC 입력 확인
if "%POC%"=="" (
    echo POC 값을 입력해야 합니다. 사용 가능한 값: pc | mw | aos | ios
    exit /b 1
)

:: 1. 수행 시작 메시지 전송
echo [%POC%] 실행 시작...
call "%SLACK_SCRIPTS%\start_message_send_slack.bat" > "%RESULT_PATH%\step1.log" 2>&1

:: 2. Git 클론 (Pipelines 동적 실행)
call "%SLACK_SCRIPTS%\git_clone.sh" %POC% > "%RESULT_PATH%\step2.log" 2>&1

:: 3. 가상환경 실행
call "%VENV_PATH%"

:: 4. 테스트 수행
call "%SLACK_SCRIPTS%\automation_test.bat" %POC% > "%RESULT_PATH%\step3.log" 2>&1

:: 5. 수행 결과 전송 (디버그 로그)
call "%SLACK_SCRIPTS%\slack_logfile_upload.sh" > "%RESULT_PATH%\step4.log" 2>&1

:: 6. 수행 결과 전송 (스크린샷)
call "%SLACK_SCRIPTS%\screenshot_slack_upload.sh" > "%RESULT_PATH%\step5.log" 2>&1

:: 7. 수행 완료 메시지 전송
call "%SLACK_SCRIPTS%\end_message_send_slack.bat" > "%RESULT_PATH%\step6.log" 2>&1

:: 완료 후 종료
echo [%POC%] 모든 작업 완료.
cmd /k
