/**
 * Description : AppPermissionsUtils.ts - 📌 앱 초기 권한 요청 자동화를 위한 Base / Android / iOS 클래스 분리
 * Author : Shiwoo Min
 * Date : 2024-04-04
 */
import { Logger } from '@common/logger/customLogger';
import type { POCKey } from '@common/types/platform-types';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

/**
 * 공통 BasePermissionsUtils - 플랫폼별 공통 로깅 처리
 */
export abstract class BasePermissionsUtils {
  protected logger: winston.Logger;

  constructor(
    protected driver: Browser,
    protected poc?: POCKey,
  ) {
    this.logger = Logger.getLogger(poc || 'ALL') as winston.Logger;
  }
}
