/** 본문의 `[표시어](term:id)` 마크업을 세그먼트로 분해하는 순수 파서.
   렌더는 components/glossary/RichText.tsx가 이 결과로 한다. */

export type RichSegment =
  | { kind: "text"; value: string }
  | { kind: "term"; label: string; id: string };

const PATTERN = /\[([^\]]+)\]\(term:([a-z0-9-]+)\)/g;

export function parseRichText(text: string): RichSegment[] {
  const segments: RichSegment[] = [];
  let last = 0;

  // matchAll은 정규식을 내부 복제 — 공유 lastIndex를 건드리지 않음.
  for (const match of text.matchAll(PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) {
      segments.push({ kind: "text", value: text.slice(last, index) });
    }
    segments.push({ kind: "term", label: match[1], id: match[2] });
    last = index + match[0].length;
  }
  if (last < text.length) {
    segments.push({ kind: "text", value: text.slice(last) });
  }
  return segments;
}
