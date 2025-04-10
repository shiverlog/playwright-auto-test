/**
 * Description : TestPathUtils.ts - 📌 테스트 경로 및 파일 위치를 관리하는 유틸리티
 * Author : Shiwoo Min
 * Date : 2024-04-10
 */
import { TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants';
import { getCurrentTimestamp } from '@common/formatters/formatters';
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import path from 'path';
import type winston from 'winston';

export class TestPathUtils {
  private static readonly poc = POCEnv.getType();
  private static readonly logger = Logger.getLogger(this.poc) as winston.Logger;

  /**
   * 유니크한 파일 이름 생성 (테스트 ID, 이름, 워커 인덱스를 포함)
   */
  public static generateUniqueFileName(
    basePath: string,
    testName: string,
    testId: string,
    workerIndex: number,
    extension: string,
  ): string {
    const poc = POCEnv.getType();

    const safeName = testName
      .replace(/[^\w\-]/g, '')
      .replace(/\s+/g, '_')
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
    testName: string,
    testId: string,
    workerIndex: number,
  ): Record<string, string> {
    const poc = POCEnv.getType();
    const resultPaths = TEST_RESULT_FILE_NAME(poc as any);
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

      customPaths[key] = this.generateUniqueFileName(targetDir, testName, testId, workerIndex, ext);
    });

    return customPaths as Record<keyof typeof extensionMap, string>;
  }
}
