:: git clone 된 selenium 경로로 이동
cd "C:\dev\remotePC_batchfiles\pubsub\selenium_pc"

:: 가상환경 실행
:: cd "./venv/Scripts"
:: call activate

cd "C:\dev\remotePC_batchfiles\pubsub\selenium_pc"

:: 파이썬 실행 후, 커맨드 log 내용을 automation_test_result.log 파일로 내보내기
python __main__.py > C:/dev/remotePC_batchfiles/slack_selenium_pc_batchfiles/batchfiles_result/step3_automation_test_result.log 2>&1

::cmd/k