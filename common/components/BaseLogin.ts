/**
 * Description : BaseLogin.ts - 📌 로그인 인증 관련 컨포넌트
 * Author : Shiwoo Min
 * Date : 2025-04-01
 */
import { Page } from '@playwright/test';

type SelectorConfig = {
  menu: string;
  status: string;
  back: string;
};

export class BaseLogin {
  constructor(
    protected page: Page,
    private selectors: SelectorConfig,
  ) {}

  protected interpretLoginText(text: string | null | undefined): boolean | null {
    if (!text || text.trim() === '') return null;

    if (text.includes('로그아웃') || text.includes('반갑습니다') || text.includes('님'))
      return true;
    if (text.includes('로그인') || text.includes('간편조회')) return false;

    return null;
  }

  public async isLoggedIn(): Promise<boolean> {
    try {
      const { menu, status, back } = this.selectors;

      await this.page.click(menu);
      await this.page.waitForSelector(status, { state: 'visible' });

      const text = await this.page.textContent(status);
      await this.page.click(back);

      const result = this.interpretLoginText(text);
      if (result === null) throw new Error(`로그인 상태 판단 불가: ${text}`);
      return result;
    } catch (e) {
      console.error(`로그인 확인 실패: ${(e as Error).message}`);
      return false;
    }
  }
}
