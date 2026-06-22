// 클래스명 조합 헬퍼. 거짓값은 무시한다.
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
