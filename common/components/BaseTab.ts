import { BaseActionUtils } from '@common/actions/BaseActionUtils.js';

export class BaseTab extends BaseActionUtils {
  /**
   * 탭 메뉴 클릭 및 콘텐츠 확인
   */
  public async checkTabs(
    tabSelector: string,
    contentSelector: string,
    tabContentListSelector: string,
  ): Promise<void> {
    const tabElements = await this.findElements(tabSelector);

    for (const tab of tabElements) {
      await tab.scrollIntoViewIfNeeded();
      await tab.click();

      const tabName = await tab.innerText();
      const contentSibling = await this.page
        .locator(contentSelector)
        .evaluateHandle(el => el.previousElementSibling?.textContent ?? '');
      const tabContentText = await contentSibling.jsonValue();

      if (!tabContentText.includes(tabName)) {
        console.debug(`탭(${tabName}) 변경 정상 동작 실패`);
      }

      const tabItems = await this.findElements(tabContentListSelector);
      for (const item of tabItems) {
        const children = await item.locator(':scope > *').all();
        const text2 = await children[2]?.innerText();
        const text3 = await children[3]?.innerText();
        const hasImg = (await children[1]?.innerHTML())?.includes('img');

        if (!text2 || !text3 || !hasImg) {
          console.debug(`탭(${tabName}) 콘텐츠 정상 출력 실패`);
        }
      }
    }

    // 마지막에 추천탭(첫 번째 탭) 클릭
    await tabElements[0].click();
  }
}
