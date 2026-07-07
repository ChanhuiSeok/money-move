"use client";

import { Check, X } from "lucide-react";
import { RichText } from "@/components/glossary/RichText";
import { isAnswerCorrect, type Answer } from "@/lib/grade";
import { richTextToPlain } from "@/lib/richtext";
import type { Question } from "@/lib/schema";
import { cn } from "@/lib/utils";

/** 시험지 한 문항 — 4지선다·단답형. 출제(checked=false)와 해설(checked=true) 모두 렌더한다.
   학습 화면(QuestionView)보다 밀도 높은 '문제지' 톤. OX는 모의고사에 쓰지 않는다. */
export function ExamQuestionCard({
  number,
  question,
  answer,
  onChange,
  checked,
}: {
  number: number;
  question: Question;
  answer: Answer;
  onChange: (a: Answer) => void;
  checked: boolean;
}) {
  const correct = checked ? isAnswerCorrect(question, answer) : false;

  return (
    <div
      className={cn(
        "scroll-mt-20 rounded-xl border bg-surface p-4 transition-colors sm:p-5",
        checked
          ? correct
            ? "border-success/40"
            : "border-danger/40"
          : "border-border",
      )}
    >
      <div className="flex gap-3">
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-bold tabular-nums",
            checked
              ? correct
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger"
              : "bg-brand-500/10 text-brand-600",
          )}
        >
          {number}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold leading-relaxed text-foreground">
            <RichText text={question.prompt} />
          </p>

          <div className="mt-4">
            {question.type === "choice" && (
              <ChoiceOptions
                question={question}
                answer={answer}
                onChange={onChange}
                checked={checked}
              />
            )}
            {question.type === "fill" && (
              <FillAnswer
                question={question}
                answer={answer}
                onChange={onChange}
                checked={checked}
              />
            )}
          </div>

          {/* 해설 — 채점 후에만 */}
          {checked && question.explanation && (
            <div className="mt-3 rounded-lg bg-subtle/60 px-3.5 py-3 text-sm leading-relaxed text-muted">
              <span className="font-bold text-foreground">해설 </span>
              <RichText text={question.explanation} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const CIRCLE = ["①", "②", "③", "④", "⑤"];

function ChoiceOptions({
  question,
  answer,
  onChange,
  checked,
}: {
  question: Extract<Question, { type: "choice" }>;
  answer: Answer;
  onChange: (a: Answer) => void;
  checked: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      {question.options.map((opt, i) => {
        const selected = answer === i;
        const isCorrectOpt = question.answerIndex === i;
        let tone: "idle" | "selected" | "correct" | "wrong" | "muted" = "idle";
        if (checked) {
          if (isCorrectOpt) tone = "correct";
          else if (selected) tone = "wrong";
          else tone = "muted";
        } else if (selected) {
          tone = "selected";
        }
        return (
          <button
            key={i}
            type="button"
            disabled={checked}
            onClick={() => onChange(i)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-[15px] transition-colors",
              tone === "idle" &&
                "border-border bg-surface hover:border-brand-400 hover:bg-brand-500/5",
              tone === "selected" && "border-brand-500 bg-brand-500/10 font-medium",
              tone === "correct" && "border-success bg-success/10 font-medium",
              tone === "wrong" && "border-danger bg-danger/10",
              tone === "muted" && "border-border bg-surface opacity-55",
            )}
          >
            <span
              className={cn(
                "shrink-0 text-base",
                tone === "correct"
                  ? "text-success"
                  : tone === "wrong"
                    ? "text-danger"
                    : tone === "selected"
                      ? "text-brand-600"
                      : "text-muted",
              )}
            >
              {CIRCLE[i]}
            </span>
            <span className="min-w-0 flex-1">{richTextToPlain(opt)}</span>
            {checked && isCorrectOpt && (
              <Check className="size-4 shrink-0 text-success" />
            )}
            {checked && !isCorrectOpt && selected && (
              <X className="size-4 shrink-0 text-danger" />
            )}
          </button>
        );
      })}
    </div>
  );
}

function FillAnswer({
  question,
  answer,
  onChange,
  checked,
}: {
  question: Extract<Question, { type: "fill" }>;
  answer: Answer;
  onChange: (a: Answer) => void;
  checked: boolean;
}) {
  const value = typeof answer === "string" ? answer : "";
  const correct = checked && isAnswerCorrect(question, answer);

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="shrink-0 rounded-md bg-subtle px-2 py-0.5 text-[11px] font-semibold text-muted">
          단답형
        </span>
        <input
          type="text"
          inputMode="text"
          autoComplete="off"
          disabled={checked}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="답을 입력하세요"
          className={cn(
            "min-w-0 flex-1 rounded-lg border bg-surface px-3.5 py-2.5 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted/70",
            checked
              ? correct
                ? "border-success bg-success/5"
                : "border-danger bg-danger/5"
              : "border-border focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20",
          )}
        />
        {checked &&
          (correct ? (
            <Check className="size-5 shrink-0 text-success" />
          ) : (
            <X className="size-5 shrink-0 text-danger" />
          ))}
      </div>
      {checked && !correct && (
        <p className="mt-2 text-sm text-muted">
          정답: <b className="text-foreground">{question.answer[0]}</b>
        </p>
      )}
    </div>
  );
}
