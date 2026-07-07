import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "내 프로필",
  description:
    "내 월급을 한 번 넣어두면 홈 화면과 계산기가 전부 내 얘기로 바뀌어요.",
  path: "/profile",
});

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
