import { teamsConfig } from '@common/config/config';
import { ALL_POCS, POCType } from '@common/constants/PathConstants';
import { teamsForm } from '@common/formatters/teamsForm';
import { Logger } from '@common/logger/customLogger';
import axios from 'axios';

/**
 * Microsoft Teams에 메시지를 전송하는 함수 (단일 POC용)
 * @param poc - POC 타입 (예: 'pc-web', 'mobile-web', 'ios' 등)
 * @param message - 전송할 메시지 내용
 * @param isSuccess - 성공 여부 (true: 성공, false: 실패)
 */
export const sendTeamsMessage = async (
  poc: POCType,
  message: string,
  isSuccess: boolean = true,
) => {
  const logger = Logger.getLogger(poc);

  if (!teamsConfig.TEAMS_WEBHOOK_URL) {
    logger.warn('⚠ Microsoft Teams Webhook URL이 설정되지 않았습니다.');
    return;
  }

  try {
    const now = new Date().toISOString();
    const payload = teamsForm(poc, now, isSuccess);

    // 사용자 정의 메시지를 추가 텍스트 섹션으로 포함
    payload.sections?.push({
      text: isSuccess ? `✅ 성공: ${message}` : `❌ 실패: ${message}`,
    });

    await axios.post(teamsConfig.TEAMS_WEBHOOK_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    logger.info(`Teams 메시지 전송 완료: ${message}`);
  } catch (error) {
    logger.error('Teams 메시지 전송 실패:', error);
  }
};

/**
 * Microsoft Teams에 전체 POC 대상 메시지 전송
 * @param message - 전송할 공통 메시지
 * @param isSuccess - 성공 여부 (true: 성공, false: 실패)
 */
export const sendTeamsMessageForAllPOCs = async (message: string, isSuccess: boolean = true) => {
  for (const poc of ALL_POCS) {
    await sendTeamsMessage(poc, message, isSuccess);
  }
};
