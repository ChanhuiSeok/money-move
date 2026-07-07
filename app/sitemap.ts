import type { MetadataRoute } from "next";
import { exams } from "@/content/exams";
import { allLessons } from "@/content/lessons";
import { scenarios } from "@/content/scenarios";
import { tools } from "@/content/tools";
import { SITE_URL } from "@/lib/seo";

/** 개인 진도(localStorage)와 무관한 공용 라우트만. /profile은 입력 폼일 뿐 개인 데이터를
   서버가 갖고 있지 않아 포함해도 안전하다. */
const STATIC_PATHS: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/learn", priority: 0.9, changeFrequency: "weekly" },
  { path: "/exams", priority: 0.7, changeFrequency: "weekly" },
  { path: "/tools", priority: 0.8, changeFrequency: "monthly" },
  { path: "/glossary", priority: 0.7, changeFrequency: "weekly" },
  { path: "/news", priority: 0.6, changeFrequency: "daily" },
  { path: "/achievements", priority: 0.3, changeFrequency: "monthly" },
  { path: "/search", priority: 0.3, changeFrequency: "monthly" },
  { path: "/diagnostic", priority: 0.5, changeFrequency: "monthly" },
  { path: "/profile", priority: 0.3, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  const toolEntries: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${SITE_URL}${tool.href}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const lessonEntries: MetadataRoute.Sitemap = allLessons.map((lesson) => ({
    url: `${SITE_URL}/learn/${lesson.id}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const examEntries: MetadataRoute.Sitemap = exams.map((exam) => ({
    url: `${SITE_URL}/exams/${exam.id}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const scenarioEntries: MetadataRoute.Sitemap = scenarios.map((scenario) => ({
    url: `${SITE_URL}/start/${scenario.id}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticEntries,
    ...toolEntries,
    ...lessonEntries,
    ...examEntries,
    ...scenarioEntries,
  ];
}
