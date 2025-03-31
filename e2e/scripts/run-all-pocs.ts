import { ALL_POCS } from '@common/constants/PathConstants';
import { execSync } from 'child_process';

(async () => {
  for (const poc of ALL_POCS) {
    console.log(`\n🟣 [${poc.toUpperCase()}] 테스트 실행 시작\n`);
    try {
      execSync(`cross-env POC=${poc} npx playwright test`, {
        stdio: 'inherit',
      });
    } catch (e) {
      console.error(`❌ [${poc}] 테스트 실패`);
      process.exitCode = 1; // CI에서도 실패로 간주되도록
    }
  }
})();
