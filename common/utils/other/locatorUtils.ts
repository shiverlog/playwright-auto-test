/**
 * Description : LocatorLoader.ts - 📌 동적으로 로케이터 파일을 로드
 * Author : Shiwoo Min
 * Date : 2024-04-08
 */
import type { POCKey } from '@common/types/platform-types';
import fs from 'fs';
import path from 'path';
import {
  ObjectLiteralExpression,
  Project,
  PropertyAssignment,
  StringLiteral,
  SyntaxKind,
} from 'ts-morph';

export class LocatorLoader {
  private static readonly project = new Project({ tsConfigFilePath: 'tsconfig.json' });

  // Locator 경로 (예: common/locators/pc/authLocator.ts)
  private static getLocatorFilePath(poc: POCKey, section: string): string {
    return path.resolve(__dirname, '../../common/locators', poc, `${section}.ts`);
  }

  /**
   * 특정 POC + 섹션 파일에서 로케이터 객체 전체 로드
   */
  public static load(poc: POCKey, section: string): Record<string, any> {
    const filePath = this.getLocatorFilePath(poc, section);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Locator file not found: ${filePath}`);
    }

    const sourceFile = this.project.addSourceFileAtPath(filePath);
    const exportVar = sourceFile.getVariableDeclarations()[0];
    const initializer = exportVar?.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);

    const result: Record<string, any> = {};
    initializer?.getProperties().forEach(prop => {
      if (!PropertyAssignment.isPropertyAssignment(prop)) return;

      const key = prop.getName().replace(/['"]/g, '');
      const val = prop.getInitializer();

      if (!val) return;

      if (val.getKind() === SyntaxKind.ObjectLiteralExpression) {
        result[key] = this.convertObjectLiteral(val as ObjectLiteralExpression);
      } else if (val.getKind() === SyntaxKind.StringLiteral) {
        result[key] = (val as StringLiteral).getLiteralValue();
      } else {
        result[key] = val.getText(); // fallback
      }
    });

    return result;
  }

  /**
   * 특정 키의 로케이터만 반환
   */
  public static get(poc: POCKey, section: string, key: string): string | null {
    try {
      const locators = this.load(poc, section);
      return locators[key] ?? null;
    } catch {
      return null;
    }
  }

  /**
   * 중첩 객체를 JS 객체로 변환
   */
  private static convertObjectLiteral(obj: ObjectLiteralExpression): Record<string, any> {
    const result: Record<string, any> = {};

    obj.getProperties().forEach(p => {
      if (!PropertyAssignment.isPropertyAssignment(p)) return;

      const key = p.getName().replace(/['"]/g, '');
      const val = p.getInitializer();

      if (!val) return;

      switch (val.getKind()) {
        case SyntaxKind.StringLiteral:
          result[key] = (val as StringLiteral).getLiteralValue();
          break;
        case SyntaxKind.ObjectLiteralExpression:
          result[key] = this.convertObjectLiteral(val as ObjectLiteralExpression);
          break;
        default:
          result[key] = val.getText();
      }
    });

    return result;
  }
}
