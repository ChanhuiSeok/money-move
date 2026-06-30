/** 시즌 모드 — "필요한 때 거기 있기".
   오늘 날짜(월)에 따라 홈 상단에 띄울 시즌 안내를 고른다.
   렌더 중 new Date() 같은 impure 호출을 피하려 todayKey 문자열(YYYY-MM-DD)을 받는 순수 함수. */

export type Season = {
  id: string;
  title: string; // 배너 제목
  message: string; // 한 줄 설명
  ctaHref: string;
  ctaLabel: string;
};

/** "YYYY-MM-DD"에서 월(1~12)을 뽑는다. 형식이 어긋나면 0. */
function monthOf(todayKey: string): number {
  const m = /^\d{4}-(\d{2})-\d{2}$/.exec(todayKey);
  return m ? Number(m[1]) : 0;
}

const YEAR_END_SEASON: Season = {
  id: "year-end",
  title: "연말정산 시즌이에요",
  message: "공제 항목 넣고 ‘13월의 월급’ 환급액을 미리 확인해봐요.",
  ctaHref: "/start/year-end-tax",
  ctaLabel: "연말정산 준비하기",
};

const YEAR_END_PREP_SEASON: Season = {
  id: "year-end-prep",
  title: "올해가 가기 전에",
  message: "연말 전에 챙기면 내년 환급이 달라져요. 공제 항목을 미리 점검해봐요.",
  ctaHref: "/tools/tax-simulator",
  ctaLabel: "공제 미리 점검하기",
};

/** 오늘 날짜에 맞는 시즌. 없으면 null(평상시 홈). */
export function currentSeason(todayKey: string): Season | null {
  const month = monthOf(todayKey);
  if (month === 1 || month === 2) return YEAR_END_SEASON;
  if (month === 11 || month === 12) return YEAR_END_PREP_SEASON;
  return null;
}

/** id로 시즌을 찾는다(개발용 미리보기 오버라이드에서 사용). 없으면 null. */
export function getSeasonById(id: string | null | undefined): Season | null {
  if (id === YEAR_END_SEASON.id) return YEAR_END_SEASON;
  if (id === YEAR_END_PREP_SEASON.id) return YEAR_END_PREP_SEASON;
  return null;
}
