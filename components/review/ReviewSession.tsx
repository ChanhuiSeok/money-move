"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Mascot } from "@/components/mascot/Mascot";
import { Confetti } from "@/components/ui/Confetti";
import { Button } from "@/components/ui/Button";
import { buttonVariants } from "@/components/ui/buttonStyles";
import { Card } from "@/components/ui/Card";
import { Feedback } from "@/components/lesson/Feedback";
import { ProgressBar } from "@/components/lesson/ProgressBar";
import { QuestionView } from "@/components/lesson/QuestionView";
import { getQuestionByRef, questionIdsOfLessons } from "@/content/lessons";
import {
  correctLines,
  pick,
  reviewDoneLines,
  reviewEmptyLines,
  wrongLines,
} from "@/content/messages";
import { hasAnswer, isAnswerCorrect, type Answer } from "@/lib/grade";
import { playCorrectChime } from "@/lib/sound";
import { todayKey, XP_PER_REVIEW } from "@/lib/progress";
import { buildQuiz, dueItems } from "@/lib/review";
import type { Question } from "@/lib/schema";
import { useProgress } from "@/store/useProgress";

type QuizItem = { id: string; question: Question; lessonTitle: string };
type Phase = "loading" | "empty" | "play" | "done";

export function ReviewSession() {
  const hydrate = useProgress((s) => s.hydrate);
  const hydrated = useProgress((s) => s.hydrated);
  const progress = useProgress((s) => s.progress);
  const reviewAnswer = useProgress((s) => s.reviewAnswer);
  const finishReview = useProgress((s) => s.finishReview);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // 진도가 로드된 뒤 한 번만 오늘의 큐를 만들어 state에 고정한다.
  // 렌더 중 1회 setState(가드로 한 번만) → 세션 동안 reviewItems가 바뀌어도 큐는 그대로.
  const [items, setItems] = useState<QuizItem[] | null>(null);
  if (hydrated && items === null) {
    const today = todayKey();
    const dueIds = dueItems(progress.reviewItems, today).map((i) => i.id);
    const poolIds = questionIdsOfLessons(progress.completedLessonIds);
    setItems(
      buildQuiz({ dueIds, poolIds })
        .map((id) => {
          const ref = getQuestionByRef(id);
          return ref
            ? { id, question: ref.question, lessonTitle: ref.lesson.title }
            : null;
        })
        .filter((x): x is QuizItem => x !== null),
    );
  }

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<Answer>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [confetti, setConfetti] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = items?.length ?? 0;
  const current = items?.[index];
  const isCorrect =
    checked && current ? isAnswerCorrect(current.question, answer) : false;
  const isLast = index === total - 1;

  const phase: Phase = useMemo(() => {
    if (!hydrated || items === null) return "loading";
    if (items.length === 0) return "empty";
    return finished ? "done" : "play";
  }, [hydrated, items, finished]);

  function check() {
    if (checked || !current || !hasAnswer(answer)) return;
    const correct = isAnswerCorrect(current.question, answer);
    setChecked(true);
    if (correct) {
      setCorrectCount((c) => c + 1);
      setConfetti((n) => n + 1);
      playCorrectChime();
    }
    // 맞으면 다음 박스로 승급/졸업, 틀리면 박스 0으로.
    reviewAnswer(current.id, correct);
  }

  function next() {
    if (isLast) {
      finishReview(correctCount);
      setConfetti((n) => n + 1);
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setAnswer(null);
    setChecked(false);
  }

  const filled = finished ? total : index + (checked ? 1 : 0);

  return (
    <div className="flex min-h-dvh flex-col">
      <Confetti trigger={confetti} />

      <header className="flex items-center gap-3 p-4">
        <Link
          href="/"
          aria-label="홈으로 나가기"
          className="rounded-full p-2 text-muted transition-colors hover:bg-foreground/5"
        >
          <ArrowLeft className="size-5" />
        </Link>
        {phase === "play" && <ProgressBar value={filled} max={total} />}
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-6">
        {phase === "loading" && (
          <div className="flex flex-1 items-center justify-center text-muted">
            불러오는 중…
          </div>
        )}

        {phase === "empty" && <EmptyView />}

        {phase === "play" && current && (
          <div className="flex flex-1 flex-col">
            <p className="text-sm font-semibold text-brand-600">
              복습 {index + 1} / {total} · {current.lessonTitle}
            </p>
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-3 flex-1"
            >
              <QuestionView
                question={current.question}
                answer={answer}
                onChange={setAnswer}
                checked={checked}
              />
              {checked && (
                <div className="mt-6">
                  <Feedback
                    correct={isCorrect}
                    headline={isCorrect ? pick(correctLines) : pick(wrongLines)}
                    explanation={current.question.explanation}
                  />
                </div>
              )}
            </motion.div>

            <div className="sticky bottom-0 mt-6 bg-background/80 py-2 backdrop-blur">
              {!checked ? (
                <Button
                  size="lg"
                  fullWidth
                  disabled={!hasAnswer(answer)}
                  onClick={check}
                >
                  정답 확인
                </Button>
              ) : (
                <Button
                  size="lg"
                  fullWidth
                  variant={isCorrect ? "success" : "primary"}
                  onClick={next}
                >
                  {isLast ? "결과 보기" : "다음"}
                </Button>
              )}
            </div>
          </div>
        )}

        {phase === "done" && (
          <SummaryView correctCount={correctCount} total={total} />
        )}
      </main>
    </div>
  );
}

function EmptyView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col items-center justify-center text-center"
    >
      <Mascot mood="idle" className="size-20" />
      <p className="mt-4 text-lg font-bold">{pick(reviewEmptyLines)}</p>
      <p className="mt-1 text-sm text-muted">
        레슨을 풀면 틀린 문제가 며칠 뒤 복습으로 돌아와요.
      </p>
      <Link
        href="/learn"
        className={buttonVariants({ size: "lg", className: "mt-6" })}
      >
        학습하러 가기
      </Link>
    </motion.div>
  );
}

function SummaryView({
  correctCount,
  total,
}: {
  correctCount: number;
  total: number;
}) {
  const xp = correctCount * XP_PER_REVIEW;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-1 flex-col justify-center"
    >
      <Card highlight padding="lg" className="text-center">
        <Mascot mood="celebrate" className="mx-auto size-20" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          {pick(reviewDoneLines)}
        </h1>
        <p className="mt-2 text-muted">
          {total}문제 중 <b className="text-foreground">{correctCount}개</b> 맞혔어요.
        </p>
        {xp > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-2 font-bold text-brand-600">
            +{xp} XP
          </div>
        )}
      </Card>

      <div className="mt-6 flex flex-col gap-2">
        <Link href="/" className={buttonVariants({ size: "lg", fullWidth: true })}>
          홈으로
        </Link>
        <Link href="/learn" className={buttonVariants({ variant: "ghost" })}>
          <RotateCcw className="size-4" /> 학습 계속하기
        </Link>
      </div>
    </motion.div>
  );
}
