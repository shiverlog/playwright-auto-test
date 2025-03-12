/**
 * Description : errorHandler.ts - 📌 공통 에러 처리 핸들러
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import { POCType, SCREENSHOT_PATH, TRACE_PATH, VIDEO_PATH } from '@common/constants/constants';
import { logger } from '@common/logger/customLogger';
import path from 'path';
import { Page } from 'playwright';

/**
 * 예외 처리 핸들러 - error exception case
 * @param page Playwright Page 객체
 * @param poc 실행 환경 (pc, mw, aos, ios, api)
 * @param error 발생한 에러 객체
 * @param message 추가 메시지 (기본값: "오류 발생")
 * @param logger 커스텀 로거 객체
 */
export async function errorHandler(
  page: Page,
  poc: POCType,
  error: any,
  message: string = '오류 발생',
): Promise<boolean> {
  logger.error(`${message}: ${error.message}`);
  logger.error(error.stack);

  switch (error.name) {
    case 'TimeoutError':
      logger.warn('타임아웃이 발생했습니다.');
      break;
    case 'NoSuchElementError':
      logger.warn('요소를 찾을 수 없습니다.');
      break;
    case 'ElementNotVisibleError':
      logger.warn('요소가 보이지 않습니다.');
      break;
    case 'ElementNotInteractableError':
      logger.warn('해당 요소와 상호작용할 수 없습니다.');
      break;
    case 'SelectorError':
      logger.warn('잘못된 선택자가 사용되었습니다.');
      break;
    case 'NavigationError':
      logger.warn('페이지 네비게이션 중 오류가 발생했습니다.');
      break;
    case 'AssertionError':
      logger.warn('테스트 검증에 실패하였습니다. (Assertion Error)');
      break;
    case 'PageError':
      logger.warn('페이지에서 오류가 발생했습니다.');
      break;
    default:
      logger.error(`예상치 못한 예외 발생: ${error.name}`);
      break;
  }

  // 오류 발생 시 파일 저장 (스크린샷, 비디오, 트레이스)
  await screenshotOnError(page, poc);
  await saveTestTrace(page, poc);
  await saveTestVideo(page, poc);

  return false;
}

/**
 * 오류 발생 시 스크린샷 저장
 */
async function screenshotOnError(page: Page, poc: POCType) {
  try {
    const filePath = path.join(SCREENSHOT_PATH, `${poc}_error.png`);
    await page.screenshot({ path: filePath, fullPage: true });
    logger.info(`스크린샷 저장됨: ${filePath}`);
  } catch (err) {
    logger.error('스크린샷 캡처 중 오류 발생:', err);
  }
}

/**
 * 오류 발생 시 트레이스 저장
 */
async function saveTestTrace(page: Page, poc: POCType) {
  try {
    const context = page.context();
    const filePath = path.join(TRACE_PATH, `${poc}_trace.zip`);

    await context.tracing.stop({ path: filePath });
    logger.info(`트레이스 파일 저장됨: ${filePath}`);
  } catch (err) {
    logger.error('트레이스 저장 중 오류 발생:', err);
  }
}

/**
 * 오류 발생 시 비디오 저장
 */
async function saveTestVideo(page: Page, poc: POCType) {
  try {
    const filePath = path.join(VIDEO_PATH, `${poc}_video.mp4`);
    logger.info(`비디오 파일 저장됨: ${filePath}`);
  } catch (err) {
    logger.error('비디오 저장 중 오류 발생:', err);
  }
}
