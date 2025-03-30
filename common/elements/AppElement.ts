import type { Browser, Element } from 'webdriverio';

export class AppElement {
  constructor(
    private element: Element,
    private driver: Browser,
  ) {}

  async reClick(delay: number = 300): Promise<void> {
    await this.element.click();
    await this.driver.pause(delay);
    await this.element.click();
  }

  async waitAndClick(timeout: number = 5000): Promise<void> {
    await this.element.waitForDisplayed({ timeout });
    await this.element.click();
  }

  getRaw(): Element {
    return this.element;
  }
}
