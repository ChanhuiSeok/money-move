import { describe, expect, it } from "vitest";
import { getTerm } from "@/content/glossary";
import { allLessons } from "@/content/lessons";
import { levels, orderedLessonIds, units } from "@/content/levels";
import { parseRichText } from "@/lib/richtext";
import { lessonSchema } from "@/lib/schema";

const lessonIds = new Set(allLessons.map((l) => l.id));
const unitIds = new Set(units.map((u) => u.id));

describe("레슨 스키마", () => {
  it.each(allLessons.map((l) => [l.id, l] as const))(
    "%s 는 스키마를 통과한다",
    (_id, lesson) => {
      expect(lessonSchema.safeParse(lesson).success).toBe(true);
    },
  );

  it("객관식 정답 인덱스는 보기 범위 안", () => {
    for (const lesson of allLessons) {
      for (const q of lesson.questions) {
        if (q.type === "choice") {
          expect(q.answerIndex).toBeGreaterThanOrEqual(0);
          expect(q.answerIndex).toBeLessThan(q.options.length);
        }
      }
    }
  });
});

describe("레벨/유닛/레슨 연결", () => {
  it("레벨의 unitIds는 모두 실재", () => {
    for (const level of levels) {
      for (const uid of level.unitIds) expect(unitIds.has(uid)).toBe(true);
    }
  });

  it("유닛의 lessonIds는 모두 실재 레슨", () => {
    for (const unit of units) {
      for (const lid of unit.lessonIds) expect(lessonIds.has(lid)).toBe(true);
    }
  });

  it("각 레슨의 unitId는 실재 유닛", () => {
    for (const lesson of allLessons) {
      expect(unitIds.has(lesson.unitId)).toBe(true);
    }
  });

  it("학습 순서는 모든 레슨을 정확히 한 번씩 덮는다", () => {
    expect([...orderedLessonIds].sort()).toEqual([...lessonIds].sort());
    expect(orderedLessonIds.length).toBe(allLessons.length);
  });
});

describe("본문 용어 참조", () => {
  it("intro·prompt·explanation의 모든 term:id 가 사전에 있다", () => {
    const missing: string[] = [];
    const scan = (text: string, where: string) => {
      for (const seg of parseRichText(text)) {
        if (seg.kind === "term" && !getTerm(seg.id)) {
          missing.push(`${where}: ${seg.id}`);
        }
      }
    };
    for (const lesson of allLessons) {
      scan(lesson.intro, `${lesson.id}.intro`);
      lesson.questions.forEach((q, i) => {
        scan(q.prompt, `${lesson.id}.q${i}.prompt`);
        scan(q.explanation, `${lesson.id}.q${i}.explanation`);
      });
    }
    expect(missing).toEqual([]);
  });

  it("레슨 glossary 목록의 용어도 모두 실재", () => {
    for (const lesson of allLessons) {
      for (const id of lesson.glossary) {
        expect(getTerm(id), `${lesson.id} → ${id}`).toBeDefined();
      }
    }
  });
});
