@echo off
SETLOCAL EnableDelayedExpansion

:: POC 환경 설정
set POC=%1

:: Slack Webhook URL (환경변수를 사용)
set "SLACK_WEBHOOK=https://hooks.slack.com/services/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"

:: 환경변수에서 Slack 토큰 가져오기
if "%SLACK_TOKEN%"=="" (
    echo SLACK_TOKEN 환경 변수가 설정되지 않았습니다.
    exit /b 1
)

:: POC 입력 확인
if "%POC%"=="" (
    echo POC 값을 입력해야 합니다. 사용 가능한 값: pc | mw | aos | ios
    exit /b 1
)

:: 실행 시작 메시지 전송
curl -k %SLACK_WEBHOOK% -X POST -H "Authorization:%SLACK_TOKEN%" --data "{""text"":""[%POC%] 실행 시작"",""color"":""#36a64f""}"

:: 여기에 실행할 주요 스크립트 또는 테스트 수행 코드 추가 가능

:: 실행 완료 메시지 전송
curl -k %SLACK_WEBHOOK% -X POST -H "Authorization:%SLACK_TOKEN%" --data "{""text"":""[%POC%] 실행 완료"",""color"":""#36a64f""}"

exit /b 0
