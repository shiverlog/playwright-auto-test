/**
 * Description : LocatorLoader.ts - 📌 동적으로 로케이터 파일을 로드
 * Author : Shiwoo Min
 * Date : 2024-04-08
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import fs from 'fs';
import path from 'path';
import {
  ObjectLiteralExpression,
  Project,
  PropertyAssignment,
  StringLiteral,
  SyntaxKind,
} from 'ts-morph';
import type winston from 'winston';

export class LocatorLoader {
  private static readonly poc = POCEnv.getType();
  private static readonly logger = Logger.getLogger(this.poc) as winston.Logger;
  private static readonly project = new Project({ tsConfigFilePath: 'tsconfig.json' });

  // Locator 경로 (예: common/locators/pc/authLocator.ts)
  private static getLocatorFilePath(section: string): string {
    return path.resolve(__dirname, '../../common/locators', this.poc, `${section}.ts`);
  }

  /**
   * 특정 POC + 섹션 파일에서 로케이터 객체 전체 로드
   */
  public static load(section: string): Record<string, any> {
    const filePath = this.getLocatorFilePath(section);

    if (!fs.existsSync(filePath)) {
      this.logger.error(`Locator 파일이 존재하지 않습니다: ${filePath}`);
      throw new Error(`Locator file not found: ${filePath}`);
    }

    try {
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

      this.logger.debug(`[LocatorLoader][${this.poc}] 섹션 '${section}' 로드 완료`);
      return result;
    } catch (err) {
      this.logger.error(`[LocatorLoader][${this.poc}] 섹션 '${section}' 로드 중 오류 발생:`, err);
      throw err;
    }
  }

  /**
   * 특정 키의 로케이터만 반환
   */
  public static get(section: string, key: string): string | null {
    try {
      const locators = this.load(section);
      const value = locators[key] ?? null;

      if (value) {
        this.logger.debug(`[LocatorLoader][${this.poc}] ${section}.${key} → '${value}'`);
      } else {
        this.logger.warn(`[LocatorLoader][${this.poc}] ${section}.${key} 값 없음`);
      }

      return value;
    } catch (err) {
      this.logger.error(`[LocatorLoader][${this.poc}] ${section}.${key} 불러오기 실패`);
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
