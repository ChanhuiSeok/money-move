import { DiagnosticTest } from "@/components/diagnostic/DiagnosticTest";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "진단",
  description: "몇 가지 질문으로 내 경제 지식 수준을 확인하고, 딱 맞는 레슨부터 시작해요.",
  path: "/diagnostic",
});

export default function DiagnosticPage() {
  return <DiagnosticTest />;
}
