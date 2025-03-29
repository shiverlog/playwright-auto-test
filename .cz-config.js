module.exports = {
  types: [
    { value: 'feat', name: 'feat: 새로운 기능 추가' },
    { value: 'fix', name: 'fix: 버그 수정' },
    { value: 'docs', name: 'docs: 문서 수정' },
    { value: 'style', name: 'style: 코드 포맷팅' },
    { value: 'refactor', name: 'refactor: 코드 리팩토링' },
    { value: 'test', name: 'test: 테스트 추가 및 수정' },
    { value: 'chore', name: 'chore: 기타 설정, 빌드 작업 등' },
  ],
  scopes: [
    { name: 'pc-web' },
    { name: 'mobile-web' },
    { name: 'android' },
    { name: 'ios' },
    { name: 'api' },
    { name: 'speedtest' },
  ],
  allowCustomScopes: true, // 커스텀 스코프 입력도 허용
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['body', 'footer'],

  // 커밋 메시지 포맷 커스터마이징 (선택적으로 적용 가능)
  subjectLimit: 100,
  subject: '변경 내용을 간결히 작성해주세요:',
  messages: {
    type: '변경 유형을 선택하세요:',
    scope: '변경 범위(스코프)를 선택하거나 입력하세요 (옵션):',
    customScope: '스코프를 직접 입력하세요:',
    subject: '변경 내용을 간결히 설명하세요:\n',
    breaking: 'BREAKING CHANGES (선택):',
    footer: '관련 이슈 링크 (옵션):',
    confirmCommit: '이 커밋 메시지로 진행할까요?',
  },
};
