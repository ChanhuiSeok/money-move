"use client";

import { useEffect } from "react";
import { Zap } from "lucide-react";
import {
  MascotImage,
  type MascotVariant,
} from "@/components/mascot/MascotImage";
import { Card } from "@/components/ui/Card";
import { getUserLevelInfo } from "@/lib/achievements";
import { useProgress } from "@/store/useProgress";

export function AchievementsSection({
  onTestXp,
  onResetXp,
}: {
  onTestXp?: () => void;
  onResetXp?: () => void;
}) {
  const hydrate = useProgress((s) => s.hydrate);
  const hydrated = useProgress((s) => s.hydrated);
  const progress = useProgress((s) => s.progress);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const lvl = getUserLevelInfo(hydrated ? progress.xp : 0);
  const isMaxLevel = lvl.level === 4;

  // 현재 레벨 진척도 백분율
  const progressPct = isMaxLevel
    ? 100
    : Math.min(
        100,
        Math.max(
          0,
          Math.round(
            ((progress.xp - lvl.prevXp) / (lvl.nextXp - lvl.prevXp)) * 100
          )
        )
      );

  const mascotVariant = `lv${lvl.level}` as MascotVariant;

  return (
    <section className="mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-1.5">내 등급</h2>
        {onTestXp && (
          <div className="flex gap-1.5">
            {onResetXp && (
              <button
                type="button"
                onClick={onResetXp}
                className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-bold text-red-600 hover:bg-red-500/15 active:scale-95 transition-transform"
              >
                🔄 리셋
              </button>
            )}
            <button
              type="button"
              onClick={onTestXp}
              className="inline-flex items-center gap-1 rounded-full border border-brand-500/30 bg-brand-500/10 px-2.5 py-1 text-[11px] font-bold text-brand-600 hover:bg-brand-500/15 active:scale-95 transition-transform"
            >
              🧪 +100 XP 테스트
            </button>
          </div>
        )}
      </div>
      <p className="mt-1 text-xs text-muted">
        학습과 활동을 통해 누적된 경험치로 캐릭터 레벨이 성장해요!
      </p>

      {/* 레벨 스탯 카드 */}
      <Card
        highlight
        padding="lg"
        className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center"
      >
        {/* 캐릭터 이미지 영역 (감싸는 테두리 박스 제거 및 크기 적정 조율) */}
        <div className="flex justify-center shrink-0">
          <div className="flex h-20 w-20 items-end justify-center">
            <MascotImage
              variant={mascotVariant}
              className="max-h-full max-w-full object-contain h-auto w-auto scale-105"
            />
          </div>
        </div>

        {/* 경험치 진척도 정보 */}
        <div className="flex-1 flex flex-col justify-between min-h-[96px]">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded-lg bg-brand-500/10 px-2 py-0.5 text-xs font-bold text-brand-600">
                Lv.{lvl.level}
              </span>
              <span className="text-lg font-extrabold text-foreground">
                {lvl.title} {lvl.badgeEmoji}
              </span>
            </div>

            <p className="mt-1 text-xs text-muted">
              {isMaxLevel
                ? "축하합니다! 최고 등급에 달성했어요."
                : `다음 등급까지 ${lvl.nextXp - progress.xp} XP가 더 필요해요.`}
            </p>
          </div>

          {/* 경험치 바 */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs font-bold text-brand-600 mb-1.5">
              <span className="flex items-center gap-1">
                <Zap className="size-3.5 fill-brand-600 text-brand-600" />{" "}
                {progress.xp} XP
              </span>
              <span className="tabular-nums">
                {isMaxLevel
                  ? "MAX"
                  : `${progress.xp - lvl.prevXp}/${
                      lvl.nextXp - lvl.prevXp
                    } (${progressPct}%)`}
              </span>
            </div>

            <div
              className="h-3 overflow-hidden rounded-full bg-subtle"
              aria-hidden
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
