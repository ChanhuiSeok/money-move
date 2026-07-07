import { AchievementsView } from "@/components/achievements/AchievementsView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "성취",
  description: "연속 출석, XP, 배지까지 — 지금까지 쌓은 학습 기록을 한눈에 봐요.",
  path: "/achievements",
});

export default function AchievementsPage() {
  return <AchievementsView />;
}
