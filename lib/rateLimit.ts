/** 단순 인메모리 고정 윈도우 레이트리미터.
   서버리스 환경에서는 인스턴스마다 카운트가 분리되어 전역 제한은 아니지만,
   단일 IP가 짧은 시간에 과도하게 두드리는 것을 막는 1차 방어선으로는 충분하다. */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** 추적 키가 무한정 쌓이는 것을 막기 위한 상한. 넘으면 통째로 비운다. */
const MAX_TRACKED_KEYS = 5000;

/** key가 windowMs 동안 limit회를 넘지 않았으면 true(허용), 넘었으면 false(차단). */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now(),
): boolean {
  const bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    if (buckets.size >= MAX_TRACKED_KEYS) buckets.clear();
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

/** 요청 헤더에서 클라이언트 IP를 뽑는다(프록시 환경 고려, 첫 값 사용). */
export function clientIpFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return headers.get("x-real-ip") ?? "unknown";
}

/** 테스트 전용: 버킷 상태 초기화. */
export function _resetRateLimitForTest(): void {
  buckets.clear();
}
