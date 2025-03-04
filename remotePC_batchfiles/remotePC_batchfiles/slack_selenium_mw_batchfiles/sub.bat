::가상환경 실행 후 sub.py 실행

::taskkill /f /im chrome.exe
::taskkill /t /f /im mintty.exe
::taskkill /f /im cmd.exe
::taskkill /f /im python.exe

curl -k https://hooks.slack.com/services/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 -X POST -H "Authorization:xoxb-3457711939825-4548963274739-5Edb3DkHcSGcRZV306jp483n" --data "{""text"":""selenium_mw 강제 종료"",""color"":""#36a64f""}"

::selenium_mw 경로로 이동
cd C:\dev\remotePC_batchfiles\pubsub\selenium_mw

::가상환경 실행
call C:\dev\remotePC_batchfiles\pubsub\venv\Scripts\activate.bat

::sub.py 파일 실행
python C:\dev\remotePC_batchfiles\pubsub\google_pubsub_test\sub.py

