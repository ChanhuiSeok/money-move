import type { Lesson } from "@/lib/schema";

export const brokerageAccount: Lesson = {
  id: "brokerage-account",
  unitId: "u-invest-1",
  order: 2,
  title: "증권계좌와 예수금",
  durationMin: 4,
  intro:
    "주식을 사려면 은행 계좌 말고 [증권계좌](term:brokerage-account)가 필요해요. 그리고 그 계좌에 넣어 둔 현금이 [예수금](term:deposit-balance)이죠.\n예수금은 '아직 주식이 안 된 내 현금'이라고 보면 쉬워요. 헷갈리기 쉬운 '출금 가능일'까지 같이 볼게요.",
  glossary: ["brokerage-account", "deposit-balance", "buy-order", "sell-order", "settlement-cycle"],
  questions: [
    {
      type: "choice",
      prompt: "[예수금](term:deposit-balance)을 가장 정확히 설명한 것은?",
      options: [
        "지금까지 산 주식들의 총 평가금액",
        "올해 받은 배당금의 합계",
        "증권계좌에 들어 있는, 아직 주식을 사지 않은 현금(주문에 쓸 수 있는 돈)",
        "증권사에 매달 내는 계좌 유지비",
      ],
      answerIndex: 2,
      explanation:
        "[예수금](term:deposit-balance)은 [증권계좌](term:brokerage-account)에 들어 있는 현금이에요. 이 돈으로 주식을 [매수](term:buy-order)하고, 주식을 [매도](term:sell-order)하면 다시 예수금으로 돌아와요. 내가 가진 주식의 가치(평가금액)와는 별개의 칸이에요.",
    },
    {
      type: "ox",
      prompt:
        "주식을 매도하면, 그 판 돈을 같은 날 바로 은행 통장으로 출금할 수 있다?",
      answer: false,
      explanation:
        "체결됐다고 끝이 아니라 [결제](term:settlement-cycle)가 며칠 뒤에 이뤄져요. 한국 주식은 보통 영업일 기준 이틀 뒤(T+2)에 결제돼서, 그제서야 그 현금을 실제로 출금할 수 있어요. 그래서 매도 직후 예수금에 금액이 보여도 '출금 가능 금액'은 며칠 뒤에 늘어나요.",
    },
    {
      type: "choice",
      prompt:
        "예수금이 100만 원 있어요. 한 주에 30만 원인 주식을 살 때, 맞는 설명은? (수수료는 무시)",
      options: [
        "최대 3주까지 살 수 있고, 사고 나면 예수금은 10만 원이 남는다",
        "최대 3주를 사도 예수금은 그대로 100만 원이다",
        "최대 4주까지 살 수 있다",
        "예수금이 부족해 한 주도 못 산다",
      ],
      answerIndex: 0,
      explanation:
        "예수금 안에서만 살 수 있어요. 30만 원짜리는 3주(90만 원)까지 되고, 4주(120만 원)는 예수금을 넘어 안 돼요. 사면 쓴 만큼 예수금이 줄어 10만 원이 남죠. (예수금보다 많이 주문하는 '미수'는 빚을 지는 거라, 초보자에겐 권하지 않아요.)",
    },
  ],
};
