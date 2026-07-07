"use client";

import { motion } from "framer-motion";
import { Mascot, type MascotMood } from "@/components/mascot/Mascot";
import { cn } from "@/lib/utils";

/** 마스코트 + 말풍선. 홈 인사·빈 화면 안내 등에 쓴다. */
export function MascotBubble({
  mood = "idle",
  message,
  className,
}: {
  mood?: MascotMood;
  message: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* 바깥 div: 등장(스프링). 안쪽 span: CSS 부유(animate-bob).
         변형을 두 레이어로 분리해 framer transform과 CSS animation이 서로 덮어쓰지 않게 한다. */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
        className="shrink-0"
      >
        <span className="animate-bob inline-block">
          <Mascot mood={mood} className="size-12" />
        </span>
      </motion.div>
      <div className="rounded-2xl rounded-tl-sm bg-subtle px-4 py-2 text-sm font-medium">
        {message}
      </div>
    </div>
  );
}
