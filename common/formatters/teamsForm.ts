export const teamsForm = (poc: string, dateTime: string) => ({
  "@type": "MessageCard",
  "@context": "http://schema.org/extensions",
  "themeColor": "0078D7",
  "summary": "테스트 자동화 결과",
  "sections": [
    {
      "activityTitle": `${poc} 테스트자동화 실행`,
      "activitySubtitle": `실행 시간: ${dateTime}`,
      "facts": [
        {
          "name": "POC",
          "value": `${poc}`,
        },
      ],
      "markdown": true,
    },
    {
      "text": "✅ 테스트자동화 상세 케이스의 실행 결과는 추가 정보를 참고하세요.",
    },
  ],
});
