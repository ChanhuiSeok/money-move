"use client";

import { addDays, todayKey } from "@/lib/progress";
import { cn } from "@/lib/utils";

const WEEKS = 14;
const DOW = ["일", "월", "화", "수", "목", "금", "토"];

/** 깃허브식 학습 잔디. activeDays(YYYY-MM-DD)를 최근 WEEKS주 그리드에 칠한다.
   열 = 주(일~토), 행 = 요일. 오늘은 테두리로 표시. */
export function StreakCalendar({ activeDays }: { activeDays: string[] }) {
  const today = todayKey();
  const active = new Set(activeDays);
  const dow = new Date(`${today}T00:00:00Z`).getUTCDay(); // 0=일
  const startOffset = -((WEEKS - 1) * 7 + dow); // 그리드 좌상단(가장 과거) 칸

  const columns = Array.from({ length: WEEKS }, (_, col) =>
    Array.from({ length: 7 }, (_, row) => {
      const date = addDays(today, startOffset + col * 7 + row);
      return {
        date,
        active: active.has(date),
        isToday: date === today,
        isFuture: date > today,
      };
    }),
  );

  return (
    <div className="flex gap-2">
      {/* 요일 라벨 */}
      <div className="flex flex-col gap-1 pr-0.5">
        {DOW.map((d, i) => (
          <span
            key={d}
            className="flex h-3.5 items-center text-[9px] leading-none text-muted"
          >
            {i % 2 === 1 ? d : ""}
          </span>
        ))}
      </div>

      {/* 오늘 칸의 ring이 잘리지 않도록 살짝 여백을 두고 클리핑하지 않는다 */}
      <div className="flex gap-1 p-0.5">
        {columns.map((cells, col) => (
          <div key={col} className="flex flex-col gap-1">
            {cells.map((c) => (
              <span
                key={c.date}
                title={c.date}
                className={cn(
                  "size-3.5 rounded-[3px]",
                  c.isFuture
                    ? "bg-transparent"
                    : c.active
                      ? "bg-brand-500"
                      : "bg-subtle",
                  c.isToday &&
                    "ring-2 ring-brand-600 ring-offset-1 ring-offset-surface",
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
