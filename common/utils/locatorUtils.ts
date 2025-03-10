import * as fs from "fs";
import * as path from "path";
import { logger } from "../logger/customLogger";

/**
 * LocatorUtils: JSON 기반 로케이터 로드 유틸리티
 */
export class LocatorUtils {
  private static LOCATOR_DIR = path.resolve(__dirname, "../locators"); // locators 폴더 경로

  /**
   * 특정 JSON 파일에서 로케이터 로드
   * @param section JSON 파일 이름 (확장자 제외)
   * @returns 로케이터 객체
   */
  static loadLocators(section: string): Record<string, any> {
    const locatorPath = path.join(this.LOCATOR_DIR, `${section}.json`);

    try {
      if (!fs.existsSync(locatorPath)) {
        throw new Error(`Locator file not found: ${locatorPath}`);
      }

      const rawData = fs.readFileSync(locatorPath, "utf-8");
      const locators = JSON.parse(rawData);

      logger.info(`로케이터 파일 로드 완료: ${section}.json`);
      return locators;
    } catch (error) {
      logger.error(`로케이터 파일 로드 실패: ${error}`);
      return {};
    }
  }

  /**
   * 특정 로케이터 값 반환
   * @param section JSON 파일 이름 (확장자 제외)
   * @param key 로케이터 키값
   * @returns 로케이터 값 (없으면 null)
   */
  static getLocator(section: string, key: string): string | null {
    const locators = this.loadLocators(section);
    if (locators && key in locators) {
      return locators[key];
    } else {
      logger.warn(`로케이터 '${key}'를 찾을 수 없음 (파일: ${section}.json)`);
      return null;
    }
  }
}

/**
 * locatorType을 Playwright 및 WebdriverIO에서 사용 가능한 selector로 변환
 */
export function getSelector(locatorType: string, value: string): string {
  const locatorTypeLower = locatorType.toLowerCase();

  const locatorMapping: Record<string, string> = {
    id: `#${value}`,
    name: `[name="${value}"]`,
    xpath: `${value}`,
    css: `${value}`,
    class: `.${value}`,
    link: `text="${value}"`,
    partial_link: `text*="${value}"`,
    tag: value,
  };

  if (!(locatorTypeLower in locatorMapping)) {
    logger.error(`❌ Unsupported locator type: ${locatorType}`);
    return "";
  }

  return locatorMapping[locatorTypeLower];
}
