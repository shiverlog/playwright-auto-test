/**
 * Description : LocatorUtils.ts - 📌 로케이터유틸
 * Author : Shiwoo Min
 * Date : 2024-04-04
 */
import { FOLDER_PATHS } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import type { POCKey, POCType } from '@common/types/platform-types';
import { ALL_POCS } from '@common/types/platform-types';
import path from 'path';
import { NumericLiteral, ObjectLiteralExpression, Project, PropertyAssignment, StringLiteral, SyntaxKind } from 'ts-morph';
import type winston from 'winston';





export class LocatorUtils {
  // 해당 로케이터는 공통함수 부분이므로 타입 경고를 무시하고 사용
  private static BASE_LOCATOR_DIR = (FOLDER_PATHS as any)('common').locators;
  private static project = new Project({ tsConfigFilePath: 'tsconfig.json' });

  /**
   * 로케이터 파일 로드 (common/locators + section 단위, TypeScript 기반)
   */
  static loadLocators(poc: POCKey, section: string): Record<string, any> {
    const logger = Logger.getLogger(poc) as winston.Logger;
    const filePath = path.join(this.BASE_LOCATOR_DIR, poc, `${section}.ts`);

    try {
      const sourceFile = this.project.addSourceFileAtPathIfExists(filePath);
      if (!sourceFile) {
        throw new Error(`Locator file not found: ${filePath}`);
      }

      const exportConst = sourceFile.getVariableDeclarations()[0];
      const initializer = exportConst?.getInitializerIfKindOrThrow(
        SyntaxKind.ObjectLiteralExpression,
      );
      const locators: Record<string, any> = {};

      initializer?.getProperties().forEach(prop => {
        if (PropertyAssignment.isPropertyAssignment(prop)) {
          const key = prop.getName().replace(/['"]/g, '');
          const valueNode = prop.getInitializer();
          if (!valueNode) return;

          switch (valueNode.getKind()) {
            case SyntaxKind.StringLiteral:
              locators[key] = (valueNode as StringLiteral).getLiteralValue();
              break;
            case SyntaxKind.NumericLiteral:
              locators[key] = Number((valueNode as NumericLiteral).getLiteralValue());
              break;
            case SyntaxKind.TrueKeyword:
              locators[key] = true;
              break;
            case SyntaxKind.FalseKeyword:
              locators[key] = false;
              break;
            case SyntaxKind.ObjectLiteralExpression:
              locators[key] = LocatorUtils.convertObjectLiteral(
                valueNode as ObjectLiteralExpression,
              );
              break;
            default:
              locators[key] = valueNode.getText();
          }
        }
      });

      logger.info(`[Locator] ${filePath} 로드 완료`);
      return locators;
    } catch (error: any) {
      logger.error(`[Locator] ${filePath} 로드 실패 - ${error.message || error}`);
      return {};
    }
  }

  /**
   * ObjectLiteralExpression → JS 객체로 변환
   */
  private static convertObjectLiteral(obj: ObjectLiteralExpression): Record<string, any> {
    const result: Record<string, any> = {};

    obj.getProperties().forEach(p => {
      if (PropertyAssignment.isPropertyAssignment(p)) {
        const key = p.getName().replace(/['"]/g, '');
        const val = p.getInitializer();

        if (!val) return;

        switch (val.getKind()) {
          case SyntaxKind.StringLiteral:
            result[key] = (val as StringLiteral).getLiteralValue();
            break;
          case SyntaxKind.NumericLiteral:
            result[key] = Number((val as NumericLiteral).getLiteralValue());
            break;
          case SyntaxKind.TrueKeyword:
            result[key] = true;
            break;
          case SyntaxKind.FalseKeyword:
            result[key] = false;
            break;
          case SyntaxKind.ObjectLiteralExpression:
            result[key] = this.convertObjectLiteral(val as ObjectLiteralExpression);
            break;
          default:
            result[key] = val.getText();
        }
      }
    });

    return result;
  }

  static getLocator(poc: POCKey, section: string, key: string): string | null {
    const locators = this.loadLocators(poc, section);
    const logger = Logger.getLogger(poc) as winston.Logger;

    if (locators && key in locators) {
      return locators[key];
    } else {
      logger.warn(`[Locator] ${section}.ts 에 '${key}' 없음`);
      return null;
    }
  }

  static preloadAllPOCLocators(section: string): Record<POCKey, Record<string, any>> {
    const result: Record<POCKey, Record<string, any>> = {} as any;

    for (const poc of ALL_POCS) {
      result[poc] = this.loadLocators(poc, section);
    }

    return result;
  }
}
