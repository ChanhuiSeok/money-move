"use client";

import { Check, X } from "lucide-react";
import { RichText } from "@/components/glossary/RichText";
import type { Answer } from "@/lib/grade";
import { richTextToPlain } from "@/lib/richtext";
import type { Question } from "@/lib/schema";
import { cn } from "@/lib/utils";

type Props = {
  question: Question;
  answer: Answer;
  onChange: (answer: Answer) => void;
  /** 채점 후에는 입력을 잠그고 정답/오답을 표시한다. */
  checked: boolean;
};

export function QuestionView({ question, answer, onChange, checked }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold leading-relaxed">
        <RichText text={question.prompt} />
      </h2>
      <div className="mt-6">
        {question.type === "ox" && (
          <OxInput question={question} answer={answer} onChange={onChange} checked={checked} />
        )}
        {question.type === "choice" && (
          <ChoiceInput question={question} answer={answer} onChange={onChange} checked={checked} />
        )}
        {question.type === "fill" && (
          <FillInput answer={answer} onChange={onChange} checked={checked} />
        )}
      </div>
    </div>
  );
}

/** 채점 후 선택지의 상태에 따른 스타일. */
function optionClass(state: "idle" | "correct" | "wrong" | "muted") {
  return cn(
    "flex w-full items-center justify-between gap-3 rounded-xl border px-5 py-4 text-left text-base font-medium transition-colors",
    state === "idle" &&
      "border-border bg-surface hover:border-brand-400 hover:bg-brand-500/5",
    state === "muted" && "border-border bg-surface opacity-50",
    state === "correct" && "border-success bg-success/10 text-foreground",
    state === "wrong" && "border-danger bg-danger/10 text-foreground",
  );
}

function StateIcon({ state }: { state: "correct" | "wrong" }) {
  return state === "correct" ? (
    <Check className="size-5 shrink-0 text-success" />
  ) : (
    <X className="size-5 shrink-0 text-danger" />
  );
}

function OxInput({
  question,
  answer,
  onChange,
  checked,
}: {
  question: Extract<Question, { type: "ox" }>;
  answer: Answer;
  onChange: (a: Answer) => void;
  checked: boolean;
}) {
  const opts = [
    { value: true, label: "맞아요", mark: "O" },
    { value: false, label: "아니에요", mark: "X" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {opts.map((o) => {
        const selected = answer === o.value;
        const isCorrectOpt = question.answer === o.value;
        let state: "idle" | "correct" | "wrong" | "muted" = "idle";
        if (checked) {
          if (isCorrectOpt) state = "correct";
          else if (selected) state = "wrong";
          else state = "muted";
        }
        return (
          <button
            key={o.mark}
            type="button"
            disabled={checked}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-xl border px-4 py-6 transition-colors",
              !checked && selected
                ? "border-brand-500 bg-brand-500/10"
                : !checked && "border-border bg-surface hover:border-brand-400 hover:bg-brand-500/5",
              checked && state === "correct" && "border-success bg-success/10",
              checked && state === "wrong" && "border-danger bg-danger/10",
              checked && state === "muted" && "border-border bg-surface opacity-50",
            )}
          >
            <span className="text-3xl font-bold text-brand-600">{o.mark}</span>
            <span className="text-sm font-semibold">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ChoiceInput({
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
    <div className="flex flex-col gap-3">
      {question.options.map((opt, i) => {
        const selected = answer === i;
        const isCorrectOpt = question.answerIndex === i;
        let state: "idle" | "correct" | "wrong" | "muted" = "idle";
        if (checked) {
          if (isCorrectOpt) state = "correct";
          else if (selected) state = "wrong";
          else state = "muted";
        }
        return (
          <button
            key={i}
            type="button"
            disabled={checked}
            onClick={() => onChange(i)}
            className={cn(
              optionClass(state),
              !checked && selected && "border-brand-500 bg-brand-500/10",
            )}
          >
            <span>{richTextToPlain(opt)}</span>
            {checked && state === "correct" && <StateIcon state="correct" />}
            {checked && state === "wrong" && <StateIcon state="wrong" />}
          </button>
        );
      })}
    </div>
  );
}

function FillInput({
  answer,
  onChange,
  checked,
}: {
  answer: Answer;
  onChange: (a: Answer) => void;
  checked: boolean;
}) {
  return (
    <input
      type="text"
      inputMode="text"
      autoComplete="off"
      disabled={checked}
      value={typeof answer === "string" ? answer : ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="여기에 답을 적어보세요"
      className={cn(
        "w-full rounded-xl border bg-surface px-5 py-4 text-lg text-foreground outline-none transition-colors placeholder:text-muted",
        "border-border focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20",
        checked && "opacity-70",
      )}
    />
  );
}
