import { Info } from "lucide-react";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import { NewsList } from "@/components/news/NewsList";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "경제뉴스",
  description: "주식·코스피·금리·환율·부동산까지, 주제별로 골라보는 오늘의 경제 뉴스.",
  path: "/news",
});

export default function NewsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-6 lg:px-8 lg:py-10">
      <BackLink className="mb-3" />
      <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-4xl">
        오늘의 경제뉴스
      </h1>
      <p className="mt-1 text-sm text-muted">
        최신 경제 소식을 한눈에. 제목을 누르면 기사로 이동해요.
      </p>

      <Card padding="md" className="mt-4">
        <NewsList withTopics showDescription />
      </Card>

      <div className="mt-4 flex gap-2 rounded-xl bg-subtle p-4 text-xs leading-relaxed text-muted">
        <Info className="size-4 shrink-0 translate-y-0.5" />
        <p>
          네이버 검색 뉴스에서 ‘경제’ 키워드로 가져온 최신순 결과예요. 기사 내용은
          각 언론사의 것이며, 머니무브는 학습 참고용으로 보여드려요.
        </p>
      </div>
    </main>
  );
}
