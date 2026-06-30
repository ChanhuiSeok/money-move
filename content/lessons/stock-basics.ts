import type { Lesson } from "@/lib/schema";

export const stockBasics: Lesson = {
  id: "stock-basics",
  unitId: "u-invest-1",
  order: 1,
  title: "주식이 뭐예요?",
  durationMin: 4,
  intro:
    "[주식](term:stock)은 회사를 잘게 나눈 '소유권 조각'이에요. 한 주를 사면 그 회사의 아주 작은 주인, 즉 [주주](term:shareholder)가 되죠.\n예금처럼 원금이 보장되진 않아요. 회사가 잘되면 이익을 나눠 받거나(배당) 비싸게 되팔 수 있고, 안되면 원금을 잃을 수도 있어요.",
  glossary: ["stock", "shareholder", "dividend", "capital-gain", "deposit-insurance", "sell-order"],
  questions: [
    {
      type: "choice",
      prompt: "[주식](term:stock) 한 주를 산다는 건, 정확히 무엇을 갖게 되는 걸까요?",
      options: [
        "회사에 돈을 빌려주고 정해진 이자를 받기로 한 것",
        "그 회사의 아주 작은 소유권(지분)을 갖게 된다",
        "회사 제품을 평생 싸게 사는 쿠폰",
        "은행 예금처럼 원금과 이자를 보장받는 증서",
      ],
      answerIndex: 1,
      explanation:
        "주식은 회사를 잘게 나눈 소유권(지분)이라, 사면 그 회사의 [주주](term:shareholder)가 돼요. 돈을 빌려주고 이자를 받는 건 '채권'이고, 주식은 회사의 일부를 갖는 거예요. 회사가 잘되면 [배당](term:dividend)이나 [시세차익](term:capital-gain)으로 이어질 수 있지만, 그만큼 원금 보장은 없어요.",
    },
    {
      type: "ox",
      prompt:
        "증권계좌로 산 주식도 은행 예금처럼 [예금자보호](term:deposit-insurance)를 받아, 값이 떨어져도 원금을 돌려받는다?",
      answer: false,
      explanation:
        "아니에요. [예금자보호](term:deposit-insurance)는 은행 예금 같은 상품을 지켜 주는 제도라, 투자 상품인 주식은 대상이 아니에요. 주가가 떨어져 생긴 손실은 아무도 보전해 주지 않아요. (참고로 증권사가 망해도 내 '주식 자체'는 따로 보관돼 남지만, 주가 하락 손실과는 다른 얘기예요.)",
    },
    {
      type: "choice",
      prompt:
        "내가 산 주식의 주가가 올랐어요. 그런데 그 이익이 통장에 바로 꽂히지 않는 이유로 가장 알맞은 건?",
      options: [
        "주가가 오르면 회사가 그만큼 현금을 보내 주기 때문",
        "오른 만큼 매일 자동으로 배당이 들어오기 때문",
        "주가는 한번 오르면 절대 떨어지지 않기 때문",
        "그 가격에 실제로 사 줄 사람에게 팔아야(매도해야) 이익이 '실현'되기 때문",
      ],
      answerIndex: 3,
      explanation:
        "주가가 올라 평가금액이 늘어도, 팔기 전까진 '평가상 이익'일 뿐이에요. 실제 이익은 [매도](term:sell-order)해서 누군가 그 가격에 사 줘야 [시세차익](term:capital-gain)으로 손에 들어와요. [배당](term:dividend)은 회사가 이익을 나눠 줄 때만, 그것도 보통 1년에 한두 번 들어오고요.",
    },
  ],
};
