import { GlossaryBook } from "@/components/glossary/GlossaryBook";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "용어사전",
  description: "실수령액, 세액공제, ETF까지 — 헷갈리는 금융 용어를 쉬운 말로 찾아봐요.",
  path: "/glossary",
});

export default function GlossaryPage() {
  return <GlossaryBook />;
}
