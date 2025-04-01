import { BaseActionUtils } from '@common/actions/BaseActionUtils.js';

export class BaseContent extends BaseActionUtils {
  /**
   * 콘텐츠 정상 출력 확인
   */
  public async verifyContentList(
    selector: string,
    expectedCount: number,
    label: string,
    isXpath: boolean = false,
  ): Promise<void> {
    const contentLocator = isXpath
      ? this.page.locator(`xpath=${selector}`)
      : this.page.locator(selector);
    const elements = await contentLocator.all();

    if (elements.length === 0) {
      throw new Error(`${label}: 콘텐츠 요소가 존재하지 않습니다.`);
    }

    await elements[0].scrollIntoViewIfNeeded();

    if (elements.length !== expectedCount) {
      console.debug(
        `${label}: 콘텐츠 개수 기대값(${expectedCount})과 불일치. 실제: ${elements.length}`,
      );
      throw new Error(`${label}: 콘텐츠 개수 불일치`);
    }

    console.debug(`${label}: 콘텐츠 ${expectedCount}개 정상 출력 확인`);
  }
}
