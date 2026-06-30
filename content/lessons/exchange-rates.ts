import type { Lesson } from "@/lib/schema";

export const exchangeRates: Lesson = {
  id: "exchange-rates",
  unitId: "u-macro-1",
  order: 3,
  title: "환율, 원화가 싸진다는 것",
  durationMin: 5,
  intro:
    "[환율](term:exchange-rate)은 숫자가 커지면 가치는 떨어지는, 헷갈리기 딱 좋은 개념이에요.\n'원/달러 환율이 오른다'가 내 여행·직구·해외투자에 어떻게 와닿는지 직관으로 잡아 볼게요.",
  glossary: ["exchange-rate"],
  questions: [
    {
      type: "ox",
      prompt:
        "'원/달러 [환율](term:exchange-rate)이 1,300원에서 1,400원으로 올랐다'는 건, 같은 1달러를 사는 데 더 많은 원이 든다는 뜻이라 원화 가치가 떨어진 것이다?",
      answer: true,
      explanation:
        "맞아요. 환율이 오르면 1달러를 바꾸는 데 더 많은 원이 필요해요 = 원화가 '싸진' 거예요(원화 약세). 숫자는 커지는데 원화 가치는 오히려 떨어진다는 게 가장 헷갈리는 포인트죠.",
    },
    {
      type: "choice",
      prompt:
        "원/달러 [환율](term:exchange-rate)이 크게 올랐어요(원화 약세). 다음 중 형편이 '유리해지는' 쪽에 가장 가까운 것은?",
      options: [
        "여름에 미국으로 여행 가려는 사람",
        "제품을 해외에 파는 수출 기업",
        "해외 직구를 자주 하는 사람",
        "미국으로 유학 간 자녀에게 학비를 보내는 부모",
      ],
      answerIndex: 1,
      explanation:
        "환율이 오르면 해외에서 번 달러를 원으로 바꿀 때 더 많이 받는 수출 기업이 유리해요. 반대로 달러를 '써야 하는' 여행·직구·유학 송금은 더 비싸지죠.",
    },
    {
      type: "ox",
      prompt:
        "내가 가진 미국 주식의 달러 가격이 그대로여도, 원/달러 [환율](term:exchange-rate)이 오르면 원화로 환산한 평가금액은 늘어난다?",
      answer: true,
      explanation:
        "맞아요. 미국 주식은 달러로 사고팔지만 내 계좌에선 원화로 환산돼 보여요. 달러 가격이 같아도 환율이 오르면(원화 약세) 원화 환산금액은 늘어요(환차익). 반대로 환율이 내리면 주가가 그대로여도 원화로는 줄 수 있어요(환손실). 그래서 해외 투자엔 '환율'이라는 변수가 하나 더 붙어요.",
    },
  ],
};
