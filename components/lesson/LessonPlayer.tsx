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
import { RichText } from "@/components/glossary/RichText";
import { completeLines, correctLines, pick, wrongLines } from "@/content/messages";
import { allLessons } from "@/content/lessons";
import { completedLevelCount, levelJustCompleted } from "@/content/levels";
import {
  newlyEarnedBadges,
  type AchievementStats,
  type Badge,
} from "@/lib/achievements";
import { learnedTermIds } from "@/lib/glossary";
import { hasAnswer, isAnswerCorrect, type Answer } from "@/lib/grade";
import type { Level, Lesson, Progress } from "@/lib/schema";
import { useProgress } from "@/store/useProgress";

function statsOf(p: Progress): AchievementStats {
  return {
    completedCount: p.completedLessonIds.length,
    xp: p.xp,
    bestStreak: p.bestStreak,
    levelsCompleted: completedLevelCount(p.completedLessonIds),
    termsLearned: learnedTermIds(p.completedLessonIds, allLessons).size,
  };
}

type Phase = "intro" | "play" | "done";

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const hydrate = useProgress((s) => s.hydrate);
  const complete = useProgress((s) => s.complete);
  const markWrong = useProgress((s) => s.markWrong);

  // 진도를 덮어쓰지 않도록 마운트 시 저장값을 불러온다.
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const total = lesson.questions.length;
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<Answer>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [confetti, setConfetti] = useState(0);
  const [levelCleared, setLevelCleared] = useState<Level | null>(null);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);

  const question = lesson.questions[index];
  const isCorrect = checked && question ? isAnswerCorrect(question, answer) : false;
  const isLast = index === total - 1;

  const xpEarned = useMemo(() => 10 + correctCount * 2, [correctCount]);

  function start() {
    setPhase("play");
  }

  function check() {
    if (checked || !question || !hasAnswer(answer)) return;
    const correct = isAnswerCorrect(question, answer);
    setChecked(true);
    if (correct) {
      setCorrectCount((c) => c + 1);
      setConfetti((n) => n + 1);
    } else {
      markWrong(`${lesson.id}:${index}`);
    }
  }

  function next() {
    if (isLast) {
      finish();
      return;
    }
    setIndex((i) => i + 1);
    setAnswer(null);
    setChecked(false);
  }

  function finish() {
    // 완료 전/후 진도를 비교해 새 배지·레벨 클리어를 가려낸다.
    const before = statsOf(useProgress.getState().progress);
    complete(lesson.id, xpEarned);
    const after = useProgress.getState().progress;
    const cleared = levelJustCompleted(lesson.id, after.completedLessonIds);
    setLevelCleared(cleared);
    setNewBadges(newlyEarnedBadges(before, statsOf(after)));
    setConfetti((n) => n + (cleared ? 2 : 1));
    setPhase("done");
  }

  function retry() {
    setPhase("intro");
    setIndex(0);
    setAnswer(null);
    setChecked(false);
    setCorrectCount(0);
    setLevelCleared(null);
    setNewBadges([]);
  }

  const filled = phase === "done" ? total : index + (checked ? 1 : 0);

  return (
    <div className="flex min-h-dvh flex-col">
      <Confetti trigger={confetti} />

      {/* 상단 바 */}
      <header className="flex items-center gap-3 p-4">
        <Link
          href="/learn"
          aria-label="학습 경로로 나가기"
          className="rounded-full p-2 text-muted transition-colors hover:bg-foreground/5"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <ProgressBar value={filled} max={total} />
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-6">
        {phase === "intro" && (
          <IntroView lesson={lesson} onStart={start} />
        )}

        {phase === "play" && question && (
          <div className="flex flex-1 flex-col">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1"
            >
              <QuestionView
                question={question}
                answer={answer}
                onChange={setAnswer}
                checked={checked}
              />
              {checked && (
                <div className="mt-6">
                  <Feedback
                    correct={isCorrect}
                    headline={isCorrect ? pick(correctLines) : pick(wrongLines)}
                    explanation={question.explanation}
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
          <SummaryView
            correctCount={correctCount}
            total={total}
            xp={xpEarned}
            levelCleared={levelCleared}
            newBadges={newBadges}
            onRetry={retry}
          />
        )}
      </main>
    </div>
  );
}

function IntroView({
  lesson,
  onStart,
}: {
  lesson: Lesson;
  onStart: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">
        <p className="text-sm font-bold text-brand-600">
          {lesson.durationMin}분 · {lesson.questions.length}문제
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{lesson.title}</h1>
        <div className="mt-5 space-y-3 text-base leading-relaxed text-foreground/80">
          {lesson.intro.split("\n").map((line, i) => (
            <p key={i}>
              <RichText text={line} />
            </p>
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 mt-6 bg-background/80 py-2 backdrop-blur">
        <Button size="lg" fullWidth onClick={onStart}>
          시작하기
        </Button>
      </div>
    </div>
  );
}

function SummaryView({
  correctCount,
  total,
  xp,
  levelCleared,
  newBadges,
  onRetry,
}: {
  correctCount: number;
  total: number;
  xp: number;
  levelCleared: Level | null;
  newBadges: Badge[];
  onRetry: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-1 flex-col justify-center"
    >
      {/* 레벨 클리어 팡파레 — 한 레벨을 통째로 끝냈을 때 */}
      {levelCleared && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-3 rounded-card border border-brand-500/40 bg-brand-500/10 p-4 text-center"
        >
          <p className="text-3xl">🏆</p>
          <p className="mt-1 text-lg font-bold text-brand-700">
            레벨 클리어! {levelCleared.title}
          </p>
          <p className="text-sm text-brand-700/80">한 단계를 통째로 끝냈어요!</p>
        </motion.div>
      )}

      <Card highlight padding="lg" className="text-center">
        <Mascot mood="celebrate" className="mx-auto size-20" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">{pick(completeLines)}</h1>
        <p className="mt-2 text-muted">
          {total}문제 중 <b className="text-foreground">{correctCount}개</b> 맞혔어요.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-2 font-bold text-brand-600">
          +{xp} XP
        </div>

        {/* 새로 얻은 배지 */}
        {newBadges.length > 0 && (
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-sm font-semibold text-brand-600">새 배지 획득! 🎉</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {newBadges.map((b) => (
                <span
                  key={b.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1.5 text-sm font-semibold"
                >
                  <span className="text-lg">{b.emoji}</span>
                  {b.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className="mt-6 flex flex-col gap-2">
        <Link
          href="/learn"
          className={buttonVariants({ size: "lg", fullWidth: true })}
        >
          학습 경로로
        </Link>
        <Button variant="ghost" onClick={onRetry}>
          <RotateCcw className="size-4" /> 다시 풀기
        </Button>
      </div>
    </motion.div>
  );
}
