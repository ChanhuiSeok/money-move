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
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
      >
        <Mascot mood={mood} className="size-12 shrink-0" />
      </motion.div>
      <div className="rounded-2xl rounded-tl-sm bg-subtle px-4 py-2 text-sm font-medium">
        {message}
      </div>
    </div>
  );
}
