import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamSheet } from "@/components/exam/ExamSheet";
import { getExamById } from "@/content/exams";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ examId: string }>;
}): Promise<Metadata> {
  const { examId } = await params;
  const exam = getExamById(examId);
  if (!exam) return {};
  return pageMetadata({
    title: exam.title,
    description: exam.subtitle,
    path: `/exams/${exam.id}`,
  });
}

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
