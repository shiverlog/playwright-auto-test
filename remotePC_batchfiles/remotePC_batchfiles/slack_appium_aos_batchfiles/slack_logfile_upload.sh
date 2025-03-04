#!/bin/bash


# slack으로 메시지를 전송할 때 필요한 매개변수
SLACK_URL=https://lgdigitalcommerce.slack.com/api/files.upload
SLACK_TOKEN=xoxb-3457711939825-4548963274739-5Edb3DkHcSGcRZV306jp483n
FILE_PREV_URL=C:/dev/remotePC_batchfiles/slack_appium_aos_batchfiles/batchfiles_result
SLACK_CHANNEL=C06599H0H08

cd 'C:\dev/remotePC_batchfiles/slack_appium_aos_batchfiles/batchfiles_result';

# /batchfiles_result/step3_automation_test_result.log 파일의 존재 유무 가져오기
File=C:/dev/remotePC_batchfiles/slack_appium_aos_batchfiles/batchfiles_result/step3_automation_test_result.log

if [ -e "$File" ];
 echo "$File exist "
 curl -k "https://lgdigitalcommerce.slack.com/api/files.upload" -F token="${SLACK_TOKEN}" -F channels=${SLACK_CHANNEL} -F title="slack_aos_로그파일" -F filename="slack_aos_logfile" -F file=@step3_automation_test_result.log
then
exit 0
fi

done > C:/dev/remotePC_batchfiles/slack_appium_aos_batchfiles/batchfiles_result/step5_send_logfile.log 2>&1

# 파일 전송 후, selenium 파일 삭제
# rmdir /s /q  appium_aos
