/**
 * Description : POCEnv.ts - 📌 Playwright 테스트 실행 시 POC 관련 환경변수 유틸 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-11
 */
import {
  ALL_POCS,
  getAllPOCValues,
  isValidPOCValue,
  POCValueToKey,
} from '@common/types/platform-types';
import type { POCType, ValidPOCValue } from '@common/types/platform-types';

/**
 * Logger 타입이 "ALL" | POCKey 라면,
 * 여기서 강제로 string literal 타입 배열로 리턴하는 방식으로 맞춰줄 수 있음
 */
export class POCEnv {
  /**
   * 현재 설정된 환경변수 POC 값 반환 (원시 문자열)
   */
  public static getRawValue(): string {
    return process.env.POC || '';
  }

  /**
   * 유효한 POCValue 반환 (검증된 경우만)
   */
  public static getSafeValue(): ValidPOCValue | null {
    const value = this.getRawValue();
    return isValidPOCValue(value) ? value : null;
  }

  /**
   * 현재 설정된 POC 타입 반환
   */
  public static getType(): POCType | null {
    const value = this.getSafeValue();
    return value ? POCValueToKey[value] : null;
  }

  /**
   * 실행 대상 POCKey 리스트
   * - 단일 실행이면 해당 POC만
   * - 전체 실행이면 ALL_POCS (as const literal array)
   */
  public static getPOCList(): ('PC' | 'MW' | 'AOS' | 'IOS' | 'API')[] {
    const value = this.getSafeValue();
    return value ? [POCValueToKey[value]] : [...ALL_POCS];
  }

  /**
   * 전체 실행 여부 확인
   */
  public static isAll(): boolean {
    return this.getSafeValue() === null;
  }

  /**
   * 현재 POC가 특정 대상인지 확인
   */
  public static isPOC(target: string): boolean {
    return this.getPOCList().includes(target as any);
  }

  /**
   * 현재 설정값 디버깅 출력
   */
  public static printPOCInfo(): void {
    const raw = this.getRawValue();
    const type = this.getType() || 'ALL';
    const list = this.getPOCList().join(', ');
    console.log(`[POCEnv] POC 설정값: "${raw}" | 타입: ${type} | 실행 대상: [${list}]`);
  }

  /**
   * 전체 유효한 POC 값 리스트 반환
   */
  public static getAllPOCValues(): ValidPOCValue[] {
    return getAllPOCValues();
  }
}
