import type { GlossaryTerm } from "@/lib/schema";

/** 용어 사전. 본문에서 `[표시어](term:id)`로 참조하면 밑줄+말풍선으로 풀이된다.
   short는 한 입 설명(말풍선용), full은 사전 페이지(Task 2.3)용 상세. */
export const glossaryTerms: GlossaryTerm[] = [
  // ── 레벨 1: 돈의 기초 ──
  {
    id: "fixed-expense",
    term: "고정지출",
    short: "매달 정해진 날, 비슷한 금액으로 빠져나가는 지출. 월세·통신비·구독료처럼 예측할 수 있어요.",
  },
  {
    id: "variable-expense",
    term: "변동지출",
    short: "그때그때 달라지는 지출. 외식·쇼핑·여행처럼 내가 조절하기 쉬운 돈이에요.",
  },
  {
    id: "emergency-fund",
    term: "비상금",
    short: "갑작스러운 일(병원비·수리비 등)에 대비해 따로 모아두는 돈. 흔히 3~6개월치 생활비를 목표로 해요.",
  },
  {
    id: "budget",
    term: "예산",
    short: "쓸 돈을 미리 정해두는 계획. 들어올 돈 안에서 어디에 얼마 쓸지 나눠두는 거예요.",
  },

  // ── 레벨 2: 세금과 공제 ──
  {
    id: "take-home-pay",
    term: "실수령액",
    short: "세금과 4대 보험을 떼고 실제로 통장에 들어오는 돈이에요. '세후 월급'이라고도 해요.",
  },
  {
    id: "gross-pay",
    term: "세전 월급",
    short: "세금·보험료를 떼기 전, 받기로 한 원래 금액이에요. 명세서 맨 위에 적혀 있어요.",
  },
  {
    id: "withholding",
    term: "원천징수",
    short: "회사가 월급을 줄 때 세금을 미리 떼어 나라에 대신 내주는 것. 그래서 통장엔 세후 금액이 들어와요.",
  },
  {
    id: "four-major-insurance",
    term: "4대 보험",
    short: "국민연금·건강보험·고용보험·산재보험. 매달 월급에서 빠지지만, 노후·병원·실직을 대비하는 안전망이에요.",
  },
  {
    id: "national-pension",
    term: "국민연금",
    short: "노후에 매달 연금으로 돌려받기 위해 일하는 동안 쌓아두는 돈이에요.",
  },
  {
    id: "health-insurance",
    term: "건강보험",
    short: "아플 때 병원비 부담을 크게 줄여주는 보험. 모두가 함께 부담해 서로를 돕는 구조예요.",
  },
  {
    id: "employment-insurance",
    term: "고용보험",
    short: "실직했을 때 실업급여 등으로 다시 일어설 수 있게 도와주는 보험이에요.",
  },
  {
    id: "income-tax",
    term: "소득세",
    short: "번 돈에 매겨지는 세금. 많이 벌수록 더 높은 비율이 적용되는 구조예요.",
  },
  {
    id: "income-deduction",
    term: "소득공제",
    short: "세금을 매기는 '기준 소득'을 줄여주는 것. 기준이 줄면 세금도 줄어요.",
  },
  {
    id: "tax-credit",
    term: "세액공제",
    short: "이미 계산된 세금에서 직접 빼주는 것. 깎이는 효과가 더 직접적이에요.",
  },
  {
    id: "year-end-settlement",
    term: "연말정산",
    short: "1년간 떼인 세금과 실제 낼 세금을 비교해, 더 냈으면 돌려주고 덜 냈으면 더 걷는 정산이에요.",
  },

  // ── 레벨 3: 투자 첫걸음 ──
  {
    id: "stock",
    term: "주식",
    short: "회사의 소유권을 잘게 나눈 조각. 한 주를 사면 그 회사의 아주 작은 주인이 돼요.",
  },
  {
    id: "shareholder",
    term: "주주",
    short: "주식을 가진 사람. 가진 만큼 회사의 부분 주인이에요.",
  },
  {
    id: "dividend",
    term: "배당",
    short: "회사가 번 이익의 일부를 주주에게 나눠 주는 돈. 회사가 결정할 때만, 보통 1년에 한두 번 들어와요.",
  },
  {
    id: "capital-gain",
    term: "시세차익",
    short: "산 가격보다 비싸게 팔아 생기는 이익. 실제로 팔아야(매도해야) 손에 들어와요.",
  },
  {
    id: "brokerage-account",
    term: "증권계좌",
    short: "주식을 사고팔려고 증권사에 만드는 계좌. 은행 계좌와는 따로예요.",
  },
  {
    id: "deposit-balance",
    term: "예수금",
    short: "증권계좌에 들어 있는, 아직 주식을 사지 않은 현금. 이 돈으로 주문을 넣어요.",
  },
  {
    id: "settlement-cycle",
    term: "결제일(T+2)",
    short: "거래가 실제로 정산되는 날. 한국 주식은 체결 뒤 영업일 기준 이틀 뒤(T+2)에 결제돼요.",
  },
  {
    id: "buy-order",
    term: "매수",
    short: "주식을 사는 것. 가진 예수금 안에서 주문해요.",
  },
  {
    id: "sell-order",
    term: "매도",
    short: "주식을 파는 것. 그 가격에 사 줄 사람이 있어야 거래가 성사돼요.",
  },
  {
    id: "quote",
    term: "호가",
    short: "사거나 팔려고 시장에 내놓은 가격. 사려는 값(매수호가)과 팔려는 값(매도호가)이 있어요.",
  },
  {
    id: "execution",
    term: "체결",
    short: "사려는 가격과 팔려는 가격이 맞아 거래가 실제로 성사되는 것. '주문'과는 달라요.",
  },
  {
    id: "market-order",
    term: "시장가 주문",
    short: "가격을 정하지 않고 '지금 시세로 바로' 사고파는 주문. 빨리 체결되지만 체결 가격은 들쭉날쭉할 수 있어요.",
  },
  {
    id: "limit-order",
    term: "지정가 주문",
    short: "'이 가격에만' 사고팔겠다고 가격을 정해 내는 주문. 가격은 지키지만 체결이 안 될 수도 있어요.",
  },
  {
    id: "volatility",
    term: "변동성",
    short: "가격이 오르내리는 폭. 클수록 더 벌 수도, 더 잃을 수도 있는 불확실성(위험)이 커요.",
  },
  {
    id: "diversification",
    term: "분산투자",
    short: "여러 회사·자산에 나눠 담아 한 곳이 무너졌을 때의 충격을 줄이는 것.",
  },
  {
    id: "deposit-insurance",
    term: "예금자보호",
    short: "은행 예금 등을 일정 한도까지 지켜 주는 제도. 주식 같은 투자 상품은 대상이 아니에요.",
  },
  {
    id: "etf",
    term: "ETF",
    short: "여러 종목을 한 바구니에 담아 거래소에서 주식처럼 사고파는 상품. 한 주만 사도 분산 효과가 있어요.",
  },

  // ── 레벨 4: 투자, 한 걸음 더 ──
  {
    id: "base-rate",
    term: "기준금리",
    short: "중앙은행(한국은행·미국 연준)이 정하는 기준이 되는 금리. 이걸 올리고 내리면 예금·대출·투자 전반이 따라 움직여요.",
  },
  {
    id: "bond",
    term: "채권",
    short: "정부·기업이 돈을 빌리며 '언제까지 이자 얼마 주겠다'고 약속한 증서. 가격은 시중 금리와 반대로 움직여요.",
  },
  {
    id: "growth-stock",
    term: "성장주",
    short: "지금의 이익보다 '미래의 큰 성장'을 기대고 거래되는 주식. 금리 변화에 더 민감한 편이에요.",
  },
  {
    id: "exchange-rate",
    term: "환율",
    short: "두 나라 돈의 교환 비율. '원/달러 환율이 오른다'는 건 같은 1달러에 더 많은 원이 든다 = 원화 가치가 떨어진다는 뜻이에요.",
  },
  {
    id: "inflation",
    term: "물가 상승(인플레이션)",
    short: "물건·서비스 값이 전반적으로 오르는 것. 같은 돈으로 살 수 있는 게 줄어드니 '돈의 가치'가 떨어지는 셈이에요.",
  },

  // ── 레벨 5: 전세·월세·내 집 ──
  {
    id: "jeonse",
    term: "전세",
    short: "매달 월세 없이, 큰 보증금을 맡기고 집을 빌리는 한국 특유의 방식. 계약이 끝나면 보증금을 그대로 돌려받아요.",
  },
  {
    id: "wolse",
    term: "월세",
    short: "비교적 적은 보증금에 더해, 매달 임대료(월세)를 내고 집을 빌리는 방식이에요.",
  },
  {
    id: "rental-deposit",
    term: "보증금",
    short: "집을 빌릴 때 집주인에게 맡겨 두는 돈. 계약이 끝나면 돌려받아요. 전세는 크고, 월세는 작은 편이에요.",
  },
  {
    id: "jeonse-loan",
    term: "전세대출",
    short: "전세 보증금을 마련하려고 받는 대출. 빌린 만큼 매달 이자를 내요(그래서 전세도 '공짜'는 아니에요).",
  },
  {
    id: "move-in-report",
    term: "전입신고",
    short: "이사한 집 주소로 거주를 신고하는 것. 확정일자와 함께 해두면 보증금을 지키는 '대항력'이 생겨요.",
  },
  {
    id: "confirmed-date",
    term: "확정일자",
    short: "임대차 계약서에 공적으로 날짜 도장을 받는 것. 집이 경매로 넘어가도 보증금을 먼저 돌려받을 순위가 생겨요.",
  },
  {
    id: "jeonse-guarantee",
    term: "전세보증보험",
    short: "집주인이 보증금을 안 돌려줄 때 보증기관이 대신 돌려주는 보험. 전세 사기·깡통전세 위험을 덜어 줘요.",
  },
  {
    id: "housing-subscription",
    term: "주택청약종합저축",
    short: "새로 분양하는 아파트에 청약(신청)할 자격을 만드는 저축 통장. 무주택자는 소득공제 혜택도 있어요.",
  },
  {
    id: "homeless-householder",
    term: "무주택 세대주",
    short: "집을 한 채도 갖지 않은 세대의 대표. 청약·전세 관련 혜택의 흔한 조건이에요.",
  },
];

const byId = new Map(glossaryTerms.map((t) => [t.id, t]));

export function getTerm(id: string): GlossaryTerm | undefined {
  return byId.get(id);
}
