import axios from 'axios';
import { Decimal } from 'decimal.js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { google } from 'googleapis';
import * as path from 'path';
import readline from 'readline';

dotenv.config();

const SCOPES = process.env.GOOGLE_SHEET_SCOPES?.split(',') || [];
const SPEEDTEST_SEND_KEY_PATH = process.env.SPEEDTEST_SEND_KEY_PATH;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// credentials.json 경로에서 인증 정보 읽기
const CREDENTIALS = SPEEDTEST_SEND_KEY_PATH
  ? JSON.parse(fs.readFileSync(SPEEDTEST_SEND_KEY_PATH, 'utf8'))
  : null;

if (!CREDENTIALS) {
  console.error('환경 변수 "SPEEDTEST_SEND_KEY_PATH" 또는 인증 파일이 올바르지 않습니다.');
  process.exit(1);
}

const settings: Record<string, any> = {
  MW: {
    ID: 'A4:A33',
    시간: 'B4:B33',
    측정값: 'G4:K33',
  },
  APP: {
    ID: 'A35:A64',
    시간: 'B35:B64',
    측정값: 'G35:P64',
  },
  MW_div: 'A',
  APP_div: 'M',
};

async function getGoogleSheetData(sheetName: string, range: string) {
  const auth = new google.auth.GoogleAuth({
    credentials: CREDENTIALS,
    scopes: SCOPES,
  });
  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!${range}`,
  });
  return response.data.values || [];
}

async function getUserInput(promptMessage: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => {
    rl.question(promptMessage, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const today = new Date();
  const sheetName = `${today.getMonth() + 1}/${today.getDate()}`;
  console.log(`전송할 데이터가 포함된 시트명: ${sheetName}`);

  // 사용자 입력 받기
  let input = await getUserInput('APP 또는 MW를 입력하세요: ');

  if (!['APP', 'MW'].includes(input)) {
    console.log('APP/MW 둘 중 하나만 입력하세요.');
    return;
  }

  let data: any = { code: [], value: [], tested_at: [] };
  let formatData: any[] = [];

  for (const [key, keyCell] of Object.entries(settings[input] as Record<string, string>)) {
    const val = await getGoogleSheetData(sheetName, keyCell);
    const flattenedVal = val.flat();
    if (key === 'ID') data.code = flattenedVal;
    else if (key === '시간') data.tested_at = flattenedVal;
    else if (key === '측정값') data.value = val;
  }

  for (let idx = 0; idx < data.code.length; idx++) {
    let avg = new Decimal(0);
    for (let val of data.value[idx]) {
      avg = avg.add(new Decimal(parseFloat(val)));
    }
    avg = avg.dividedBy(data.value[idx].length).toDecimalPlaces(2, Decimal.ROUND_DOWN);

    const [year, time] = data.tested_at[idx].split(' ');
    const [y, m, d] = year.split('-').map(Number);
    const formattedDate = `${y.toString().padStart(4, '0')}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
    const testedAt = `${formattedDate} ${time}`;

    formatData.push({ code: data.code[idx], value: avg, tested_at: testedAt });
  }

  console.log(formatData);

  const outputPath = path.join(process.cwd(), 'test/output/결과.json');
  fs.writeFileSync(outputPath, JSON.stringify(formatData, null, 4), 'utf8');

  console.log('전송을 원할 시, 1을 눌러주세요 (미전송 종료: 0, 파라미터 수기 입력: 2)');

  let userInput = await getUserInput('전송 여부를 입력하세요: ');

  const url = process.env.DIVISION_PUBSUB_URL;
  const date = today.toISOString().slice(0, 10).replace(/-/g, '');
  const div = input === 'APP' ? settings.APP_div : settings.MW_div;

  if (userInput === '1') {
    await sendData(url, date, div, formatData);
  } else {
    console.log('전송하지 않겠습니다.');
  }
}

async function sendData(url: string, date: string, div: string, jsonData: any) {
  try {
    const response = await axios.post(url, jsonData, { params: { date, div } });
    console.log(response.status === 200 ? '전송 완료' : '전송 실패', response.data);
  } catch (error) {
    console.error('전송 오류:', error);
  }
}

main().catch(console.error);
