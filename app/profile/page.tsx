"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { AchievementsSection } from "@/components/achievements/AchievementsView";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import { Confetti } from "@/components/ui/Confetti";
import { MascotImage, type MascotVariant } from "@/components/mascot/MascotImage";
import { formatWon } from "@/lib/format";
import { getUserLevelInfo } from "@/lib/achievements";
import { isDevToolsEnabled } from "@/lib/env";
import { hasProfile, profileTakeHome } from "@/lib/profile";
import type { Profile } from "@/lib/schema";
import { useProfile } from "@/store/useProfile";
import { useProgress } from "@/store/useProgress";

const QUICK_TOOLS = [
  { href: "/tools/take-home", label: "실수령액 자세히 보기" },
  { href: "/tools/tax-simulator", label: "연말정산 시뮬레이터" },
  { href: "/tools/pension-credit", label: "연금저축·IRP 세액공제" },
];

export default function ProfilePage() {
  const hydrate = useProfile((s) => s.hydrate);
  const hydrated = useProfile((s) => s.hydrated);
  const profile = useProfile((s) => s.profile);
  const save = useProfile((s) => s.save);
  const [justSaved, setJustSaved] = useState(false);

  const gainXp = useProgress((s) => s.gainXp);
  const resetXp = useProgress((s) => s.resetXp);
  const progress = useProgress((s) => s.progress);

  const [levelUpPopup, setLevelUpPopup] = useState<{ oldLevel: number; newLevel: number; title: string; emoji: string } | null>(null);
  const [confetti, setConfetti] = useState(0);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  function handleSave(next: Profile) {
    const isFirstTime = profile.amount === 0 && next.amount > 0;
    const beforeXp = progress.xp;
    const afterXp = beforeXp + (isFirstTime ? 50 : 0);

    save(next);
    setJustSaved(true);

    if (isFirstTime) {
      gainXp(50);
      
      const beforeLvl = getUserLevelInfo(beforeXp);
      const afterLvl = getUserLevelInfo(afterXp);

      if (afterLvl.level > beforeLvl.level) {
        setLevelUpPopup({
          oldLevel: beforeLvl.level,
          newLevel: afterLvl.level,
          title: afterLvl.title,
          emoji: afterLvl.badgeEmoji,
        });
        setConfetti((n) => n + 1);
      }
    }
  }

  function handleTestXp() {
    const beforeXp = progress.xp;
    const afterXp = beforeXp + 100;
    
    gainXp(100);

    const beforeLvl = getUserLevelInfo(beforeXp);
    const afterLvl = getUserLevelInfo(afterXp);

    if (afterLvl.level > beforeLvl.level) {
      setLevelUpPopup({
        oldLevel: beforeLvl.level,
        newLevel: afterLvl.level,
        title: afterLvl.title,
        emoji: afterLvl.badgeEmoji,
      });
      setConfetti((n) => n + 1);
    }
  }

  function handleResetXp() {
    resetXp();
    setLevelUpPopup(null);
  }

  const ready = hasProfile(profile);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-6 lg:px-8 lg:py-10">
      <BackLink className="mb-3" />
      <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-4xl">
        내 프로필
      </h1>
      <p className="mt-1 text-sm text-muted">
        월급을 한 번만 넣어두면, 홈·계산기가 전부 <b>내 얘기</b>로 바뀌어요.
      </p>


      {/* 내 성취 기록 */}
      <AchievementsSection
        onTestXp={isDevToolsEnabled() ? handleTestXp : undefined}
        onResetXp={isDevToolsEnabled() ? handleResetXp : undefined}
      />

      {/* 입력 폼 — 저장값으로 seed하려고 hydrate 이후 마운트 */}
      {hydrated && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">내 지갑 설정</h2>
          <p className="mt-1 text-xs text-muted">
            내 세전 수입과 부양가족 정보를 토대로 실시간 세금 공제액을 추정해요.
          </p>
          <div className="mt-4">
            <ProfileForm
              initial={profile}
              onSave={handleSave}
              submitLabel={ready ? "수정하기" : "저장하기"}
            />
          </div>
        </div>
      )}

      {/* 내 숫자 요약 */}
      {hydrated && ready && <MyNumbers profile={profile} />}

      {/* 화면 — 라이트/다크/시스템. 데스크탑은 사이드바 하단에도 같은 컨트롤이 있음 */}
      <Card padding="md" className="mt-4">
        <p className="text-sm font-bold">화면</p>
        <p className="mt-0.5 text-xs text-muted">밝기를 골라두면 다음에도 기억해요.</p>
        <ThemeToggle className="mt-3" />
      </Card>

      <div className="mt-4 flex gap-2 rounded-xl bg-subtle p-4 text-xs leading-relaxed text-muted">
        <Info className="size-4 shrink-0 translate-y-0.5" />
        <p>
          입력값은 이 브라우저에만 저장돼요(서버 전송 없음). 모든 금액은{" "}
          <b>추정치예요</b> — 정확한 금액은 회사·국세청에서 확인하세요.
        </p>
      </div>

      <Confetti trigger={confetti} />

      {/* 레벨업 축하 모달 팝업 */}
      {levelUpPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl border-2 border-border bg-surface p-6 text-center shadow-card animate-in zoom-in-95 duration-200 flex flex-col items-center">
            <p className="text-4xl">🎉</p>
            <h3 className="mt-2 text-2xl font-extrabold text-foreground">레벨 업!</h3>
            <p className="mt-1 text-sm text-muted">
              축하합니다! 나의 경제 등급이 상승했어요.
            </p>

            {/* 새 등급 마스코트 일러스트 */}
            <div className="my-5 flex h-32 w-32 items-end justify-center rounded-2xl bg-subtle/30 border border-brand-500/10 p-3">
              <MascotImage
                variant={`lv${levelUpPopup.newLevel}` as MascotVariant}
                className="max-h-full max-w-full object-contain h-auto w-auto"
              />
            </div>

            {/* 칭호 변경 정보 */}
            <div className="rounded-xl bg-brand-500/10 px-4 py-2.5 text-sm font-extrabold text-brand-700">
              <span className="text-base mr-1">{levelUpPopup.emoji}</span>
              Lv.{levelUpPopup.newLevel} {levelUpPopup.title}
            </div>

            <p className="mt-3 text-xs text-muted/70">
              지갑을 똑똑하게 사수할 준비가 완료되었습니다!
            </p>

            {/* 닫기 확인 버튼 */}
            <button
              type="button"
              onClick={() => setLevelUpPopup(null)}
              className="mt-6 w-full rounded-xl bg-brand-600 py-3 text-sm font-bold text-white shadow-[0_3px_0_0_#1d4ed8] hover:bg-brand-700 active:translate-y-[2px] active:shadow-[0_1px_0_0_#1d4ed8] transition-all"
            >
              지갑 계속 지키기 🪙
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function MyNumbers({ profile }: { profile: Profile }) {
  const t = profileTakeHome(profile);
  const insurance =
    t.nationalPension + t.healthInsurance + t.longTermCare + t.employment;

  return (
    <Card highlight padding="lg" className="mt-4">
      <p className="text-sm font-semibold text-brand-600">이번 달 내 숫자 (추정)</p>
      <p className="mt-1 text-3xl font-bold tabular-nums">{formatWon(t.net)}</p>
      <p className="mt-1 text-sm text-muted">월 실수령액</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Mini label="4대 보험" value={insurance} />
        <Mini label="세금(소득·지방)" value={t.incomeTax + t.localIncomeTax} />
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {QUICK_TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:border-brand-400 hover:bg-brand-500/5"
          >
            <span>{tool.label}</span>
            <ArrowRight className="size-4 text-brand-600" />
          </Link>
        ))}
      </div>
    </Card>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-base font-bold tabular-nums">− {formatWon(value)}</p>
    </div>
  );
}
