import axios from 'axios';
import * as fs from 'fs';

import { SpeedTestResult } from './saveLogs';

export async function sendResults(apiUrl: string, filePath: string = './output/results.json') {
  if (!fs.existsSync(filePath)) {
    console.error('🚨 결과 파일이 존재하지 않습니다.');
    return;
  }

  const results: SpeedTestResult[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  try {
    const response = await axios.post(apiUrl, results, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 200) {
      console.log('✅ 속도 측정 결과가 서버에 성공적으로 전송되었습니다.');
    } else {
      console.error('❌ 서버 응답 오류:', response.status, response.data);
    }
  } catch (error) {
    console.error('❌ 서버 전송 중 오류 발생:', error);
  }
}
