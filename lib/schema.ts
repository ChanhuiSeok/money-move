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

/* ── 모의고사 ─────────────────────────────────────────────
   학습 레슨과 별개의 "시험지". 문제는 재사용(questionSchema)하되, 콘텐츠 규칙(4지선다·단답형만,
   보기 4개)은 content.test.ts에서 검증한다. 섹션 = 학습 테마(levelId)별 묶음. */

export const examSectionSchema = z.object({
  levelId: z.string(), // 어느 학습 테마(레벨)의 문제 묶음인지
  questions: z.array(questionSchema).min(1),
});

export const examSchema = z.object({
  id: z.string(),
  order: z.number().int(), // 회차(1,2,3…)
  title: z.string(), // "제1회 모의고사"
  subtitle: z.string(), // 한 줄 소개
  sections: z.array(examSectionSchema).min(1),
});

/* 모의고사 결과(localStorage) — examId → 최고 성적. */
export const examResultSchema = z.object({
  correct: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  takenAt: z.string(), // 마지막 응시일 YYYY-MM-DD
});
export const examResultsSchema = z.record(z.string(), examResultSchema);

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

export const progressSchema = z.object({
  completedLessonIds: z.array(z.string()),
  currentLessonId: z.string().nullable(),
  xp: z.number().int().nonnegative(),
  streak: streakSchema,
  hearts: z.number().int(),
  activeDays: z.array(z.string()), // 학습 활동한 날들(YYYY-MM-DD) — 잔디용
  bestStreak: z.number().int().nonnegative(), // 역대 최고 연속일 — 배지용(단조)
});

/* ── 내 프로필 (localStorage) ─────────────────────────────
   "내 숫자"의 단일 소스. 한 번 넣어두면 홈·계산기가 전부 내 얘기로 바뀐다.
   진도와는 다른 관심사라 별도 키로 저장한다. amount === 0 = 아직 미설정. */

export const profileSchema = z.object({
  period: z.enum(["month", "year"]), // amount가 월급인지 연봉인지
  amount: z.number().nonnegative(), // 세전 급여 (0 = 미설정)
  monthlyNontax: z.number().nonnegative(), // 비과세(월) — 보통 식대 20만
  dependents: z.number().int().min(1), // 부양가족 수(본인 포함)
  children: z.number().int().nonnegative(), // 만 8~20세 자녀 수
  widgetType: z.enum(["salary", "dday"]).optional().default("salary"),
  salaryDay: z.number().int().min(1).max(31).optional().default(25),
});

/* ── 타입 ─────────────────────────────────────────────── */

export type Profile = z.infer<typeof profileSchema>;
export type Level = z.infer<typeof levelSchema>;
export type Unit = z.infer<typeof unitSchema>;
export type OxQuestion = z.infer<typeof oxQuestionSchema>;
export type ChoiceQuestion = z.infer<typeof choiceQuestionSchema>;
export type FillQuestion = z.infer<typeof fillQuestionSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type ExamSection = z.infer<typeof examSectionSchema>;
export type Exam = z.infer<typeof examSchema>;
export type ExamResult = z.infer<typeof examResultSchema>;
export type GlossaryTerm = z.infer<typeof glossaryTermSchema>;
export type Streak = z.infer<typeof streakSchema>;
export type Progress = z.infer<typeof progressSchema>;
