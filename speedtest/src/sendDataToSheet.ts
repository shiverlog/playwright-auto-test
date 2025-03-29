import { Decimal } from 'decimal.js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { google } from 'googleapis';

dotenv.config();

// 환경 변수에서 필요한 값들을 로드
const SCOPES = process.env.GOOGLE_SHEET_SCOPES?.split(',') || [];
const SPEEDTEST_SEND_KEY = process.env.SPEEDTEST_SEND_KEY;
const SPREADSHEET_URL = process.env.SPREADSHEET_URL;

// 환경 변수 값이 없으면 오류 메시지 출력 후 종료
if (!SPEEDTEST_SEND_KEY || !SPREADSHEET_URL || SCOPES.length === 0) {
  console.error(
    '환경 변수 "SPEEDTEST_SEND_KEY", "SPREADSHEET_URL" 또는 "GOOGLE_SHEET_SCOPES"이 설정되지 않았습니다.',
  );
  process.exit(1);
}

// 환경 변수에서 지정한 경로로부터 자격 증명 파일을 로드
const CREDENTIALS = JSON.parse(fs.readFileSync(SPEEDTEST_SEND_KEY, 'utf8'));

// 구글 시트 데이터를 가져오는 함수
async function getGoogleSheetData(sheetName: string, range: string) {
  const auth = new google.auth.GoogleAuth({
    credentials: CREDENTIALS,
    scopes: SCOPES,
  });
  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_URL.split('/d/')[1].split('/')[0],
    range: `${sheetName}!${range}`,
  });
  return response.data.values || [];
}

// 구글 시트 데이터를 업데이트하는 함수
async function updateGoogleSheet(sheetName: string, data: any[]) {
  const auth = new google.auth.GoogleAuth({
    credentials: CREDENTIALS,
    scopes: SCOPES,
  });
  const sheets = google.sheets({ version: 'v4', auth });

  const range = `B4:P64`; // 구글 시트의 업데이트할 범위
  const values = data.map(d => [d.code, d.value, d.tested_at]); // 업데이트할 값들을 배열로 변환

  // 구글 시트에 데이터 업데이트
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_URL.split('/d/')[1].split('/')[0],
    range: `${sheetName}!${range}`,
    valueInputOption: 'RAW',
    requestBody: { values },
  });
  console.log('Google Sheets 업데이트 완료');
}

// 메인 함수
async function main() {
  const today = new Date();
  const sheetName = `${today.getMonth() + 1}/${today.getDate()}`; // 오늘 날짜에 맞는 시트 이름 생성
  console.log(`전송할 데이터가 포함된 시트명: ${sheetName}`);

  // 결과 JSON 파일에서 데이터를 읽어옴
  let speedCheckData: any = JSON.parse(fs.readFileSync('output/test_results.json', 'utf8'));
  let formatData: any[] = [];

  // 데이터를 순회하며 측정값을 포맷팅
  for (const [carrier, carrierData] of Object.entries(speedCheckData)) {
    for (const [page, data] of Object.entries(carrierData as any)) {
      for (const measure of (data as any).측정) {
        // 각 측정값을 Decimal로 처리하고, 소수점 2자리로 반올림
        formatData.push({
          code: (data as any).page_id,
          value: new Decimal(measure.value).toDecimalPlaces(2, Decimal.ROUND_DOWN),
          tested_at: measure.date,
        });
      }
    }
  }

  console.log(formatData); // 포맷팅된 데이터 확인용

  // 구글 시트에 포맷팅된 데이터 업데이트
  await updateGoogleSheet(sheetName, formatData);
}

// 메인 함수를 실행하고, 오류가 발생하면 콘솔에 출력
main().catch(console.error);
