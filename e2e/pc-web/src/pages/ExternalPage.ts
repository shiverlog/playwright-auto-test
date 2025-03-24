import type { Page } from '@playwright/test';

import ExternalStep from '../steps/ExternalStep';

class ExternalPage {
  private page: Page;
  private dbg: any;

  constructor(page: Page, dbg: any) {
    this.page = page;
    this.dbg = dbg;
  }

  async ujam(): Promise<boolean> {
    await ExternalStep.gotoHome(this.page);

    try {
      await ExternalStep.moveToUjamPage(this.page);
    } catch (error) {
      this.dbg.print_dbg('유잼 페이지 정상 노출 및 기능 동작 확인', false);
      return false;
    }

    this.dbg.print_dbg('유잼 페이지 정상 노출 및 기능 동작 확인');
    return true;
  }

  async udoc(): Promise<boolean> {
    await ExternalStep.gotoHome(this.page);

    try {
      await ExternalStep.moveToUdocPage(this.page);
    } catch (error) {
      this.dbg.print_dbg('유독 페이지 정상 노출 및 기능 동작 확인', false);
      return false;
    }

    this.dbg.print_dbg('유독 페이지 정상 노출 및 기능 동작 확인');
    return true;
  }
}

export default ExternalPage;
