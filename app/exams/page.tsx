import { ExamList } from "@/components/exam/ExamList";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "모의고사",
  description: "배운 내용을 회차별 모의고사로 점검해요. 채점과 풀이까지 바로 확인.",
  path: "/exams",
});

export default function ExamsPage() {
  return <ExamList />;
}
