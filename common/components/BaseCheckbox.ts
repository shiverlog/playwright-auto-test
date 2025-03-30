import { type Locator, test } from '@playwright/test';

export default class BaseCheckbox {
  private locator!: Locator;
  private description!: string;

  /**
   * locator와 설명 설정
   */
  public setLocator(locator: Locator, description: string): BaseCheckbox {
    this.locator = locator;
    this.description = description;
    return this;
  }

  /**
   * 체크박스 또는 라디오 버튼 체크
   */
  public async check() {
    await test.step(`Check ${this.description}`, async () => {
      await this.locator.check();
    });
    return this;
  }

  /**
   * 체크박스 또는 라디오 버튼 언체크
   */
  public async uncheck() {
    await test.step(`Uncheck ${this.description}`, async () => {
      await this.locator.uncheck();
    });
    return this;
  }

  /**
   * 체크 상태 확인
   */
  public async isChecked(): Promise<boolean> {
    let status: boolean;
    await test.step(`Checking status of checkbox ${this.description}`, async () => {
      await this.locator.waitFor();
      status = await this.locator.isChecked();
    });
    return status!;
  }
}
