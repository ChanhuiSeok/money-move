import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import { getLessonById } from "@/content/lessons";
import { richTextToPlain } from "@/lib/richtext";
import { pageMetadata, truncate } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);
  if (!lesson) return {};
  return pageMetadata({
    title: lesson.title,
    description: truncate(richTextToPlain(lesson.intro)),
    path: `/learn/${lesson.id}`,
  });
}

export default async function LessonPlayerPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);
  if (!lesson) notFound();
  return <LessonPlayer lesson={lesson} />;
}
