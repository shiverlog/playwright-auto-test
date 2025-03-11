// 현재 날짜 가져오기 (형식: YYYY-MM-DD_HH-MM-SS)
const getCurrentTimestamp = (): string => {
  const now = new Date();
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
};

// YYYY-MM-DD 형식의 날짜 반환
const getFormattedDate = (): string => {
  const now = new Date();
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

// HH:MM:SS 형식의 시간 반환
const getFormattedTime = (): string => {
  const now = new Date();
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

// 설정값 내보내기
export { getCurrentTimestamp, getFormattedDate, getFormattedTime };
