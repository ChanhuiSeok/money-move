"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Home, RotateCcw, X } from "lucide-react";
import { ExamQuestionCard } from "@/components/exam/ExamQuestionCard";
import { MascotImage } from "@/components/mascot/MascotImage";
import { Button } from "@/components/ui/Button";
import { buttonVariants } from "@/components/ui/buttonStyles";
import { Card } from "@/components/ui/Card";
import { Confetti } from "@/components/ui/Confetti";
import { ProgressBar } from "@/components/lesson/ProgressBar";
import { levels } from "@/content/levels";
import { hasAnswer, type Answer } from "@/lib/grade";
import {
  gradeExam,
  sectionOffsets,
  toScore,
  totalQuestions,
  type ExamGrade,
} from "@/lib/exams";
import { todayKey } from "@/lib/progress";
import type { Exam } from "@/lib/schema";
import { useExams } from "@/store/useExams";
import { useProgress } from "@/store/useProgress";

const ROMAN = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ"];
const levelTitle = (id: string) => levels.find((l) => l.id === id)?.title ?? id;

export function ExamSheet({ exam }: { exam: Exam }) {
  const hydrate = useExams((s) => s.hydrate);
  const record = useExams((s) => s.record);
  const gainXp = useProgress((s) => s.gainXp);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const total = totalQuestions(exam);
  const offsets = useMemo(() => sectionOffsets(exam), [exam]);

  const [answers, setAnswers] = useState<Answer[]>(() =>
    Array<Answer>(total).fill(null),
  );
  const [grade, setGrade] = useState<ExamGrade | null>(null);
  const [confetti, setConfetti] = useState(0);

  const answered = answers.filter(hasAnswer).length;
  const remaining = total - answered;

  function setAnswerAt(i: number, v: Answer) {
    setAnswers((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  }

  function submit() {
    const g = gradeExam(exam, answers);
    setGrade(g);
    record(exam.id, { correct: g.correct, total: g.total, takenAt: todayKey() });

    // 모의고사 제출 보상 XP 계산
    const baseReward = 30; // 기본 완료 보상
    const correctReward = g.correct * 5; // 문제당 5 XP
    const bonusReward = g.correct / g.total >= 0.8 ? 20 : 0; // 정답률 80% 이상 고득점 보너스 20 XP
    gainXp(baseReward + correctReward + bonusReward);

    if (g.passed) setConfetti((n) => n + 1);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function retry() {
    setAnswers(Array<Answer>(total).fill(null));
    setGrade(null);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  const checked = grade !== null;

  return (
    <div className="min-h-dvh">
      <Confetti trigger={confetti} />

      {/* 상단 고정 바 — 회차·진행/점수 */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-3">
          <Link
            href="/exams"
            aria-label="시험 나가기"
            className="rounded-full p-2 text-muted transition-colors hover:bg-foreground/5"
          >
            <X className="size-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{exam.title}</p>
            {!checked ? (
              <div className="mt-1 flex items-center gap-2">
                <ProgressBar value={answered} max={total} className="h-1.5" />
                <span className="shrink-0 text-xs font-semibold tabular-nums text-muted">
                  {answered}/{total}
                </span>
              </div>
            ) : (
              <p className="text-xs text-muted">채점 완료 · 해설 확인</p>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 py-6">
        {checked && grade && (
          <ResultSummary exam={exam} grade={grade} />
        )}

        {!checked && (
          <div className="mb-5 rounded-xl border border-brand-500/25 bg-brand-500/[0.06] p-4">
            <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">
              실제 시험처럼, 한 번에 다 풀고 제출해요
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              총 {total}문항 · 4지선다와 단답형. 중간 채점은 없어요. 다 풀면 아래
              제출 버튼으로 한꺼번에 채점하고 해설을 봐요.
            </p>
          </div>
        )}

        {/* 섹션(영역)별 문항 */}
        <div className="flex flex-col gap-8">
          {exam.sections.map((section, si) => (
            <section key={`${section.levelId}-${si}`}>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm font-bold text-brand-600">
                  {ROMAN[si]}
                </span>
                <h2 className="text-sm font-bold">{levelTitle(section.levelId)}</h2>
                <span className="text-xs text-muted">
                  · {section.questions.length}문항
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {section.questions.map((q, qi) => {
                  const idx = offsets[si] + qi;
                  return (
                    <ExamQuestionCard
                      key={idx}
                      number={idx + 1}
                      question={q}
                      answer={answers[idx]}
                      onChange={(a) => setAnswerAt(idx, a)}
                      checked={checked}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* 하단 액션 */}
        {!checked ? (
          <div className="sticky bottom-0 -mx-4 mt-6 border-t border-border bg-background/90 px-4 py-3 backdrop-blur">
            <Button size="lg" fullWidth onClick={submit}>
              {remaining === 0
                ? "제출하고 채점하기"
                : `${remaining}문항 남음 · 제출하기`}
            </Button>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-2">
            <Button size="lg" fullWidth onClick={retry}>
              <RotateCcw className="size-5" /> 다시 풀기
            </Button>
            <div className="flex gap-2">
              <Link
                href="/exams"
                className={buttonVariants({
                  variant: "secondary",
                  className: "flex-1",
                })}
              >
                다른 회차 <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/"
                className={buttonVariants({ variant: "ghost" })}
                aria-label="홈으로"
              >
                <Home className="size-4" /> 홈
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ResultSummary({ exam, grade }: { exam: Exam; grade: ExamGrade }) {
  const score = toScore(grade.correct, grade.total);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <Card highlight padding="lg" className="text-center">
        <MascotImage variant="exam" className="mx-auto w-24" />
        <p className="mt-3 text-sm font-semibold text-brand-600">
          {exam.title} 결과
        </p>
        <p className="mt-1 text-4xl font-bold tabular-nums">
          {grade.correct}
          <span className="text-2xl text-muted"> / {grade.total}</span>
        </p>
        <p className="mt-1 text-sm text-muted">
          {score}점 ·{" "}
          {grade.passed
            ? "잘했어요, 개념이 탄탄해요!"
            : "아쉬워요 — 해설을 보고 한 번 더!"}
        </p>

        {/* 영역별 성적 */}
        <ul className="mt-5 flex flex-col gap-2 text-left">
          {grade.sections.map((s) => {
            const pct = s.total > 0 ? (s.correct / s.total) * 100 : 0;
            return (
              <li key={s.levelId} className="flex items-center gap-3">
                <span className="w-24 shrink-0 truncate text-xs font-semibold">
                  {levelTitle(s.levelId)}
                </span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-subtle">
                  <span
                    className="block h-full rounded-full bg-brand-500"
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className="w-8 shrink-0 text-right text-xs tabular-nums text-muted">
                  {s.correct}/{s.total}
                </span>
              </li>
            );
          })}
        </ul>
      </Card>

      <p className="mt-6 text-center text-sm font-semibold text-muted">
        ↓ 문항별 해설
      </p>
    </motion.div>
  );
}
