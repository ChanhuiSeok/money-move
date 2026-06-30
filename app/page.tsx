import { Suspense } from "react";
import { HomeDashboard } from "@/components/home/HomeDashboard";

export default function HomePage() {
  // HomeDashboard가 useSearchParams(시즌 미리보기 토글)를 쓰므로 Suspense로 감싼다.
  return (
    <Suspense>
      <HomeDashboard />
    </Suspense>
  );
}
