:: 가상환경 실행
:: 차후 git_clone.sh로 가상환경 생성부터 활성화 세팅

 
:: 1.수행 시작 메시지 전송

:: call C:\dev\remotePC_batchfiles\appium_aos_batchfiles\start_message_send_slack.bat > C:\dev\remotePC_batchfiles\appium_aos_batchfiles\batchfiles_result\step1.log 2>&1

:: 2. 깃 클론

call C:\dev\remotePC_batchfiles\appium_aos_batchfiles\git_clone.sh > C:\dev\remotePC_batchfiles\appium_aos_batchfiles\batchfiles_result\step2.log 2>&1

:: 3. 테스트 수행

call C:\dev\remotePC_batchfiles\appium_aos_batchfiles\automation_test.bat > C:\dev\remotePC_batchfiles\appium_aos_batchfiles\batchfiles_result\step3.log 2>&1

:: 4. 수행 결과 전송 (디버그)

::call C:\dev\remotePC_batchfiles\appium_aos_batchfiles\debug_log_slack_upload.bat > C:\dev\remotePC_batchfiles\appium_aos_batchfiles\batchfiles_result\step4.log 2>&1

:: 5. 수행 결과 전송 (스크린샷)

:: call C:\dev\remotePC_batchfiles\appium_aos_batchfiles\screenshot_slack_upload.sh > C:\dev\remotePC_batchfiles\appium_aos_batchfiles\batchfiles_result\step5.log 2>&1

:: 6. 수행 완료 메시지 전송

::  call C:\dev\remotePC_batchfiles\appium_aos_batchfiles\end_message_send_slack.bat > C:\dev\remotePC_batchfiles\appium_aos_batchfiles\batchfiles_result\step6.log 2>&1

:: cmd/k