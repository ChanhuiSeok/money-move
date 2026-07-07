import { LearnPath } from "@/components/path/LearnPath";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "학습",
  description:
    "가입 없이 바로 시작하는 금융 레슨. 월급명세서·4대 보험·소득공제·연금까지 한 입씩 배워요.",
  path: "/learn",
});

export default function LearnPage() {
  return <LearnPath />;
}
