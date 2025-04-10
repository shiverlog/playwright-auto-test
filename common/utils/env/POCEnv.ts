/**
 * Description : pocUtils.ts - 📌 Playwright 테스트 실행 시 POC 관련 환경변수 유틸 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-10
 */
import { ALL_POCS, POC } from '@common/types/platform-types';
import type { POCKey, POCType, POCValue } from '@common/types/platform-types';

export class POCEnv {
  /**
   * 활성화된 POC 타입값 (환경변수 POC)
   */
  public static getValue(): POCValue {
    return (process.env.POC || 'ALL') as POCValue;
  }

  /**
   * 현재 활성화된 POC 타입 (POC key) 반환
   */
  public static getType(): POCType {
    const value = this.getValue();
    const entry = Object.entries(POC).find(([, val]) => val === value);
    return (entry?.[0] || 'ALL') as POCType;
  }

  /**
   * 'ALL'일 경우 전체 POC 목록을 반환, 단일 실행 시 단일 배열로 반환
   */
  public static getList(): POCKey[] {
    const active = this.getValue();
    return active === '' ? ALL_POCS : [active as POCKey];
  }

  /**
   * 현재 POC 설정이 전체(All)인지 여부
   */
  public static isAll(): boolean {
    return this.getValue() === '';
  }
}
