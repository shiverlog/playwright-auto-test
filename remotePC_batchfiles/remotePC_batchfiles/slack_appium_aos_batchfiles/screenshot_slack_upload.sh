#!/bin/bash

# git clone 받은 selenium_mw 파일의  에러 스크린샷 파일 수 가져오기
cd 'C:/dev/remotePC_batchfiles/pubsub/appium_aos/result/screenshot';
SCREENSHOT=$(cd C:/dev/remotePC_batchfiles/pubsub/appium_aos/result/screenshot; ls -al | grep ^- | wc -l;)

echo "전송할 오류 스크린샷 수: $SCREENSHOT"

# slack으로 메시지를 전송할 때 필요한 매개변수
SLACK_URL=https://lgdigitalcommerce.slack.com/api/files.upload
SLACK_TOKEN=xoxb-3457711939825-4548963274739-5Edb3DkHcSGcRZV306jp483n
FILE_PREV_URL=C:/dev/remotePC_batchfiles/pubsub/appium_aos/result/screenshot
SLACK_CHANNEL=C04F5T84SLS


# 에러 스크린샷 파일이 없으면, 프로세스 종료
if  [ $SCREENSHOT -eq 0 ]
then
exit 0
fi

# 에러 스크린샷 파일 수 만큼 슬랙에 파일 전송
for ((VAR=0 ;  VAR < SCREENSHOT ; VAR++));
do 
curl -k "https://lgdigitalcommerce.slack.com/api/files.upload" -F token="${SLACK_TOKEN}" -F channels=${SLACK_CHANNEL} -F title="img${VAR}.png" -F filename="img${VAR}.png" -F file=@img${VAR}.png

done > C:/dev/remotePC_batchfiles/slack_appium_aos_batchfiles/batchfiles_result/step5_screenshot_slack_upload.log 2>&1

# 파일 전송 후, selenium 파일 삭제
# rmdir /s /q  appium_aos
