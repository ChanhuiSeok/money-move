import type { Metadata } from "next";
import { getScenarioById } from "@/content/scenarios";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ scenarioId: string }>;
}): Promise<Metadata> {
  const { scenarioId } = await params;
  const scenario = getScenarioById(scenarioId);
  if (!scenario) return {};
  return pageMetadata({
    title: scenario.title,
    description: scenario.blurb,
    path: `/start/${scenario.id}`,
  });
}

export default function StartScenarioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
