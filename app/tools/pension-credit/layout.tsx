import type { Metadata } from "next";
import { tools } from "@/content/tools";
import { pageMetadata } from "@/lib/seo";

const tool = tools.find((t) => t.href === "/tools/pension-credit")!;

export const metadata: Metadata = pageMetadata({
  title: tool.title,
  description: tool.desc,
  path: tool.href,
});

export default function PensionCreditToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
