/** 본문 마크업을 세그먼트로 분해하는 순수 파서. 두 종류를 인식한다:
   - `[표시어](term:id)` — 용어 풀이 칩
   - `[예시값](my:id)` — "내 숫자" 치환(프로필 있으면 내 값, 없으면 예시값 fallback)
   렌더는 components/glossary/RichText.tsx가 이 결과로 한다. */

export type RichSegment =
  | { kind: "text"; value: string }
  | { kind: "term"; label: string; id: string }
  | { kind: "my"; fallback: string; id: string };

const PATTERN = /\[([^\]]+)\]\((term|my):([a-z0-9-]+)\)/g;

export function parseRichText(text: string): RichSegment[] {
  const segments: RichSegment[] = [];
  let last = 0;

  // matchAll은 정규식을 내부 복제 — 공유 lastIndex를 건드리지 않음.
  for (const match of text.matchAll(PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) {
      segments.push({ kind: "text", value: text.slice(last, index) });
    }
    segments.push(
      match[2] === "my"
        ? { kind: "my", fallback: match[1], id: match[3] }
        : { kind: "term", label: match[1], id: match[3] },
    );
    last = index + match[0].length;
  }
  if (last < text.length) {
    segments.push({ kind: "text", value: text.slice(last) });
  }
  return segments;
}

/** 마크업을 표시어만 남긴 평문으로 바꾼다(내 숫자는 예시값 fallback으로).
   선택지처럼 툴팁(인터랙티브)을 넣을 수 없는 자리에서 안전하게 쓴다. */
export function richTextToPlain(text: string): string {
  return parseRichText(text)
    .map((s) => {
      if (s.kind === "text") return s.value;
      return s.kind === "term" ? s.label : s.fallback;
    })
    .join("");
}
