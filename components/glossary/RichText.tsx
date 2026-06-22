import { Fragment } from "react";
import { GlossaryTermChip } from "@/components/glossary/GlossaryTermChip";
import { getTerm } from "@/content/glossary";
import { parseRichText } from "@/lib/richtext";

/** 본문의 `[표시어](term:id)` 패턴을 용어 칩으로, 나머지는 일반 텍스트로 렌더.
   인라인 전용 — 줄바꿈/문단 처리는 호출하는 쪽에서 한다. */
export function RichText({ text }: { text: string }) {
  const segments = parseRichText(text);
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.kind === "text") {
          return <Fragment key={i}>{seg.value}</Fragment>;
        }
        const term = getTerm(seg.id);
        // 사전에 없는 id면 표시어만 그대로 노출(깨지지 않게)
        return term ? (
          <GlossaryTermChip key={i} label={seg.label} term={term} />
        ) : (
          <Fragment key={i}>{seg.label}</Fragment>
        );
      })}
    </>
  );
}
