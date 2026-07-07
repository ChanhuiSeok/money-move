import { notFound } from "next/navigation";
import { ExamSheet } from "@/components/exam/ExamSheet";
import { getExamById } from "@/content/exams";

export default async function ExamSheetPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;
  const exam = getExamById(examId);
  if (!exam) notFound();
  return <ExamSheet exam={exam} />;
}
