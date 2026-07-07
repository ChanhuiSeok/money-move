import type { Metadata } from "next";
import { tools } from "@/content/tools";
import { pageMetadata } from "@/lib/seo";

const tool = tools.find((t) => t.href === "/tools/tax-simulator")!;

export const metadata: Metadata = pageMetadata({
  title: tool.title,
  description: tool.desc,
  path: tool.href,
});

export default function TaxSimulatorToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
