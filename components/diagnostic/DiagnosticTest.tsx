"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { buttonVariants } from "@/components/ui/buttonStyles";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/lesson/ProgressBar";
import { QuestionView } from "@/components/lesson/QuestionView";
import { diagnosticItems } from "@/content/diagnostic";
import { hasAnswer, isAnswerCorrect, type Answer } from "@/lib/grade";
import {
  gradeDiagnostic,
  placedOutLessonIds,
  skippedLevelCount,
  startLevel,
} from "@/lib/diagnostic";
import { useProgress } from "@/store/useProgress";

type Phase = "intro" | "play" | "result";

export function DiagnosticTest() {
  const placeOut = useProgress((s) => s.placeOut);
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<Answer>(null);
  const [correctness, setCorrectness] = useState<boolean[]>([]);

  const total = diagnosticItems.length;
  const current = diagnosticItems[index];
  const isLast = index === total - 1;

  function next() {
    const correct = isAnswerCorrect(current.question, answer);
    const all = [...correctness, correct];
    setCorrectness(all);
    if (isLast) {
      setPhase("result");
      return;
    }
    setIndex((i) => i + 1);
    setAnswer(null);
  }

  if (phase === "intro") return <IntroView onStart={() => setPhase("play")} />;

  if (phase === "result") {
    return (
      <ResultView
        correctness={correctness}
        onSkip={(ids) => {
          placeOut(ids);
          router.push("/learn");
        }}
        onFull={() => router.push("/learn")}
      />
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center gap-3 p-4">
        <Link
          href="/"
          aria-label="홈으로 나가기"
          className="rounded-full p-2 text-muted transition-colors hover:bg-foreground/5"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <ProgressBar value={index} max={total} />
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-6">
        <p className="text-sm font-semibold text-brand-600">
          진단 {index + 1} / {total}
        </p>
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-3 flex-1"
        >
          {/* 진단이므로 정답/오답을 바로 보여주지 않는다(checked=false 고정). */}
          <QuestionView
            question={current.question}
            answer={answer}
            onChange={setAnswer}
            checked={false}
          />
        </motion.div>

        <div className="sticky bottom-0 mt-6 bg-background/80 py-2 backdrop-blur">
          <Button
            size="lg"
            fullWidth
            disabled={!hasAnswer(answer)}
            onClick={next}
          >
            {isLast ? "결과 보기" : "다음"}
            <ArrowRight className="size-5" />
          </Button>
          <p className="mt-2 text-center text-xs text-muted">
            몰라도 괜찮아요 — 처음부터 배우면 되니까요.
          </p>
        </div>
      </main>
    </div>
  );
}

function IntroView({ onStart }: { onStart: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-1 flex-col justify-center p-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center"
      >
        <Mascot mood="idle" className="size-24" />
        <h1 className="mt-5 text-2xl font-bold tracking-tight">
          이미 좀 아세요?
        </h1>
        <p className="mt-2 leading-relaxed text-muted">
          짧은 문제 {diagnosticItems.length}개만 풀어볼게요. 잘 아는 부분은
          건너뛰고, 딱 필요한 곳부터 시작할 수 있어요.
        </p>
      </motion.div>

      <div className="mt-8 flex flex-col gap-2">
        <Button size="lg" fullWidth onClick={onStart}>
          진단 시작하기 <ArrowRight className="size-5" />
        </Button>
        <Link href="/learn" className={buttonVariants({ variant: "ghost" })}>
          그냥 처음부터 배울래요
        </Link>
      </div>
    </main>
  );
}

function ResultView({
  correctness,
  onSkip,
  onFull,
}: {
  correctness: boolean[];
  onSkip: (lessonIds: string[]) => void;
  onFull: () => void;
}) {
  const results = useMemo(
    () => gradeDiagnostic(diagnosticItems, correctness),
    [correctness],
  );
  const placedOut = useMemo(() => placedOutLessonIds(results), [results]);
  const skipped = skippedLevelCount(results);
  const start = startLevel(results);
  const canSkip = placedOut.length > 0;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-1 flex-col justify-center p-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card highlight padding="lg" className="text-center">
          <Mascot mood="celebrate" className="mx-auto size-20" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            {canSkip ? "이미 많이 알고 계시네요!" : "기초부터 차근차근 가요!"}
          </h1>
          <p className="mt-2 leading-relaxed text-muted">
            {canSkip ? (
              <>
                레벨 <b className="text-foreground">{skipped}개</b>를 건너뛸 수
                있어요.
                {start ? (
                  <>
                    {" "}
                    <b className="text-foreground">{start.title}</b>부터
                    시작하면 딱 맞아요.
                  </>
                ) : (
                  " 모든 레벨을 통과했어요. 새 레슨이 추가되면 알려드릴게요!"
                )}
              </>
            ) : (
              "가장 든든한 출발이에요. 처음 몇 레슨은 30초면 맞혀요."
            )}
          </p>
        </Card>

        {/* 레벨별 결과 요약 */}
        <ul className="mt-5 flex flex-col gap-2">
          {results.map((r) => (
            <li
              key={r.levelId}
              className="flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3"
            >
              <span
                className={
                  r.passed
                    ? "flex size-8 shrink-0 items-center justify-center rounded-full bg-success/10 text-success"
                    : "flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600"
                }
              >
                {r.passed ? (
                  <Check className="size-4" />
                ) : (
                  <Sparkles className="size-4" />
                )}
              </span>
              <span className="min-w-0 flex-1 text-sm font-semibold">
                {r.title}
              </span>
              <span className="text-xs text-muted">
                {r.passed ? "건너뛰기" : "여기서 시작"} · {r.correct}/{r.total}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-2">
          {canSkip ? (
            <>
              <Button size="lg" fullWidth onClick={() => onSkip(placedOut)}>
                건너뛰고 시작하기 <ArrowRight className="size-5" />
              </Button>
              <Button variant="ghost" onClick={onFull}>
                처음부터 다 볼래요
              </Button>
            </>
          ) : (
            <Button size="lg" fullWidth onClick={onFull}>
              학습 시작하기 <ArrowRight className="size-5" />
            </Button>
          )}
        </div>
      </motion.div>
    </main>
  );
}
