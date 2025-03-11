export const slackForm = (poc: string) => ({
  serverTitle: [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${poc} 테스트자동화 실행`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '실행 시간 : {}월 {}일 {}시 {}분',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `POC : \`${poc} (Selenium)\``,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '✅ 테스트자동화 상세 케이스의 실행 결과는 쓰레드를 참고 해 주세요.',
      },
    },
  ],
  serverResult: [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${poc} 테스트자동화 {}`,
      },
    },
  ],
});
