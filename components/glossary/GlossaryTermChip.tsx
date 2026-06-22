"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { GlossaryTerm } from "@/lib/schema";

const MARGIN = 8; // 뷰포트 가장자리 여백(px)
const MAX_WIDTH = 264;
const EST_HEIGHT = 150; // 위/아래 배치 결정용 추정 높이

type Coords = {
  left: number;
  width: number;
  placeBelow: boolean;
  top?: number; // 아래 배치
  bottom?: number; // 위 배치(말풍선 아랫변을 용어 윗변에 맞춤)
};

/** 본문 속 용어 — 밑줄로 표시하고, 탭하면 short 설명을 말풍선으로 띄운다.
   말풍선은 body로 portal해 fixed 위치로 띄우고, 좌우·상하 모두 뷰포트 안으로 클램프한다.
   (변형된 부모 안에서도 안 잘리고, 화면 끝 용어도 가려지지 않음) */
export function GlossaryTermChip({
  label,
  term,
}: {
  label: string;
  term: GlossaryTerm;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    const el = btnRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const width = Math.min(MAX_WIDTH, vw - MARGIN * 2);

      // 좌우: 용어 중앙에 맞추되 뷰포트 안으로 클램프
      let left = rect.left + rect.width / 2 - width / 2;
      left = Math.max(MARGIN, Math.min(left, vw - width - MARGIN));

      // 상하: 위 공간이 부족하면 아래로. 위 배치는 bottom 기준으로 앵커(높이 추정 불필요)
      const placeBelow = rect.top < EST_HEIGHT + MARGIN;
      const next: Coords = { left, width, placeBelow };
      if (placeBelow) {
        next.top = Math.min(rect.bottom + MARGIN, vh - MARGIN);
      } else {
        next.bottom = vh - rect.top + MARGIN;
      }
      setCoords(next);
    }
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || popRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    const close = () => setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    // 스크롤/리사이즈되면 fixed 말풍선이 어긋나므로 닫는다.
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={`용어 풀이: ${term.term}`}
        className="font-medium text-brand-600 underline decoration-dotted decoration-brand-400/70 underline-offset-4 transition-colors hover:decoration-brand-600"
      >
        {label}
      </button>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && coords && (
              <motion.div
                ref={popRef}
                role="tooltip"
                initial={{ opacity: 0, y: coords.placeBelow ? -6 : 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: coords.placeBelow ? -4 : 4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: "fixed",
                  left: coords.left,
                  width: coords.width,
                  top: coords.top,
                  bottom: coords.bottom,
                  maxHeight: `calc(100vh - ${MARGIN * 2}px)`,
                  transformOrigin: coords.placeBelow ? "top center" : "bottom center",
                }}
                className="z-50 overflow-y-auto rounded-xl border border-border bg-surface p-3 text-left shadow-lg"
              >
                <span className="block text-sm font-bold text-foreground">
                  {term.term}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">
                  {term.short}
                </span>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
