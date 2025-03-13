import { logger } from '@common/logger/customLogger';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Teams Webhook URL (환경 변수에서 가져옴)
const TEAMS_WEBHOOK_URL = process.env.TEAMS_WEBHOOK_URL || '';

/**
 * Microsoft Teams에 메시지를 전송하는 함수
 * @param message - 전송할 메시지
 * @param isSuccess - 성공 여부 (true: 성공, false: 실패)
 */
export const sendTeamsMessage = async (message: string, isSuccess: boolean = true) => {
  if (!TEAMS_WEBHOOK_URL) {
    logger.warn('Microsoft Teams Webhook URL이 설정되지 않았습니다.');
    return;
  }

  try {
    const formattedMessage = isSuccess ? `✅ *성공:* ${message}` : `❌ *실패:* ${message}`;

    const payload = {
      '@type': 'MessageCard',
      '@context': 'http://schema.org/extensions',
      themeColor: isSuccess ? '0078D7' : 'FF0000',
      summary: '자동화 테스트 알림',
      sections: [
        {
          activityTitle: 'Playwright 테스트 결과',
          activitySubtitle: new Date().toISOString(),
          text: formattedMessage,
        },
      ],
    };

    await axios.post(TEAMS_WEBHOOK_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    logger.info(`Teams 메시지 전송 완료: ${message}`);
  } catch (error) {
    logger.error('Teams 메시지 전송 실패:', error);
  }
};
