/**
 * Description : errorHandler.ts - 📌 공통 로그 초기화 핸들러
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
import { FILE_RETENTION_DAYS } from '@common/config/config';
import { logger } from '@common/logger/customLogger';
import fs from 'fs';
import path from 'path';





/**
 * 특정 폴더에서 일정 기간 지난 파일 자동 삭제
 * @param dirPath - 정리할 디렉토리
 * @param maxDays - 최대 보관 일수
 */
export function cleanupOldFiles(dirPath: string, maxDays: number) {
  const now = Date.now();
  const maxAgeMs = maxDays * 24 * 60 * 60 * 1000; // 밀리초 변환

  if (!fs.existsSync(dirPath)) {
    logger.warn(`정리할 폴더가 없음: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (now - stats.mtimeMs > maxAgeMs) {
      fs.unlinkSync(filePath);
      logger.info(`오래된 파일 삭제됨: ${filePath}`);
    }
  });
}
