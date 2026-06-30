import type { Lesson } from "@/lib/schema";

export const riskDiversification: Lesson = {
  id: "risk-diversification",
  unitId: "u-invest-2",
  order: 2,
  title: "투자 위험, 분산으로 줄이기",
  durationMin: 5,
  intro:
    "투자는 '더 벌 수 있다'와 '잃을 수도 있다'가 한 묶음이에요. 이 둘은 떼어 낼 수 없죠.\n그래서 위험을 0으로 만드는 게 아니라, [분산투자](term:diversification)로 '견딜 만하게' 줄이는 게 핵심이에요.",
  glossary: ["diversification", "volatility"],
  questions: [
    {
      type: "ox",
      prompt:
        "한 회사 주식에만 전 재산을 넣는 것보다, 여러 회사·자산에 나눠 담으면 한 곳이 무너졌을 때의 충격을 줄일 수 있다?",
      answer: true,
      explanation:
        "맞아요. 이게 [분산투자](term:diversification)예요. '계란을 한 바구니에 담지 말라'는 말처럼, 한 곳이 크게 빠져도 다른 곳이 버텨 주면 전체 손실이 작아져요. 다만 분산해도 시장 전체가 함께 내리는 위험까지 0으로 만들 수는 없어요.",
    },
    {
      type: "choice",
      prompt: "[변동성](term:volatility)이 크다는 건 무슨 뜻일까요?",
      options: [
        "가격이 무조건 오르기만 한다",
        "거래 수수료가 비싸다",
        "가격이 위아래로 출렁이는 폭이 크다 — 더 벌 수도, 더 잃을 수도 있다",
        "그 회사가 곧 망한다는 뜻이다",
      ],
      answerIndex: 2,
      explanation:
        "[변동성](term:volatility)은 가격이 오르내리는 폭이에요. 크면 짧은 기간에 크게 오를 수도, 크게 빠질 수도 있죠. '변동성이 크다 = 무조건 나쁘다'가 아니라 '불확실성(위험)이 크다'는 뜻이라, 내가 견딜 수 있는 정도인지 보는 게 중요해요.",
    },
    {
      type: "ox",
      prompt:
        "'기대수익이 높다'고 알려진 투자일수록, 그만큼 원금을 잃을 위험도 대체로 함께 커진다?",
      answer: true,
      explanation:
        "일반적으로 더 높은 수익을 노릴수록 위험(원금 손실 가능성·[변동성](term:volatility))도 함께 커지는 경향이 있어요. 이걸 '위험과 수익의 맞교환'이라고 해요. 그래서 '위험은 거의 없는데 수익만 아주 높다'고 약속하는 건 의심해 봐야 해요 — 사기일 가능성이 높거든요.",
    },
  ],
};
