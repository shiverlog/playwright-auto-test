import * as fs from 'fs';

export interface SpeedTestResult {
  page: string;
  url: string;
  dcl: number;
  lcp: number;
  loadTime: number;
  testedAt: string;
}

export function saveResults(
  results: SpeedTestResult[],
  filePath: string = './output/results.json',
) {
  fs.writeFileSync(filePath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`📂 속도 측정 결과가 ${filePath} 에 저장되었습니다.`);
}
