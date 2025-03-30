import type { Browser } from 'webdriverio';

/**
 * iOS WebView 컨텍스트 초기화 유틸
 */
export const getDefaultIOSWebviewContext = async (driver: Browser): Promise<string | null> => {
  const contexts = await driver.getContexts();
  const stringContexts = contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id));

  if (stringContexts.length === 2) {
    const webview = stringContexts[1];
    console.log(`default webview context : ${webview}`);
    return webview;
  }
  return null;
};

/**
 * 현재 컨텍스트가 WebView인지 확인
 */
export const isInWebviewContext = async (driver: Browser): Promise<boolean> => {
  const currentContext = await driver.getContext();
  return typeof currentContext === 'string' && currentContext.includes('WEBVIEW');
};

/**
 * WebView 컨텍스트로 전환 시도
 */
export const switchToWebviewContext = async (driver: Browser): Promise<boolean> => {
  const contexts = await driver.getContexts();
  const stringContexts = contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id));
  const webview = stringContexts.find(ctx => ctx.includes('WEBVIEW'));

  if (webview) {
    await driver.switchContext(webview);
    console.log(`[Context] Switched to: ${webview}`);
    return true;
  }

  console.warn('[Context] No WEBVIEW context found.');
  return false;
};

/**
 * Native 컨텍스트로 전환
 */
export const switchToNativeContext = async (driver: Browser): Promise<void> => {
  const contexts = await driver.getContexts();
  const stringContexts = contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id));
  const native = stringContexts.find(ctx => ctx.includes('NATIVE_APP'));

  if (native) {
    await driver.switchContext(native);
    console.log(`[Context] Switched to: ${native}`);
  } else {
    console.warn('[Context] No NATIVE_APP context found.');
  }
};
