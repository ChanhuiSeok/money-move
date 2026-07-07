import type { Metadata } from "next";
import { tools } from "@/content/tools";
import { pageMetadata } from "@/lib/seo";

const tool = tools.find((t) => t.href === "/tools/take-home")!;

export const metadata: Metadata = pageMetadata({
  title: tool.title,
  description: tool.desc,
  path: tool.href,
});

export default function TakeHomeToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
