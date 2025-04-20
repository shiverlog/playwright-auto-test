/**
 * Description : SheetToPubsub.ts - 📌 측정 결과를 Google Sheets에 업데이트하는 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-18
 */
import { Logger } from '@common/logger/customLogger.js';
import { POCEnv } from '@common/utils/env/POCEnv.js';
import axios from 'axios';
import { Decimal } from 'decimal.js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { google } from 'googleapis';
import * as path from 'path';
import readline from 'readline';
import type winston from 'winston';

dotenv.config();

export class SheetToPubsub {
  private scopes: string[] = process.env.GOOGLE_SHEET_SCOPES?.split(',') || [];
  private credentials: any;
  private spreadsheetId: string;
  private settings: Record<string, any> = {
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

  constructor() {
    const keyPath = process.env.SPEEDTEST_SEND_KEY_PATH;
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!keyPath || !spreadsheetId) {
      console.error('환경 변수 SPEEDTEST_SEND_KEY_PATH 또는 SPREADSHEET_ID 누락');
      process.exit(1);
    }
    this.credentials = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    this.spreadsheetId = spreadsheetId;
  }

  private async getSheetData(sheetName: string, range: string) {
    const auth = new google.auth.GoogleAuth({
      credentials: this.credentials,
      scopes: this.scopes,
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!${range}`,
    });
    return response.data.values || [];
  }

  private async getUserInput(promptMessage: string): Promise<string> {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve =>
      rl.question(promptMessage, answer => {
        rl.close();
        resolve(answer);
      }),
    );
  }

  private async sendData(url: string, date: string, div: string, jsonData: any) {
    try {
      const response = await axios.post(url, jsonData, { params: { date, div } });
      console.log(response.status === 200 ? '전송 완료' : '전송 실패', response.data);
    } catch (error) {
      console.error('전송 오류:', error);
    }
  }

  public async run() {
    const today = new Date();
    const sheetName = `${today.getMonth() + 1}/${today.getDate()}`;
    console.log(`전송할 데이터가 포함된 시트명: ${sheetName}`);

    let input = await this.getUserInput('APP 또는 MW를 입력하세요: ');
    if (!['APP', 'MW'].includes(input)) {
      console.log('APP/MW 둘 중 하나만 입력하세요.');
      return;
    }

    let data: any = { code: [], value: [], tested_at: [] };
    let formatData: any[] = [];

    for (const [key, keyCell] of Object.entries(this.settings[input] as Record<string, string>)) {
      const val = await this.getSheetData(sheetName, keyCell);
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

    let userInput = await this.getUserInput('전송 여부를 입력하세요: ');
    const url = process.env.DIVISION_PUBSUB_URL;
    const date = today.toISOString().slice(0, 10).replace(/-/g, '');
    const div = input === 'APP' ? this.settings.APP_div : this.settings.MW_div;

    if (userInput === '1') {
      await this.sendData(url!, date, div, formatData);
    } else {
      console.log('전송하지 않겠습니다.');
    }
  }
}

// 실행 예시
// const processor = new SheetDataProcessor();
// processor.run().catch(console.error);
