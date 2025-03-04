:: 오늘 날짜 가져오기
:: SET yyyymmdd=%DATE:~0,4%%DATE:~5,2%%DATE:~8,2%
:: REM SET yyyymmdd=%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%

:: 오늘 날짜.debug.log 파일을 한 줄 씩 읽어서 slack 으로 전송
::for /f "delims=" %%t in (C:\dev\remotePC_batchfiles\slack_appium_aos_batchfiles\batchfiles_result\step3_automation_test_result.log) do (curl -k https://hooks.slack.com/services/E05576J9Q8J/C06599H0H08 -X POST -H'Content-type:application/json' --data "{""text"":""%%t"",""color"":""#36a64f""}")
 