import { POCType, TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants';
import { getCurrentTimestamp } from '@common/formatters/formatters';
import path from 'path';

export class TestPathUtils {
  /**
   * 유니크한 파일 이름 생성 (테스트 ID, 이름, 워커 인덱스를 포함)
   */
  public static generateUniqueFileName(
    basePath: string,
    poc: POCType,
    testName: string,
    testId: string,
    workerIndex: number,
    extension: string,
  ): string {
    const safeName = testName.replace(/\s+/g, '_').replace(/[^\w\-]/g, '');
    const timestamp = getCurrentTimestamp();
    return path.join(
      basePath,
      `${poc}_${safeName}_${testId}_w${workerIndex}_${timestamp}.${extension}`,
    );
  }

  /**
   * 테스트 실행 중 유니크한 테스트 결과 경로 반환
   * (PathConstants의 TEST_RESULT_FILE_NAME을 기반으로 하되, 유니크화)
   */
  public static generateTestResultPaths(
    base: string,
    poc: POCType,
    testName: string,
    testId: string,
    workerIndex: number,
  ): Record<keyof ReturnType<typeof TEST_RESULT_FILE_NAME>, string> {
    const resultPaths = TEST_RESULT_FILE_NAME(base, poc);

    const extensionMap: Record<keyof ReturnType<typeof TEST_RESULT_FILE_NAME>, string> = {
      playwrightReport: 'html',
      log: 'json',
      allureResult: 'json',
      screenshots: 'png',
      videos: 'mp4',
      traces: 'zip',
    };

    const customPaths: Partial<Record<keyof typeof resultPaths, string>> = {};
    for (const key of Object.keys(resultPaths) as Array<keyof typeof resultPaths>) {
      const ext = extensionMap[key];
      const dir = path.dirname(resultPaths[key]);
      customPaths[key] = this.generateUniqueFileName(dir, poc, testName, testId, workerIndex, ext);
    }

    return customPaths as Record<keyof ReturnType<typeof TEST_RESULT_FILE_NAME>, string>;
  }
}
