import * as fs from 'fs';
import * as path from 'path';
import { ObjectLiteralExpression, Project, PropertyAssignment, SyntaxKind } from 'ts-morph';
import * as XLSX from 'xlsx';

const LOCATOR_DIR = path.resolve(__dirname, 'locators');

const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
});

const files = fs.readdirSync(LOCATOR_DIR).filter(file => file.endsWith('.ts'));

const workbook = XLSX.utils.book_new();

for (const file of files) {
  const filePath = path.join(LOCATOR_DIR, file);
  const sourceFile = project.addSourceFileAtPath(filePath);
  const exportConst = sourceFile.getVariableDeclarationOrThrow(file.replace('.ts', ''));

  const initializer = exportConst.getInitializer() as ObjectLiteralExpression;
  const rows: any[][] = [['Locator Key', 'pc', 'mw', 'aos', 'ios', 'app']];

  initializer.getProperties().forEach(prop => {
    if (!PropertyAssignment.isPropertyAssignment(prop)) return;

    const key = prop.getName().replace(/['"]/g, '');
    const init = prop.getInitializer();

    const row: any[] = [key, '', '', '', '', ''];

    if (init && init.getKind() === SyntaxKind.ObjectLiteralExpression) {
      const innerObject = init as ObjectLiteralExpression;

      innerObject.getProperties().forEach(innerProp => {
        if (!PropertyAssignment.isPropertyAssignment(innerProp)) return;

        const name = innerProp.getName().replace(/['"]/g, '');
        const val = innerProp.getInitializer()?.getText().replace(/['"]/g, '');

        const index = ['pc', 'mw', 'aos', 'ios', 'app'].indexOf(name);
        if (index !== -1) row[index + 1] = val;
      });
    } else if (init) {
      // 단순 값
      const rawValue = init.getText().replace(/['"]/g, '');
      row[1] = rawValue;
    }

    rows.push(row);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, file.replace('.ts', ''));
}

XLSX.writeFile(workbook, path.join(__dirname, 'locator-map.xlsx'));
console.log('locator-map.xlsx 생성 완료');
