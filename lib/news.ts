/** 오늘의 경제뉴스 — 네이버 검색 API 응답을 다루는 순수 헬퍼.
   네트워크 호출(키 사용)은 서버 라우트(app/api/news)에서만 한다. */

export type NewsItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string; // 원본 RFC1123 문자열
};

/** 네이버 뉴스 검색 item 원형. */
export type RawNaverNewsItem = {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
};

const ENTITIES: Record<string, string> = {
  "&quot;": '"',
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

/** 검색 결과의 <b> 강조 태그·기타 태그를 벗기고 HTML 엔티티를 디코드한다. */
export function cleanNewsText(s: string): string {
  return s
    .replace(/<[^>]+>/g, "") // <b> 등 모든 태그 제거
    .replace(/&[#a-z0-9]+;/gi, (m) => ENTITIES[m.toLowerCase()] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

/** 원형 item → 화면용 NewsItem (텍스트 정리, 링크 선택). */
export function toNewsItem(raw: RawNaverNewsItem): NewsItem {
  return {
    title: cleanNewsText(raw.title),
    link: raw.link || raw.originallink,
    description: cleanNewsText(raw.description),
    pubDate: raw.pubDate,
  };
}

/** 뉴스 토픽(태그). 각 토픽은 네이버 검색에 던질 query를 가진다. 첫 항목이 기본. */
export type NewsTopic = { id: string; label: string; query: string };

export const newsTopics: NewsTopic[] = [
  { id: "all", label: "전체", query: "경제" },
  { id: "stock", label: "주식", query: "주식" },
  { id: "kospi", label: "코스피", query: "코스피" },
  { id: "us", label: "미국증시", query: "미국증시" },
  { id: "rate", label: "금리", query: "기준금리" },
  { id: "fx", label: "환율", query: "환율" },
  { id: "realty", label: "부동산", query: "부동산" },
  { id: "crypto", label: "코인", query: "비트코인" },
];

/** 토픽 id로 검색 query를 고른다. 모르는 id면 기본(전체=경제). */
export function topicQuery(id: string | null | undefined): string {
  return (newsTopics.find((t) => t.id === id) ?? newsTopics[0]).query;
}

/** 홈 '여러 주제 섞기' 피드에 쓸 검색어들(다양성 위해 핵심 주제만). */
export const mixedQueries: string[] = [
  "경제",
  "주식",
  "코스피",
  "미국증시",
  "금리",
  "부동산",
];

/** 발행시각(ms). 파싱 불가면 0(맨 뒤로). */
function pubMillis(pubDate: string): number {
  const t = Date.parse(pubDate);
  return Number.isNaN(t) ? 0 : t;
}

/** 여러 토픽 결과를 합쳐 최신순으로 정렬하고 같은 기사를 제거한다(제목 기준). */
export function mergeNewsItems(lists: NewsItem[][]): NewsItem[] {
  const flat = lists.flat();
  flat.sort((a, b) => pubMillis(b.pubDate) - pubMillis(a.pubDate)); // 최신순
  const seen = new Set<string>();
  const out: NewsItem[] = [];
  for (const item of flat) {
    const key = item.title.toLowerCase().replace(/\s+/g, "") || item.link;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

/** 발행시각을 '방금 전/N시간 전/M.D' 같은 상대 표기로. (now 주입 → 순수·테스트 가능) */
export function formatNewsDate(pubDate: string, now: number = Date.now()): string {
  const t = Date.parse(pubDate);
  if (Number.isNaN(t)) return "";
  const diffMin = Math.floor((now - t) / 60_000);
  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}시간 전`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}일 전`;
  const d = new Date(t);
  return `${d.getMonth() + 1}.${d.getDate()}`;
}
