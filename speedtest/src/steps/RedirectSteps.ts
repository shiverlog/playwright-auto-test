import { RedirectPage } from '../pages/RedirectPage';

export class RedirectSteps {
  private redirectPage: RedirectPage;

  constructor(redirectPage: RedirectPage) {
    this.redirectPage = redirectPage;
  }

  // URL 목록을 순차적으로 테스트하고 리디렉션을 확인하는 스텝
  async performRedirect(urls: string[]): Promise<void> {
    for (const url of urls) {
      await this.redirectPage.navigateTo(url);
      const redirectedUrl = await this.redirectPage.getRedirectedUrl();
      console.log(`리디렉션된 URL: ${redirectedUrl}`);
    }
  }

  // 리디렉션 후 특정 요소가 나타날 때까지 기다림
  async waitForRedirectElement(selector: string) {
    await this.redirectPage.waitForElement(selector);
  }
}
