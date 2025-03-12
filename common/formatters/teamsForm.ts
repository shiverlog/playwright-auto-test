/**
 * Description : teamsForm.ts - 📌 공통 팀즈 API을 통한 메시지 형식 파일
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */

export const teamsForm = (poc: string, dateTime: string) => ({
  '@type': 'MessageCard',
  '@context': 'http://schema.org/extensions',
  themeColor: '0078D7',
  summary: '테스트 자동화 결과',
  sections: [
    {
      activityTitle: `${poc} 테스트자동화 실행`,
      activitySubtitle: `실행 시간: ${dateTime}`,
      facts: [
        {
          name: 'POC',
          value: `${poc}`,
        },
      ],
      markdown: true,
    },
    {
      text: '테스트자동화 상세 케이스의 실행 결과는 추가 정보를 참고하세요.',
    },
  ],
});
