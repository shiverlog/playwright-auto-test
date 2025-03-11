import { exec } from 'child_process';

// POC 키 값 (각 환경별 식별자)
export type POCType = 'pc' | 'mw' | 'aos' | 'ios';

// 각 POC에 대한 실행할 스크립트 및 설명 설정
const CONFIG: Record<POCType, { script: string; description: string }> = {
  pc: {
    script: 'scripts/pc.sh',
    description: 'PC POC 배치 실행',
  },
  mw: {
    script: 'scripts/mw.sh',
    description: 'MW POC 배치 실행',
  },
  aos: {
    script: 'scripts/aos.sh',
    description: 'AOS POC 배치 실행',
  },
  ios: {
    script: 'scripts/ios.sh',
    description: 'iOS POC 배치 실행',
  },
};

// 실행할 POC 환경을 CLI 인자로 받음
const pocType = process.argv[2] as POCType;

if (!pocType || !CONFIG[pocType]) {
  console.error('❌ 잘못된 POCType 입니다. 사용 가능한 값: pc | mw | aos | ios');
  process.exit(1);
}

// 실행할 스크립트 정보 가져오기
const scriptPath = CONFIG[pocType].script;
console.log(`${CONFIG[pocType].description}: ${scriptPath} 실행 중...`);

// 실행
exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`오류 발생: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`경고: ${stderr}`);
    return;
  }
  console.log(`실행 완료:\n${stdout}`);
});
