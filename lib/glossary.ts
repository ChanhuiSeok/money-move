import type { GlossaryTerm } from "@/lib/schema";

/** 용어 사전 로직 — 순수 함수.
   "내가 배운 용어"는 완료한 레슨들에 등장한 용어(glossary)의 합집합으로 도출한다.
   콘텐츠에 의존하지 않도록 필요한 데이터는 인자로 받는다(테스트 용이). */

type LessonGlossary = { id: string; glossary: string[] };

/** 완료한 레슨들에서 등장한 용어 id 집합. */
export function learnedTermIds(
  completedLessonIds: string[],
  lessons: LessonGlossary[],
): Set<string> {
  const completed = new Set(completedLessonIds);
  const ids = new Set<string>();
  for (const lesson of lessons) {
    if (!completed.has(lesson.id)) continue;
    for (const termId of lesson.glossary) ids.add(termId);
  }
  return ids;
}

/** 검색 정규화: 앞뒤 공백 제거, 내부 공백 1칸, 소문자. */
export function normalizeQuery(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** 용어/짧은 설명/상세에 검색어가 포함된 용어만. 빈 검색어면 전부 통과. */
export function filterTerms(
  terms: GlossaryTerm[],
  query: string,
): GlossaryTerm[] {
  const q = normalizeQuery(query);
  if (q === "") return terms;
  return terms.filter((t) => {
    const haystack = `${t.term} ${t.short} ${t.full ?? ""}`.toLowerCase();
    return haystack.includes(q);
  });
}
