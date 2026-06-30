import {
  Home,
  PiggyBank,
  Receipt,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/** 라이프 이벤트 진입점. "지금 내 상황"에서 관련 레슨+도구를 한 묶음으로.
   금융은 사건 기반으로 소비되니, 선형 트리와 별개로 상황에서 바로 들어오게 한다.
   lessonIds·tools는 기존 콘텐츠/계산기를 가리키기만 한다(중복 정의 없음). */

export type ScenarioTool = { href: string; label: string };

export type Scenario = {
  id: string;
  icon: LucideIcon;
  title: string; // "첫 월급 받았어요"
  blurb: string; // 카드용 한 줄
  intro: string; // 상세 상단 안내(2~3문장)
  lessonIds: string[];
  tools: ScenarioTool[];
};

export const scenarios: Scenario[] = [
  {
    id: "first-paycheck",
    icon: Wallet,
    title: "첫 월급 받았어요",
    blurb: "월급명세서·4대 보험·실수령액 한 번에",
    intro:
      "축하해요! 첫 월급, 생각보다 적게 들어와서 놀랐죠? 명세서에서 뭐가 빠져나갔는지, 통장에 실제로 얼마가 들어오는지부터 같이 봐요.",
    lessonIds: ["payslip-basics", "four-insurances", "budget-basics"],
    tools: [
      { href: "/tools/take-home", label: "실수령액 계산기" },
      { href: "/profile", label: "내 월급 넣어두기" },
    ],
  },
  {
    id: "year-end-tax",
    icon: Receipt,
    title: "연말정산 시즌이에요",
    blurb: "공제 챙기고 13월의 월급 받기",
    intro:
      "연말정산은 어렵게 느껴지지만, 핵심은 '소득공제'와 '세액공제' 두 가지예요. 내 공제 항목을 넣어 환급액이 어떻게 바뀌는지 눈으로 확인해봐요.",
    lessonIds: ["deduction-vs-credit", "year-end-tax"],
    tools: [
      { href: "/tools/tax-simulator", label: "연말정산 시뮬레이터" },
      { href: "/tools/pension-credit", label: "연금저축·IRP 세액공제" },
    ],
  },
  {
    id: "saving-habit",
    icon: PiggyBank,
    title: "돈을 모으고 싶어요",
    blurb: "예산·비상금·복리로 굴리기",
    intro:
      "모으기의 시작은 '내 돈이 어디로 가는지' 아는 거예요. 예산과 비상금을 잡고, 꾸준히 모으면 복리로 얼마까지 불어나는지 가늠해봐요.",
    lessonIds: ["income-expense", "budget-basics", "emergency-saving"],
    tools: [{ href: "/tools/compound", label: "복리 계산기" }],
  },
  {
    id: "start-investing",
    icon: TrendingUp,
    title: "첫 투자 하려고요",
    blurb: "주식·계좌·분산투자 기초부터",
    intro:
      "투자는 '원리'부터 알면 덜 무서워요. 주식이 뭔지, 계좌는 어떻게 여는지, 위험을 어떻게 나누는지 차근차근 봐요. (종목 추천은 하지 않아요.)",
    lessonIds: [
      "stock-basics",
      "brokerage-account",
      "buy-sell-order",
      "risk-diversification",
    ],
    tools: [{ href: "/tools/compound", label: "복리 계산기" }],
  },
  {
    id: "finding-home",
    icon: Home,
    title: "집 구해요",
    blurb: "전세·월세·청약, 보증금 지키기",
    intro:
      "독립이든 이사든, 집은 큰돈이 오가는 일이에요. 전세와 월세 중 뭐가 나은지, 보증금은 어떻게 지키는지, 청약은 뭔지 차근차근 챙겨봐요.",
    lessonIds: ["jeonse-wolse", "housing-subscription"],
    tools: [{ href: "/tools/rent-vs-jeonse", label: "전세 vs 월세 비교" }],
  },
];

const byId = new Map(scenarios.map((s) => [s.id, s]));

export function getScenarioById(id: string): Scenario | undefined {
  return byId.get(id);
}
