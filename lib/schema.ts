import { z } from "zod";

/* ── 콘텐츠 ───────────────────────────────────────────── */

export const levelSchema = z.object({
  id: z.string(),
  order: z.number().int(),
  title: z.string(),
  description: z.string(),
  unitIds: z.array(z.string()),
});

export const unitSchema = z.object({
  id: z.string(),
  levelId: z.string(),
  order: z.number().int(),
  title: z.string(),
  lessonIds: z.array(z.string()),
});

/* 문제 — type으로 구분되는 판별 유니온 */
export const oxQuestionSchema = z.object({
  type: z.literal("ox"),
  prompt: z.string(),
  answer: z.boolean(),
  explanation: z.string(),
});

export const choiceQuestionSchema = z.object({
  type: z.literal("choice"),
  prompt: z.string(),
  options: z.array(z.string()).min(2),
  answerIndex: z.number().int().nonnegative(),
  explanation: z.string(),
});

export const fillQuestionSchema = z.object({
  type: z.literal("fill"),
  prompt: z.string(),
  answer: z.array(z.string()).min(1), // 정답 후보 배열
  explanation: z.string(),
});

export const questionSchema = z.discriminatedUnion("type", [
  oxQuestionSchema,
  choiceQuestionSchema,
  fillQuestionSchema,
]);

export const lessonSchema = z.object({
  id: z.string(),
  unitId: z.string(),
  order: z.number().int(),
  title: z.string(),
  durationMin: z.number(),
  intro: z.string(), // 마크다운, 한 입 설명
  questions: z.array(questionSchema).min(1),
  glossary: z.array(z.string()), // 이 레슨에서 등장하는 용어 id
});

/* ── 용어 ─────────────────────────────────────────────── */

export const glossaryTermSchema = z.object({
  id: z.string(),
  term: z.string(),
  short: z.string(),
  full: z.string().optional(),
});

/* ── 사용자 진도 (localStorage) ───────────────────────── */

export const streakSchema = z.object({
  count: z.number().int().nonnegative(),
  lastDate: z.string(), // YYYY-MM-DD ("" = 아직 활동 없음)
});

/* 복습 항목(간격 반복). id = "lessonId:index" 형식으로 문제를 가리킨다. */
export const reviewItemSchema = z.object({
  id: z.string(), // "lessonId:index"
  due: z.string(), // 다음 복습 예정일 YYYY-MM-DD ("" = 지금 바로)
  box: z.number().int().nonnegative(), // 라이트너 박스 단계
});

export const progressSchema = z.object({
  completedLessonIds: z.array(z.string()),
  currentLessonId: z.string().nullable(),
  xp: z.number().int().nonnegative(),
  streak: streakSchema,
  hearts: z.number().int(),
  reviewItems: z.array(reviewItemSchema), // 복습 대기열(간격 반복)
  activeDays: z.array(z.string()), // 학습 활동한 날들(YYYY-MM-DD) — 잔디용
  bestStreak: z.number().int().nonnegative(), // 역대 최고 연속일 — 배지용(단조)
});

/* ── 타입 ─────────────────────────────────────────────── */

export type Level = z.infer<typeof levelSchema>;
export type Unit = z.infer<typeof unitSchema>;
export type OxQuestion = z.infer<typeof oxQuestionSchema>;
export type ChoiceQuestion = z.infer<typeof choiceQuestionSchema>;
export type FillQuestion = z.infer<typeof fillQuestionSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type GlossaryTerm = z.infer<typeof glossaryTermSchema>;
export type Streak = z.infer<typeof streakSchema>;
export type ReviewItem = z.infer<typeof reviewItemSchema>;
export type Progress = z.infer<typeof progressSchema>;
