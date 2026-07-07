import { Fragment } from "react";
import { GlossaryTermChip } from "@/components/glossary/GlossaryTermChip";
import { MyNumberChip } from "@/components/glossary/MyNumberChip";
import { getTerm } from "@/content/glossary";
import { parseRichText } from "@/lib/richtext";

/** 본문 마크업을 렌더한다: `[표시어](term:id)`는 용어 칩, `[예시값](my:id)`은 내 숫자 칩,
   나머지는 일반 텍스트. 인라인 전용 — 줄바꿈/문단 처리는 호출하는 쪽에서 한다. */
export function RichText({ text }: { text: string }) {
  const segments = parseRichText(text);
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.kind === "text") {
          return <Fragment key={i}>{seg.value}</Fragment>;
        }
        if (seg.kind === "my") {
          return <MyNumberChip key={i} id={seg.id} fallback={seg.fallback} />;
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
