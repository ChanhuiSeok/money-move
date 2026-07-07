import type { Metadata } from "next";

export const SITE_NAME = "머니무브";

/** 실제 도메인이 정해지면 배포 환경에 NEXT_PUBLIC_SITE_URL을 넣어 덮어쓴다. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://donpath.vercel.app";

/** 긴 본문을 메타 description 길이(기본 140자)로 자른다. */
export function truncate(text: string, max = 140): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1).trimEnd()}…`;
}

/** 페이지별 title/description으로 canonical·OG·트위터 카드까지 한 번에 채운다.
   nested 필드(openGraph 등)는 Next가 부모와 얕게 병합만 하고 통째로 덮어쓰므로,
   페이지마다 매번 새로 채워줘야 값이 유실되지 않는다. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const socialTitle = path === "/" ? title : `${title} · ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
    },
  };
}
