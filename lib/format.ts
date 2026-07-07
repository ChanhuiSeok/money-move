// 금액·숫자 포맷.

/** 1234567 → "1,234,567" */
export function formatNumber(n: number): string {
  return Math.round(n).toLocaleString("ko-KR");
}

/** 1234567 → "1,234,567원" */
export function formatWon(n: number): string {
  return `${formatNumber(n)}원`;
}

/** 2,712,340 → "271만원" (만원 단위 반올림). 레슨 본문에서 내 숫자를 자연스럽게 읽히게.
   1만원 미만은 그대로 원 단위로. */
export function formatManwon(n: number): string {
  const man = Math.round(n / 10000);
  if (man <= 0) return formatWon(n);
  return `${formatNumber(man)}만원`;
}

/** 입력 문자열에서 숫자만 남긴다(콤마·공백 등 제거). */
export function onlyDigits(s: string): string {
  return s.replace(/\D/g, "");
}

/** 비율(0.045) → "4.5%". 불필요한 0은 떼고, 부동소수 오차는 정리한다. */
export function formatPercent(fraction: number): string {
  const pct = Number((fraction * 100).toFixed(4));
  return `${pct}%`;
}
