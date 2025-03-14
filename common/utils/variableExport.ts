import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

import { LOCATOR_PATH, POCType } from '../config/CommonConfig';
import { logger } from '../logger/customLogger';

class Variable {
  private poc: POCType;

  constructor(poc: POCType) {
    this.poc = poc;
  }

  // `LOCATOR_PATH(poc)`를 사용하여 POC별 경로 설정
  private getPageNames(): string[] {
    const locatorPath = LOCATOR_PATH(this.poc);

    try {
      return fs
        .readdirSync(locatorPath) // 해당 경로의 파일 목록 가져오기
        .filter(file => file.endsWith('.json')) // JSON 파일만 필터링
        .map(file => path.basename(file, '.json')); // 확장자 제거 후 파일명만 가져오기
    } catch (error) {
      logger.error(`Error reading locator path (${locatorPath}):`, error);
      return [];
    }
  }

  exportExcelVariables(): void {
    const workbook = XLSX.utils.book_new();
    const worksheetData: any[][] = [
      ['Page Key(페이지명)', 'Element Key(요소명)', 'Variable(요소값)'],
    ];

    const locatorPath = LOCATOR_PATH(this.poc);
    const pageNames = this.getPageNames();

    let count = 1;
    for (const page of pageNames) {
      const filePath = path.join(locatorPath, `${page}.json`);

      if (fs.existsSync(filePath)) {
        const elements = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        for (const key in elements) {
          worksheetData.push([page, key, elements[key]]);
          count++;
        }
      }
    }

    // 시트 생성
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Variables');

    // 파일 저장
    const filePath = path.join(process.cwd(), 'variables.xlsx');
    XLSX.writeFile(workbook, filePath);
    logger.info(`Excel file saved to: ${filePath}`);
  }

  setVariables(): Record<string, Record<string, string>> {
    const filePath = path.join(process.cwd(), 'variables.xlsx');

    if (!fs.existsSync(filePath)) {
      throw new Error('Excel file not found.');
    }

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets['Variables'];

    if (!sheet) {
      throw new Error("Sheet 'Variables' not found in Excel file.");
    }

    const data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const allValues: Record<string, Record<string, string>> = {};

    data.slice(1).forEach(row => {
      const [pageName, key, value] = row;
      if (!pageName || !key || !value) {
        logger.warn('Some data is missing:', row);
        return;
      }

      if (!allValues[pageName]) {
        allValues[pageName] = {};
      }

      allValues[pageName][key] = value;
    });

    return allValues;
  }
}

// 실행 코드 - 동적으로 POC 값 설정
if (require.main === module) {
  let pocType: POCType | undefined;

  // 환경 변수에서 POC 값을 가져오기
  if (process.env.POC) {
    pocType = process.env.POC as POCType;
  }

  // 명령줄 인자로 POC 값이 전달되었는지 확인
  const args = process.argv.slice(2); // 첫 두 개는 Node.js 실행 경로이므로 제외
  if (args.length > 0) {
    pocType = args[0] as POCType;
  }
  logger.info(`POC 타입: ${pocType}`);
}
