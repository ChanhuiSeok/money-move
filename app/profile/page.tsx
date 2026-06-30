"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { MascotBubble } from "@/components/mascot/MascotBubble";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import { formatWon } from "@/lib/format";
import { hasProfile, profileTakeHome } from "@/lib/profile";
import type { Profile } from "@/lib/schema";
import { useProfile } from "@/store/useProfile";

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

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  function handleSave(next: Profile) {
    save(next);
    setJustSaved(true);
  }

  const ready = hasProfile(profile);

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-5 py-6 lg:max-w-2xl lg:px-8 lg:py-8">
      <BackLink className="mb-2" />
      <h1 className="text-2xl font-bold tracking-tight">내 프로필</h1>
      <p className="mt-1 text-sm text-muted">
        월급을 한 번만 넣어두면, 홈·계산기가 전부 <b>내 얘기</b>로 바뀌어요.
      </p>

      <MascotBubble
        mood={justSaved ? "happy" : "idle"}
        message={
          justSaved
            ? "좋아요, 내 숫자가 준비됐어요!"
            : "세전 월급만 알면 충분해요. 나머지는 비워둬도 돼요."
        }
        className="mt-4"
      />

      {/* 입력 폼 — 저장값으로 seed하려고 hydrate 이후 마운트 */}
      {hydrated && (
        <div className="mt-4">
          <ProfileForm
            initial={profile}
            onSave={handleSave}
            submitLabel={ready ? "수정하기" : "저장하기"}
          />
        </div>
      )}

      {/* 내 숫자 요약 */}
      {hydrated && ready && <MyNumbers profile={profile} />}

      <div className="mt-4 flex gap-2 rounded-xl bg-subtle p-4 text-xs leading-relaxed text-muted">
        <Info className="size-4 shrink-0 translate-y-0.5" />
        <p>
          입력값은 이 브라우저에만 저장돼요(서버 전송 없음). 모든 금액은{" "}
          <b>추정치예요</b> — 정확한 금액은 회사·국세청에서 확인하세요.
        </p>
      </div>
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
