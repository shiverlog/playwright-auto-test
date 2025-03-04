::-H 에 토큰으로도 사용 가능 
:: Authorization:xoxb-3457711939825-4548963274739-5Edb3DkHcSGcRZV306jp483n

:: slack으로 실행완료 메시지 전송
curl -k https://hooks.slack.com/services/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 -X POST -H "Authorization:xoxb-3457711939825-4548963274739-5Edb3DkHcSGcRZV306jp483n" --data "{""text"":""selenium_mw 실행 시작"",""color"":""#36a64f""}"
