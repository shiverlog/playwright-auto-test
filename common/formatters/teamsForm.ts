/**
 * Description : teamsForm.ts - 📌 공통 팀즈 API을 통한 메시지 형식 파일
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */

// Teams 메시지 전송 폼
export const teamsForm = (poc: string, dateTime: string, testResult?: boolean) => {
  const isResultMessage = typeof testResult === 'boolean';
  const isSuccess = testResult === true;

  const themeColor = !isResultMessage ? '0078D7' : isSuccess ? '00C851' : 'FF4444';

  const resultText = !isResultMessage
    ? '테스트자동화 실행'
    : isSuccess
      ? '테스트 성공'
      : '테스트 실패';

  return {
    '@type': 'MessageCard',
    '@context': 'http://schema.org/extensions',
    themeColor,
    summary: '테스트 자동화 결과',
    sections: [
      {
        activityTitle: `${poc} ${resultText}`,
        activitySubtitle: `시간: ${dateTime}`,
        facts: [
          { name: 'POC', value: poc },
          ...(isResultMessage ? [{ name: '결과', value: resultText }] : []),
        ],
        markdown: true,
      },
      {
        text: isResultMessage
          ? '테스트 결과에 대한 상세 정보는 로그를 참고하세요.'
          : '테스트자동화 상세 케이스의 실행 결과는 추가 정보를 참고하세요.',
      },
    ],
  };
};
