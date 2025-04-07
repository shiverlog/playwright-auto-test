/**
 * Description : locatorToExcel.ts - 📌 각 .ts 파일을 하나의 시트(Tab)로 만들어 로케이터를 정리 (with chatGpt)
 * Author : Shiwoo Min
 * Date : 2025-04-08
 */
import { urlLocator } from '@common/locators/urlLocator';
import { Platform } from '@common/types/platform-types';
import * as fs from 'fs';
import * as path from 'path';
import { Node, ObjectLiteralExpression, Project, SyntaxKind } from 'ts-morph';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';

// ESM 환경에서 __dirname 정의
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// UIType → 플랫폼 열 매핑
const uiTypeToColumnMap: Record<string, ('pc' | 'mw' | 'and' | 'ios')[]> = {
  PC: ['pc'],
  MOBILE: ['mw'],
  APP: ['and', 'ios'],
};

// 플랫폼 열 매핑
const platformToColumnMap: Record<string, 'pc' | 'mw' | 'and' | 'ios'> = {
  PC_WEB: 'pc',
  MOBILE_WEB: 'mw',
  ANDROID_APP: 'and',
  IOS_APP: 'ios',
};

// 로케이터 폴더 경로
const LOCATOR_DIR = path.resolve(process.cwd(), 'common/locators');

// ts-morph 프로젝트 생성
const project = new Project({ tsConfigFilePath: 'tsconfig.json' });

// .ts 파일 목록 가져오기
const files = fs.readdirSync(LOCATOR_DIR).filter(file => file.endsWith('.ts'));

// 엑셀 워크북 생성
const workbook = XLSX.utils.book_new();
const outputPath = path.resolve(__dirname, 'locator-map.xlsx');

// 공통 열 헤더
const COLUMN_HEADERS = ['Locator Key', 'pc', 'mw', 'and', 'ios'];

// urlLocator는 런타임 import 객체로 처리
const urlRows: any[][] = [COLUMN_HEADERS];
for (const key of Object.keys(urlLocator) as (keyof typeof urlLocator)[]) {
  const value = urlLocator[key];
  const row: any[] = [key, '', '', '', ''];

  if (typeof value === 'object' && value !== null) {
    for (const platformKey of Object.keys(value) as Platform[]) {
      const column = platformToColumnMap[platformKey];
      if (column) {
        const idx = COLUMN_HEADERS.indexOf(column);
        if (idx !== -1) {
          row[idx] = value[platformKey];
        }
      }
    }
    urlRows.push(row);
  }
}

const urlSheet = XLSX.utils.aoa_to_sheet(urlRows);
XLSX.utils.book_append_sheet(workbook, urlSheet, 'urlLocator');

// 나머지 .ts 파일들은 ts-morph로 분석
for (const file of files) {
  if (file === 'urlLocator.ts') continue;

  const filePath = path.join(LOCATOR_DIR, file);
  const sourceFile = project.addSourceFileAtPath(filePath);

  const rows: any[][] = [COLUMN_HEADERS];

  const declarations = sourceFile.getVariableDeclarations();
  for (const declaration of declarations) {
    const exportName = declaration.getName();
    const initializer = declaration.getInitializer();

    const objectLiteral = initializer?.getFirstDescendantByKind(SyntaxKind.ObjectLiteralExpression);
    if (!objectLiteral) {
      console.warn(`${exportName}: ObjectLiteralExpression 없음`);
      continue;
    }

    objectLiteral.getProperties().forEach((prop: Node) => {
      if (!Node.isPropertyAssignment(prop)) return;

      const key = prop.getName().replace(/['"]/g, '');
      const init = prop.getInitializer();
      const row: any[] = [key, '', '', '', ''];

      if (init?.getKind() === SyntaxKind.ObjectLiteralExpression) {
        const innerObject = init as ObjectLiteralExpression;

        innerObject.getProperties().forEach(innerProp => {
          if (!Node.isPropertyAssignment(innerProp)) return;

          const name = innerProp.getName().replace(/['"]/g, '');
          const rawInit = innerProp.getInitializer();
          const val = rawInit?.getText().replace(/^['"`]|['"`]$/g, '') ?? '';

          const uiMapped = uiTypeToColumnMap[name];
          if (uiMapped) {
            for (const target of uiMapped) {
              const idx = COLUMN_HEADERS.indexOf(target);
              if (idx !== -1) row[idx] = val;
            }
          }

          const platformMapped = platformToColumnMap[name];
          if (platformMapped) {
            const idx = COLUMN_HEADERS.indexOf(platformMapped);
            if (idx !== -1) row[idx] = val;
          }
        });
      } else if (init) {
        const val = init.getText().replace(/^['"`]|['"`]$/g, '');
        const idx = COLUMN_HEADERS.indexOf('pc');
        row[idx] = val;
      }

      rows.push(row);
    });
  }

  const sheetName = path.basename(file, '.ts').slice(0, 31);
  const sheet = XLSX.utils.aoa_to_sheet(rows);

  XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
}

// Excel 파일 저장
XLSX.writeFile(workbook, outputPath);
// 생성 명령어: npx tsx ./common/utils/other/locatorToExcel.ts
console.log(`locator-map.xlsx 생성 완료: ${outputPath}`);
