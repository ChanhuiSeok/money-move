import type { Lesson } from "@/lib/schema";

export const etfBasics: Lesson = {
  id: "etf-basics",
  unitId: "u-invest-3",
  order: 1,
  title: "ETF, 한 번에 여러 개",
  durationMin: 4,
  intro:
    "개별 종목 하나하나 고르기는 어렵고 위험도 커요. 그래서 많이 쓰는 게 [ETF](term:etf)예요.\n'한 바구니'를 한 주만 사도 분산이 되는 원리를, 그리고 그 한계까지 같이 볼게요.",
  glossary: ["etf", "diversification"],
  questions: [
    {
      type: "choice",
      prompt: "[ETF](term:etf)를 한 줄로 설명하면 가장 가까운 건?",
      options: [
        "원금과 이자를 보장해 주는 예금 상품",
        "여러 종목을 한 바구니에 담아, 거래소에서 주식처럼 사고파는 상품",
        "한 회사의 주식만 잔뜩 모아 둔 것",
        "정부가 직접 운영하는 복권",
      ],
      answerIndex: 1,
      explanation:
        "[ETF](term:etf)는 여러 종목을 묶어 만든 '바구니'예요. 일반 펀드와 달리 거래소에서 주식처럼 실시간으로 사고팔 수 있죠. 흔히 코스피200·S&P500 같은 '지수'를 그대로 따라가도록 만들어요.",
    },
    {
      type: "ox",
      prompt:
        "[ETF](term:etf)는 한 주만 사도, 그 안에 든 수십~수백 개 회사에 한꺼번에 [분산투자](term:diversification)하는 효과가 있다?",
      answer: true,
      explanation:
        "맞아요. 그게 ETF의 가장 큰 매력이에요. 한 주 값으로 바구니에 담긴 모든 회사에 조금씩 투자한 셈이라, 한 회사가 휘청여도 충격이 작아요. 초보자가 [분산투자](term:diversification)를 쉽게 하는 방법으로 자주 꼽혀요.",
    },
    {
      type: "ox",
      prompt:
        "[ETF](term:etf)는 분산이 되어 있으니, 시장 전체가 떨어져도 손실이 전혀 나지 않는다?",
      answer: false,
      explanation:
        "아니에요. ETF는 '한 회사'에 쏠린 위험은 줄여 주지만, 시장 전체가 내리면 그 바구니도 같이 내려가요(원금 손실 가능). 또 아주 작지만 운용보수(수수료)가 매년 빠지고요. 분산이 만능은 아니에요.",
    },
  ],
};
