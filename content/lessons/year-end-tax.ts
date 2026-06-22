import type { Lesson } from "@/lib/schema";

export const yearEndTax: Lesson = {
  id: "year-end-tax",
  unitId: "u-tax-2",
  order: 2,
  title: "연말정산, 13월의 월급?",
  durationMin: 4,
  intro:
    "매달 떼인 세금은 사실 '대략' 떼인 거예요.\n1년에 한 번, 실제 낼 세금과 비교해 더 냈으면 돌려주고 덜 냈으면 더 걷는 게 [연말정산](term:year-end-settlement)이에요.",
  glossary: ["year-end-settlement", "withholding", "income-deduction"],
  questions: [
    {
      type: "ox",
      prompt: "매달 월급에서 [원천징수](term:withholding)로 떼인 세금은 '대략' 떼인 금액이에요. 맞을까요?",
      answer: true,
      explanation:
        "맞아요. 매달은 어림잡아 떼고, 1년 치를 모아 정확히 다시 계산하는 게 [연말정산](term:year-end-settlement)이에요.",
    },
    {
      type: "choice",
      prompt: "연말정산에서 세금을 '돌려받는(환급)' 경우는 언제일까요?",
      options: [
        "1년간 실제 낼 세금보다 더 많이 떼였을 때",
        "세금을 한 번도 안 냈을 때",
        "월급이 올랐을 때",
        "보험을 해지했을 때",
      ],
      answerIndex: 0,
      explanation:
        "미리 더 많이 떼였으면 차액을 돌려받아요. 그래서 '13월의 월급'이라 부르기도 하죠. 반대면 더 내기도 해요.",
    },
    {
      type: "ox",
      prompt:
        "[소득공제](term:income-deduction)·세액공제를 잘 챙기면 돌려받는 금액이 늘 수 있어요. 맞을까요?",
      answer: true,
      explanation:
        "맞아요. 그래서 평소 영수증·자료를 잘 챙기는 게 도움이 돼요. (다만 사람마다 상황이 달라요!)",
    },
  ],
};
