/**
 * 개발 및 테스트용 디버그 도구(+100 XP 테스트, 경험치 리셋 버튼 등)의 노출 여부를 결정합니다.
 *
 * - 로컬 개발 환경(`process.env.NODE_ENV === "development"`)
 * - 또는 명시적 공개 환경 변수 `NEXT_PUBLIC_SHOW_TEST_TOOLS === "true"` 인 경우 true 반환
 */
export function isDevToolsEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_SHOW_TEST_TOOLS === "true"
  );
}
