@echo off
SETLOCAL EnableDelayedExpansion

:: POC 환경 설정
set POC=%1

:: Slack 설정
set "SLACK_URL=https://lgdigitalcommerce.slack.com/api/files.upload"
set "SLACK_CHANNEL=123"
set "SLACK_TOKEN=%SLACK_TOKEN%"  :: 환경변수에서 Slack 토큰 가져오기

:: POC별 테스트 결과 경로 설정
set "RESULT_BASE=C:\dev\remotePC_batchfiles\pubsub\appium_%POC%\result"
set "LOG_PATH=C:\dev\remotePC_batchfiles\slack_appium_aos_batchfiles\batchfiles_result"

:: 검토해야 하는 파일 타입 목록
set "FILES_TO_UPLOAD=step3_automation_test_result.log *.png *.mp4 *.zip *.json"

:: Slack 토큰이 없을 경우 종료
if "%SLACK_TOKEN%"=="" (
    echo SLACK_TOKEN 환경 변수가 설정되지 않았습니다.
    exit /b 1
)

:: POC 입력 확인
if "%POC%"=="" (
    echo POC 값을 입력해야 합니다. 사용 가능한 값: pc | mw | aos | ios
    exit /b 1
)

:: 파일 업로드 시작
echo [%POC%] Slack 파일 업로드 시작...

cd /d "%RESULT_BASE%"
for %%F in (%FILES_TO_UPLOAD%) do (
    if exist "%%F" (
        echo 파일 업로드 중: %%F
        curl -k "%SLACK_URL%" -F token="%SLACK_TOKEN%" -F channels="%SLACK_CHANNEL%" -F title="[%POC%] %%F" -F filename="%%F" -F file=@%%F
    )
)

:: 업로드 완료 메시지 전송
curl -k "%SLACK_URL%" -F token="%SLACK_TOKEN%" -F channels="%SLACK_CHANNEL%" --data "{""text"":""[%POC%] 테스트 결과 파일 업로드 완료"",""color"":""#36a64f""}"

echo [%POC%] 모든 테스트 결과 파일 업로드 완료.
exit /b 0
