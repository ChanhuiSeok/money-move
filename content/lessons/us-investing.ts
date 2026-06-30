import type { Lesson } from "@/lib/schema";

export const usInvesting: Lesson = {
  id: "us-investing",
  unitId: "u-macro-2",
  order: 1,
  title: "미국 주식, 뭐가 다를까",
  durationMin: 5,
  intro:
    "요즘은 미국 주식에 투자하기도 쉬워졌어요. 그런데 국내 주식과 다른 점이 꽤 있어요 — 특히 [환율](term:exchange-rate)과 세금이요.\n신나서 사기 전에, 한국 주식과 '뭐가 다른지'부터 짚어 볼게요.",
  glossary: ["exchange-rate", "capital-gain", "withholding", "dividend"],
  questions: [
    {
      type: "ox",
      prompt:
        "국내 주식은 소액주주의 매매차익에 보통 세금이 없지만, 미국 같은 해외 주식의 매매차익([시세차익](term:capital-gain))에는 양도소득세가 매겨진다?",
      answer: true,
      explanation:
        "맞아요. 국내 상장주식은 일반 소액주주라면 매매차익에 양도세가 없어요. 반면 해외 주식 매매차익은 1년치를 합쳐 기본공제 250만 원을 뺀 나머지에 22%(지방세 포함)의 양도소득세가 붙고, 직접 신고해야 해요. (세율·공제는 바뀔 수 있어 국세청에서 확인하세요.)",
    },
    {
      type: "choice",
      prompt:
        "미국 주식에 투자할 때, 국내 주식과 달리 '하나 더' 신경 써야 하는 것으로 가장 알맞은 건?",
      options: [
        "주식을 한 주 단위로만 살 수 있다는 점",
        "배당을 절대 받을 수 없다는 점",
        "원화를 달러로 바꾸는 환전과 환율 변동",
        "한국 시간 오전 9시에만 거래된다는 점",
      ],
      answerIndex: 2,
      explanation:
        "미국 주식은 달러로 거래돼서 환전(또는 증권사의 원화 주문 서비스)이 필요하고, [환율](term:exchange-rate)에 따라 같은 주가라도 내 수익이 달라져요. 거래 시간도 한국 기준 밤(서머타임 땐 밤 10:30~새벽 5시쯤)이라 국내장과 달라요.",
    },
    {
      type: "ox",
      prompt:
        "미국 주식에서 받는 [배당](term:dividend)금은, 미국에서 세금을 먼저 떼고([원천징수](term:withholding)) 들어오는 경우가 많다?",
      answer: true,
      explanation:
        "맞아요. 미국 주식 배당은 보통 현지에서 15%를 먼저 떼고([원천징수](term:withholding)) 입금돼요(한·미 조세조약 기준). 그래서 통장에 들어오는 배당은 회사가 발표한 금액보다 적을 수 있어요.",
    },
  ],
};
