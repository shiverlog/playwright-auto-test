/**
 * Description : formatters.ts - 📌 공통 형식 파일
 * Author : Shiwoo Min
 * Date : 2025-03-10
 */

// 현재 날짜 가져오기 (형식: YYYY-MM-DD_HH-MM-SS)
export const getCurrentTimestamp = (): string => {
  const now = new Date();
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
};

// YYYY-MM-DD 형식의 날짜 반환
export const getFormattedDate = (): string => {
  const now = new Date();
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

// HH:MM:SS 형식의 시간 반환
export const getFormattedTime = (): string => {
  const now = new Date();
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

// 천 단위 콤마 포맷
export const formatNumberWithCommas = (num: number): string => {
  return num.toLocaleString();
};

// 콤마(,) 제거 후 숫자(number)로 반환
export const parseNumberFromCommas = (formatted: string): number => {
  return Number(formatted.replace(/,/g, ''));
};

// 소수점 → 퍼센트로 변환
export const formatPercent = (num: number, decimals = 0): string => {
  return `${(num * 100).toFixed(decimals)}%`;
};
