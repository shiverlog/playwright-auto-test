/**
 * Description : contextUtils.ts - 📌 네트워크 유틸
 * Author : Shiwoo Min
 * Date : 2024-04-04
 */
import { Logger } from '@common/logger/customLogger';
import type { POCKey } from '@common/types/platform-types';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

/**
 * iOS WebView 컨텍스트 초기화 유틸
 * 2개의 context(NATIVE_APP, WEBVIEW)가 존재하는 경우, WEBVIEW context를 선택하여 반환
 */
export const getDefaultIOSWebviewContext = async (
  driver: Browser,
  poc?: POCKey,
): Promise<string | null> => {
  const logger = Logger.getLogger(poc || 'PC') as winston.Logger;
  const contexts = await driver.getContexts();
  const stringContexts = contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id));

  if (stringContexts.length === 2) {
    const webview = stringContexts[1];
    logger.info(`default webview context : ${webview}`);
    return webview;
  }

  logger.warn('WEBVIEW 컨텍스트를 찾을 수 없습니다.');
  return null;
};

/**
 * 컨텍스트에 WEBVIEW가 포함되어 있는지 여부를 체크
 */
export const isInWebviewContext = async (driver: Browser, poc?: POCKey): Promise<boolean> => {
  const logger = Logger.getLogger(poc || 'PC') as winston.Logger;
  const currentContext = await driver.getContext();
  const isWebview = typeof currentContext === 'string' && currentContext.includes('WEBVIEW');
  logger.info(`현재 컨텍스트: ${currentContext} (WEBVIEW 여부: ${isWebview})`);
  return isWebview;
};

/**
 * 현재 연결된 모든 컨텍스트에서 WEBVIEW를 찾아 전환
 */
export const switchToWebviewContext = async (driver: Browser, poc?: POCKey): Promise<boolean> => {
  const logger = Logger.getLogger(poc || 'PC') as winston.Logger;
  const contexts = await driver.getContexts();
  const stringContexts = contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id));
  const webview = stringContexts.find(ctx => ctx.includes('WEBVIEW'));

  if (webview) {
    await driver.switchContext(webview);
    logger.info(`[Context] Switched to WEBVIEW: ${webview}`);
    return true;
  }

  logger.warn('[Context] WEBVIEW 컨텍스트가 존재하지 않습니다.');
  return false;
};

/**
 * 컨텍스트 목록에서 NATIVE_APP을 찾아 전환
 */
export const switchToNativeContext = async (driver: Browser, poc?: POCKey): Promise<void> => {
  const logger = Logger.getLogger(poc || 'PC') as winston.Logger;
  const contexts = await driver.getContexts();
  const stringContexts = contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id));
  const native = stringContexts.find(ctx => ctx.includes('NATIVE_APP'));

  if (native) {
    await driver.switchContext(native);
    logger.info(`[Context] Switched to NATIVE_APP: ${native}`);
  } else {
    logger.warn('[Context] NATIVE_APP 컨텍스트가 존재하지 않습니다.');
  }
};
