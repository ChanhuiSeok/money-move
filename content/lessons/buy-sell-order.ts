import type { Lesson } from "@/lib/schema";

export const buySellOrder: Lesson = {
  id: "buy-sell-order",
  unitId: "u-invest-2",
  order: 1,
  title: "매수·매도, 그리고 주문",
  durationMin: 5,
  intro:
    "사는 게 [매수](term:buy-order), 파는 게 [매도](term:sell-order)예요. 그런데 '주문을 냈다'와 '거래가 됐다([체결](term:execution))'는 다른 말이에요.\n주문에는 [시장가](term:market-order)와 [지정가](term:limit-order) 두 가지가 있는데, 이 차이를 알면 손해를 크게 줄일 수 있어요.",
  glossary: ["buy-order", "sell-order", "market-order", "limit-order", "quote", "execution"],
  questions: [
    {
      type: "choice",
      prompt:
        "[시장가 주문](term:market-order)과 [지정가 주문](term:limit-order)의 차이로 가장 알맞은 것은?",
      options: [
        "시장가는 항상 가장 싸게, 지정가는 항상 가장 비싸게 사 준다",
        "시장가는 수수료가 없고, 지정가는 수수료가 두 배다",
        "둘 다 무조건 즉시, 무조건 내가 원하는 가격에 체결된다",
        "시장가는 지금 시세로 즉시 체결되지만 가격이 들쭉날쭉할 수 있고, 지정가는 가격을 정하지만 그 값에 안 맞으면 체결이 안 될 수 있다",
      ],
      answerIndex: 3,
      explanation:
        "[시장가 주문](term:market-order)은 '가격은 상관없으니 지금 바로'라 빠르게 [체결](term:execution)되지만, 그 순간 [호가](term:quote)에 따라 생각보다 비싸거나 싸게 체결될 수 있어요. [지정가 주문](term:limit-order)은 '이 가격에만'이라 가격은 지킬 수 있지만, 그 가격에 거래할 상대가 없으면 체결이 안 돼요.",
    },
    {
      type: "ox",
      prompt:
        "지정가로 매도 주문을 내면, 무조건 즉시 그 가격에 팔린다?",
      answer: false,
      explanation:
        "주문을 냈다고 바로 팔리는 게 아니에요. 거래가 성사되려면(=[체결](term:execution)) 내가 내놓은 가격에 사 줄 사람이 있어야 해요. 사 주는 사람이 없으면 주문은 '대기'로 남아요. 그래서 '주문'과 '체결'은 다른 말이에요.",
    },
    {
      type: "choice",
      prompt:
        "거래가 잘 안 되는(거래량이 적은) 종목을 시장가로 한 번에 많이 팔면 생길 수 있는 일은?",
      options: [
        "거래량과 상관없이 항상 같은 가격에 다 팔린다",
        "사 주려는 가격이 층층이 낮아져, 평균 체결가가 생각보다 훨씬 낮아질 수 있다",
        "거래량이 적으면 거래가 세금에서 면제된다",
        "주문이 자동으로 두 배 비싼 값에 체결된다",
      ],
      answerIndex: 1,
      explanation:
        "시장가는 그 순간 나와 있는 [호가](term:quote)를 좋은 가격부터 차례로 잡아먹으며 [체결](term:execution)돼요. 사 주려는 주문이 얇으면 가격이 층층이 밀려, 평균 체결가가 예상보다 크게 낮아질 수 있어요(이걸 '슬리피지'라고 해요). 거래가 적은 종목일수록 [지정가](term:limit-order)가 안전한 이유예요.",
    },
  ],
};
