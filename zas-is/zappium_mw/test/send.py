from datetime import datetime, timedelta
import json
from operator import itemgetter
import os
import re
from oauth2client.service_account import ServiceAccountCredentials
import gspread
import pandas as pd
from gspread.utils import ValueRenderOption
import itertools
import math
from decimal import Decimal, ROUND_DOWN

import requests

# TODO 속도측정 스프레드시트 데이터 범위
settings={
    "MW":{
        "ID":"A4:A33",
        "시간":"B4:B33",
        "측정값":"G4:K33",
    },
    "APP":{
        "ID":"A35:A64",
        "시간":"B35:B64",
        "측정값":"G35:P64",
    },
    # 자동: A / 수동: M
    "MW_div":"A",
    "APP_div":"M"
}

scope = ['https://spreadsheets.google.com/feeds',
'https://www.googleapis.com/auth/drive']
json_key_path = os.getenv('SPEEDCHECK_SEND_KEY')

credential = ServiceAccountCredentials.from_json_keyfile_name(json_key_path, scope)
gc = gspread.authorize(credential)
spreadsheet_url = "https://docs.google.com/spreadsheets/d/1yW0hZ6XMphRpjkUrNbG-sUrF5AQ-LfvX4JQ8-mbs9Eg"
doc = gc.open_by_url(spreadsheet_url)

# 금일 날짜 스프레드 시트 가져오기
today = datetime.now()
print(f"전송할 데이터가 포함된 시트명: {today.month}/{today.day}")
worksheet = doc.worksheet(f"{today.month}/{today.day}")

# APP or MW 데이터 선택
print("APP/MW 둘 중 하나만 입력하세요:") 
while True:
    입력값1 = input()
    if "APP" in 입력값1 or "MW" in 입력값1:
        break
    else:
        print("APP/MW 둘 중 하나만 입력하세요:")
     
data = {"code":[],"value":[],"tested_at":[]}
format_data = []
for key,key_cell in settings[입력값1].items():
    val = worksheet.get(key_cell)
    if "측정값" != key:
        val = list(itertools.chain(*val))
    if key == "ID":
        data["code"] = val
    elif key == "시간":
        data["tested_at"] = val
    elif key == "측정값":
        data["value"] = val

for idx in range(len(data["code"])):
    avg=0.0
    for val in data["value"][idx]:
        avg += float(val)
   

    # 1. float 형 데이터들 모두 더 함 -> float 형은 뒤에 0을 생략함(ex. 5.80(x) 5.8(o))
        # TODO :  Decimal 타입을 사용하여 값을 정확하게 표현하고 소수점 두자릿수로 고정함 ex(5.7999~ -> 5.80) 
        # TODO : 여기서 문제는 표현 시, 근사치사용으로 인한(너무 정밀한 계산) 문제이므로 단순하게 round로 반올림
    # 2. 더한 값을 5로 나눔 -> 부동소수점 발생 지점(ex. 5.8을 5로 나누는 것을 계산 할 때, 부동소수점 표현 5.7999~에서 계산함)
        # TODO :  1번에서 0.00 포맷으로 만든 상태에서 나눗셈을 하면 다시 부동소수점 발생(=근사치 표현 발생)
        # TODO : 나눈 후, 평균값을 Decimal 타입으로 정밀 표현(quantize 함수 사용을 위한 형변환)
    # 3. 해당 평균 값 0.00 이하로 모두 버림 
    
    # print(f"avg: {Decimal(avg)}")
    avg =round(Decimal(avg),2)
    print(f"sum: {avg}")
    avg = Decimal(avg/len(data["value"][idx]))
    print(f"avg: {avg}")
    avg= avg.quantize(Decimal('0.01'), rounding=ROUND_DOWN)
    # 
    # 날짜 전송 포맷으로 수정
    year,hour = data["tested_at"][idx].split(' ')
    y,m,d =map(int,year.split('-'))
    year = '{0:04d}-{1:02d}-{2:02d}'.format(y,m,d)
    tested_at = f'{year} {hour}' 
    format_data.append({"code":data["code"][idx],"value":avg,"tested_at":tested_at})

#  FIXME 정렬 필요 시, 사용
# format_data = sorted(format_data,key=itemgetter('code','tested_at'))
# format_data = sorted(format_data,key= lambda x:x["code"][])
# nn=format_data[0]["code"].rfind('_') 
# format_data = sorted(format_data,key = lambda x:(x["code"][nn-1],x["code"][nn+1:-1])) 
print(format_data)
    
# # 속도측정 결과 저장
path = os.getcwd()
for i in range(2):
    if os.path.split(path)[1] == 'appium_mw':
        break
    path,folder = os.path.split(path)
os.chdir(path)
print(os.getcwd())

res_path='test/output/결과.json'
with open(res_path,'w',encoding='utf-8') as f:
    json.dump(format_data,f,ensure_ascii=False,indent=4,default=str)
    f.close()

json_data={}
with open(res_path,encoding='utf-8') as f:
    json_data=json.load(f)
    print(json_data)
    f.close()

# 가져온 데이터 중 일부만 확인(메인페이지)
print("일부 데이터가 정확한지 확인해주세요 \n")
for idx in range(3):
    for key, value in format_data[idx].items():
        print(f"{key} : {value}")
        print(f"{type(key)} : {type(value)}")
    print("\n")

print("전송을 원할 시, 1을 눌러주세요(미전송 종료: 0, 파라미터 수기 입력:2)")
url = "https://dcms.uhdcsre.com/dcms/qa"
date = today.strftime('%Y%m%d')
div = ''
if 입력값1 == 'APP':
    div = settings["APP_div"]
elif 입력값1 == 'MW':
    div = settings["MW_div"]
else:
    raise Exception(f"POC를 알 수 없음 : {입력값1}")
def send(url,date,div,json_d):
    print(f"{url}")
    print(f"{date}")
    print(f"{div}")
    print(f"{json_d}")
    
    try:
        res = requests.post(url,json=json_d,params={"date":date,"div":div}) # 500 error
        print(res)
        if res.status_code == 200:
            print("전송 완료")
        else:
            print("전송 실패")
            print(res)
            print(res.json())
            print(res.url)
    except Exception as e:
        print(e)

while True:
    입력값2 = input()
    if 0 == int(입력값2):
        break
    elif 1 == int(입력값2):
       send(url=url,date=date,div=div,json_d=json_data)
       break
    elif 2 == int(입력값2):
        print("date 입력(ex. 20241204):")
        date = input()
        print("div 입력(자동: A / 수동: M):")
        div = input()
        send(url=url,date=date,div=div,json_d=json_data)
        break
    else:
        print("전송을 원할 시, 1을 눌러주세요(미전송 종료 시, 0)")
    
    
        
    