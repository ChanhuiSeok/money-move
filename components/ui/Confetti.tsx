"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

const COLORS = ["#2563eb", "#3b82f6", "#38bdf8", "#0ea5e9", "#16a34a"];
const COUNT = 30;

// trigger를 시드로 한 결정적 의사난수(0~1). 순수 함수라 렌더 중 사용해도 안전.
function seeded(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/** trigger 값이 바뀔 때마다 컨페티가 한 번 터진다(매번 다른 배치). 0이면 표시 안 함. */
export function Confetti({ trigger }: { trigger: number }) {
  const reduced = useReducedMotion();

  const pieces = useMemo(() => {
    if (!trigger) return [];
    return Array.from({ length: COUNT }, (_, i) => {
      const r = (n: number) => seeded(trigger * 97 + i * 13 + n);
      return {
        id: i,
        left: r(1) * 100, // vw %
        drift: (r(2) - 0.5) * 140, // px
        rotate: r(3) * 540,
        delay: r(4) * 0.15,
        duration: 1.5 + r(5) * 0.7,
        size: 7 + r(6) * 8,
        color: COLORS[i % COLORS.length],
        round: r(7) > 0.5,
      };
    });
  }, [trigger]);

  if (!pieces.length || reduced) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden
    >
      {pieces.map((p) => (
        <motion.span
          key={`${trigger}-${p.id}`}
          initial={{ top: "-8%", left: `${p.left}vw`, opacity: 1, rotate: 0 }}
          animate={{
            top: "108%",
            left: `calc(${p.left}vw + ${p.drift}px)`,
            rotate: p.rotate,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.round ? "9999px" : "2px",
          }}
        />
      ))}
    </div>
  );
}
