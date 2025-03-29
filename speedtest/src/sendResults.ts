import axios from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

import { SpeedTestResult } from './saveLogs';

dotenv.config();

export async function sendResults(
  apiUrl: string = process.env.API_URL || '',
  filePath: string = process.env.RESULTS_FILE_PATH || './output/test_results.json',
) {
  // 파일 경로가 존재하는지 확인
  try {
    await fs.promises.access(filePath, fs.constants.F_OK); // 파일이 존재하는지 확인
  } catch (error) {
    console.error('결과 파일이 존재하지 않습니다.');
    return;
  }

  const results: SpeedTestResult[] = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));

  try {
    // API로 POST 요청 보내기
    const response = await axios.post(apiUrl, results, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 200) {
      console.log('속도 측정 결과가 서버에 성공적으로 전송되었습니다.');
    } else {
      console.error('서버 응답 오류:', response.status, response.data);
    }
  } catch (error) {
    console.error('서버 전송 중 오류 발생:', error);
  }
}
