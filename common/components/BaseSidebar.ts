import { BaseActionUtils } from '@common/actions/BaseActionUtils.js';

export class BaseSidebar extends BaseActionUtils {
  /**
   * 전체보기 기능: 클릭 → URI 확인 → 필요 시 뒤로가기
   */
  public async clickFullViewAndVerify(
    clickSelector: string,
    verifySelector: string,
    expectedUri: string,
    backIfUriDiffers: boolean = true,
  ): Promise<void> {
    await this.scrollTo(clickSelector);
    await this.click(clickSelector);

    const actualUri = await this.page
      .locator(verifySelector)
      .evaluate((el: HTMLElement) => el.baseURI);

    if (!actualUri.includes(expectedUri)) {
      console.debug(`URI 불일치: 기대값 ${expectedUri}, 실제값 ${actualUri}`);
      throw new Error(`전체보기 동작 실패 - URI 불일치`);
    }

    const currentUrl = this.page.url();
    if (backIfUriDiffers && !currentUrl.includes(expectedUri)) {
      await this.page.goBack();
      await this.scrollToY(10);
    }
  }
}
