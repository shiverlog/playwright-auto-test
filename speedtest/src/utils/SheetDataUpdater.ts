/**
 * Description : SheetDataUpdater.ts - 📌 측정 결과를 Google Sheets에 업데이트하는 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-18
 */
import { Logger } from '@common/logger/customLogger.js';
import { POCEnv } from '@common/utils/env/POCEnv.js';
import { Decimal } from 'decimal.js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { google } from 'googleapis';
import type winston from 'winston';

// 환경 변수 로드
dotenv.config();

export class SheetDataUpdater {
  private scopes: string[];
  private spreadsheetId: string;
  private credentials: any;

  constructor() {
    // 스코프 및 환경 변수 로드
    this.scopes = process.env.GOOGLE_SHEET_SCOPES?.split(',') || [];
    const speedtestKey = process.env.SPEEDTEST_SEND_KEY;
    const spreadsheetUrl = process.env.SPREADSHEET_URL;

    // 필수 환경 변수 체크
    if (!speedtestKey || !spreadsheetUrl || this.scopes.length === 0) {
      console.error(
        '환경 변수 "SPEEDTEST_SEND_KEY", "SPREADSHEET_URL" 또는 "GOOGLE_SHEET_SCOPES"이 설정되지 않았습니다.',
      );
      process.exit(1);
    }

    // 자격 증명 및 스프레드시트 ID 설정
    this.credentials = JSON.parse(fs.readFileSync(speedtestKey, 'utf8'));
    this.spreadsheetId = spreadsheetUrl.split('/d/')[1].split('/')[0];
  }

  /**
   * Google 인증 클라이언트 생성
   */
  private async getAuthClient() {
    return new google.auth.GoogleAuth({
      credentials: this.credentials,
      scopes: this.scopes,
    });
  }

  /**
   * 지정한 시트에 데이터를 업데이트
   * @param sheetName 업데이트할 시트 이름 (예: '4/18')
   * @param data [{ code, value, tested_at }] 형태의 배열
   */
  public async updateSheet(sheetName: string, data: any[]) {
    const auth = await this.getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    // 업데이트할 셀 범위
    const range = `B4:P64`;
    const values = data.map(d => [d.code, d.value, d.tested_at]);

    await sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!${range}`,
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    console.log('Google Sheets 업데이트 완료');
  }

  /**
   * 측정 결과 JSON 파일을 읽어와 Google Sheets에 업데이트
   * @param filePath 측정 결과 JSON 파일 경로
   */
  public async run(filePath: string) {
    const today = new Date();
    const sheetName = `${today.getMonth() + 1}/${today.getDate()}`;
    console.log(`전송할 데이터가 포함된 시트명: ${sheetName}`);

    // JSON 결과 파일 로드
    const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const formatted: any[] = [];

    // 데이터 포맷팅: page_id, 측정값, 날짜 추출 및 정리
    for (const [carrier, carrierData] of Object.entries(rawData)) {
      for (const [page, data] of Object.entries(carrierData as any)) {
        for (const measure of (data as any).측정) {
          formatted.push({
            code: (data as any).page_id,
            value: new Decimal(measure.value).toDecimalPlaces(2, Decimal.ROUND_DOWN),
            tested_at: measure.date,
          });
        }
      }
    }
    // 변환된 결과 로그 출력
    console.log(formatted);
    // Google Sheets 업데이트 실행
    await this.updateSheet(sheetName, formatted);
  }
}

// 실행 예시
// const updater = new GoogleSheetUpdater();
// updater.run('output/test_results.json').catch(console.error);
