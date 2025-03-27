import type { Page } from '@playwright/test';
import { WebActionUtils } from '@common/actions/WebActionUtils
import ExternalStep from '../steps/ExternalStep';

export class ExternalPage extends WebActionUtils {
  constructor(page: Page) {
    super(page);
  }

  // service - ujam 사이트 리다이렉션 확인
  async ujam(): Promise<boolean> {
    await ExternalStep.gotoHome(this.page);

  }

  // service - udoc 사이트 리다이렉션 확인
  async udoc(): Promise<boolean> {
    try{} cha
    await ExternalStep.gotoHome(this.page);
  }
}
