import { Decimal } from 'decimal.js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { google } from 'googleapis';

dotenv.config();

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
];
const SPEEDCHECK_SEND_KEY = process.env.SPEEDCHECK_SEND_KEY;
const SPREADSHEET_URL =
  'https://docs.google.com/spreadsheets/d/1yW0hZ6XMphRpjkUrNbG-sUrF5AQ-LfvX4JQ8-mbs9Eg';
const CREDENTIALS = JSON.parse(fs.readFileSync(SPEEDCHECK_SEND_KEY!, 'utf8'));

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

async function updateGoogleSheet(sheetName: string, data: any[]) {
  const auth = new google.auth.GoogleAuth({
    credentials: CREDENTIALS,
    scopes: SCOPES,
  });
  const sheets = google.sheets({ version: 'v4', auth });

  const range = `B4:P64`; // Adjust range accordingly
  const values = data.map(d => [d.code, d.value, d.tested_at]);

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_URL.split('/d/')[1].split('/')[0],
    range: `${sheetName}!${range}`,
    valueInputOption: 'RAW',
    requestBody: { values },
  });
  console.log('Google Sheets 업데이트 완료');
}

async function main() {
  const today = new Date();
  const sheetName = `${today.getMonth() + 1}/${today.getDate()}`;
  console.log(`전송할 데이터가 포함된 시트명: ${sheetName}`);

  let speedCheckData: any = JSON.parse(fs.readFileSync('test/output/결과.json', 'utf8'));
  let formatData: any[] = [];

  for (const [carrier, carrierData] of Object.entries(speedCheckData)) {
    for (const [page, data] of Object.entries(carrierData as any)) {
      for (const measure of (data as any).측정) {
        formatData.push({
          code: (data as any).page_id,
          value: new Decimal(measure.value).toDecimalPlaces(2, Decimal.ROUND_DOWN),
          tested_at: measure.date,
        });
      }
    }
  }

  console.log(formatData);
  await updateGoogleSheet(sheetName, formatData);
}

main().catch(console.error);
