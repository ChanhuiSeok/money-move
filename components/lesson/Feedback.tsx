"use client";

import { motion } from "framer-motion";
import { MascotImage } from "@/components/mascot/MascotImage";
import { RichText } from "@/components/glossary/RichText";
import { cn } from "@/lib/utils";

/** 채점 결과 피드백 — 정답은 신나게, 오답은 부드럽게 + 바로 풀이. 마스코트가 함께 반응. */
export function Feedback({
  correct,
  headline,
  explanation,
}: {
  correct: boolean;
  headline: string;
  explanation: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "rounded-card border p-5",
        correct
          ? "border-success/40 bg-success/10"
          : "border-danger/40 bg-danger/10",
      )}
    >
      <div className="flex items-center gap-3">
        <MascotImage
          variant={correct ? "book" : "study"}
          className={cn("shrink-0", correct ? "w-16" : "w-12")}
        />
        <p
          className={cn(
            "text-lg font-bold",
            correct ? "text-success" : "text-danger",
          )}
        >
          {headline}
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        <RichText text={explanation} />
      </p>
    </motion.div>
  );
}
