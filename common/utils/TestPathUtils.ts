import { TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants';
import type { POCType } from '@common/constants/PathConstants';
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
   * 테스트 실행 중 유니크한 테스트 결과 경로 반환
   * (PathConstants의 TEST_RESULT_FILE_NAME을 기반으로 하되, 유니크화)
   */
  public static generateTestResultPaths(
    base: string,
    poc: POCType,
    testName: string,
    testId: string,
    workerIndex: number,
  ): Record<string, string> {
    // 반환 타입을 좀 더 일반화
    const resultPaths = TEST_RESULT_FILE_NAME(base, poc);
    const extensionMap: Record<string, string> = {
      playwrightReport: 'html',
      log: 'json',
      allureResult: 'json',
      screenshots: 'png',
      videos: 'mp4',
      traces: 'zip',
      coverage: 'json',
    };

    const customPaths: Record<string, string> = {};

    // resultPaths 객체의 키들에 대해 반복
    for (const key in resultPaths) {
      if (resultPaths.hasOwnProperty(key)) {
        // key를 keyof typeof resultPaths로 명확하게 지정
        const ext = extensionMap[key as keyof typeof resultPaths]; // 확장자 가져오기
        const dir = path.dirname(resultPaths[key as keyof typeof resultPaths]); // 디렉토리 부분 추출
        customPaths[key] = this.generateUniqueFileName(
          dir,
          poc,
          testName,
          testId,
          workerIndex,
          ext,
        );
      }
    }
    return customPaths;
  }
}
