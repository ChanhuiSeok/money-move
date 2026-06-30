import { allLessons } from "@/content/lessons";
import { glossaryTerms } from "@/content/glossary";
import { scenarios } from "@/content/scenarios";
import { tools } from "@/content/tools";

/** 전역 검색 (순수). 레슨·도구·용어·상황을 가로질러 부분 일치로 찾는다.
   백엔드 없이 클라이언트에서 콘텐츠 객체를 그대로 훑는다. */

export type SearchKind = "lesson" | "tool" | "term" | "scenario";

export type SearchHit = {
  kind: SearchKind;
  title: string;
  sub: string;
  href: string;
};

/** 본문의 `[표시어](term:id)` 마크업을 표시어만 남기고 벗긴다. */
function stripTerms(s: string): string {
  return s.replace(/\[([^\]]+)\]\(term:[^)]+\)/g, "$1");
}

/** 비교용 정규화: 소문자 + 공백 제거(한글은 공백만 영향). */
function norm(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "");
}

/** 질의어로 모든 콘텐츠를 검색해 결과를 모은다(레슨 → 도구 → 용어 → 상황 순). */
export function search(query: string): SearchHit[] {
  const q = norm(query);
  if (q.length === 0) return [];
  const hits: SearchHit[] = [];

  for (const lesson of allLessons) {
    const intro = stripTerms(lesson.intro);
    if (norm(lesson.title + intro).includes(q)) {
      hits.push({
        kind: "lesson",
        title: lesson.title,
        sub: intro.split("\n")[0],
        href: `/learn/${lesson.id}`,
      });
    }
  }

  for (const tool of tools) {
    const hay = tool.title + tool.desc + (tool.keywords?.join("") ?? "");
    if (norm(hay).includes(q)) {
      hits.push({ kind: "tool", title: tool.title, sub: tool.desc, href: tool.href });
    }
  }

  for (const term of glossaryTerms) {
    if (norm(term.term + term.short).includes(q)) {
      hits.push({ kind: "term", title: term.term, sub: term.short, href: "/glossary" });
    }
  }

  for (const s of scenarios) {
    if (norm(s.title + s.blurb + s.intro).includes(q)) {
      hits.push({
        kind: "scenario",
        title: s.title,
        sub: s.blurb,
        href: `/start/${s.id}`,
      });
    }
  }

  return hits;
}
