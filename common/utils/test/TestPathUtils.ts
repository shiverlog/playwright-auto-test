/**
 * Description : TestPathUtils.ts - 📌 테스트 경로 및 파일 위치를 관리하는 유틸리티
 * Author : Shiwoo Min
 * Date : 2024-04-07
 */
import { TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants';
import { getCurrentTimestamp } from '@common/formatters/formatters';
import type { POCKey, POCType } from '@common/types/platform-types';
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
    const safeName = testName
      // 특수 문자 제거 (공백, #, @ 등 모두 제거)
      .replace(/[^\w\-]/g, '')
      // 공백을 _로 변경
      .replace(/\s+/g, '_')
      // 소문자로 변환
      .toLowerCase();

    const timestamp = getCurrentTimestamp();
    return path.join(
      basePath,
      `${poc}_${safeName}_${testId}_w${workerIndex}_${timestamp}.${extension}`,
    );
  }

  /**
   * 유니크한 테스트 결과 경로 반환
   */
  public static generateTestResultPaths(
    // 'ALL'은 제외된 유효 POC만 허용
    poc: POCKey,
    testName: string,
    testId: string,
    workerIndex: number,
  ): Record<string, string> {
    const resultPaths = TEST_RESULT_FILE_NAME(poc);
    const extensionMap = {
      playwrightReport: 'html',
      log: 'json',
      allureResult: 'json',
      screenshots: 'png',
      videos: 'mp4',
      traces: 'zip',
      coverage: 'json',
    } as const;

    const customPaths: Record<string, string> = {};

    (Object.keys(resultPaths) as Array<keyof typeof extensionMap>).forEach(key => {
      const ext = extensionMap[key];
      const paths = resultPaths[key];

      const targetDir = Array.isArray(paths) ? path.dirname(paths[0]) : path.dirname(paths);

      customPaths[key] = this.generateUniqueFileName(
        targetDir,
        poc,
        testName,
        testId,
        workerIndex,
        ext,
      );
    });

    return customPaths as Record<keyof typeof extensionMap, string>;
  }
}
