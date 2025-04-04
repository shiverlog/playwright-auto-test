import type { POCKey, POCType } from '@common/types/platform-types.js';
import { ALL_POCS } from '@common/types/platform-types.js';
import { execSync } from 'child_process';
import type winston from 'winston';

(async () => {
  for (const poc of ALL_POCS) {
    console.log(`\n [${poc.toUpperCase()}] 테스트 실행 시작\n`);
    try {
      execSync(`cross-env POC=${poc} npx playwright test`, {
        stdio: 'inherit',
      });
    } catch (e) {
      console.error(`[${poc}] 테스트 실패`);
      process.exitCode = 1;
    }
  }
})();
