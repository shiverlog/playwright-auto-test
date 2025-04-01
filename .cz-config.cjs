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
    { name: 'setting/common' },
  ],
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['body', 'footer'],
  subjectLimit: 100,

  messages: {
    type: '변경유형 선택:',
    scope: '변경 범위 선택:',
    subject: '변경 메시지 작성:',
    breaking: 'BREAKING CHANGES (선택):',
    footer: '관련 이슈 링크 (옵션):',
    confirmCommit: '이 커밋 메시지로 진행할까요?',
  },
};
