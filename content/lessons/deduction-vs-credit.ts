import type { Lesson } from "@/lib/schema";

export const deductionVsCredit: Lesson = {
  id: "deduction-vs-credit",
  unitId: "u-tax-2",
  order: 1,
  title: "소득공제 vs 세액공제, 뭐가 달라?",
  durationMin: 4,
  intro:
    "연말정산 얘기에 꼭 나오는 두 단어, [소득공제](term:income-deduction)와 [세액공제](term:tax-credit).\n비슷해 보이지만 '깎아주는 지점'이 달라요. 천천히 볼게요.",
  glossary: ["income-deduction", "tax-credit", "income-tax"],
  questions: [
    {
      type: "ox",
      prompt: "'공제'는 한마디로 세금을 깎아주는 거예요. 맞을까요?",
      answer: true,
      explanation:
        "맞아요. 깎아주는 '방식'이 두 가지라, 이름이 둘로 나뉜 것뿐이에요.",
    },
    {
      type: "choice",
      prompt: "세금을 매기는 '기준 소득' 자체를 줄여주는 건 무엇일까요?",
      options: ["소득공제", "세액공제", "원천징수", "상여금"],
      answerIndex: 0,
      explanation:
        "[소득공제](term:income-deduction)예요. 세금을 매기기 '전' 소득을 줄여서, 그만큼 [소득세](term:income-tax)가 줄어요.",
    },
    {
      type: "ox",
      prompt:
        "[세액공제](term:tax-credit)는 이미 계산된 세금에서 직접 빼주는 거예요. 맞을까요?",
      answer: true,
      explanation:
        "맞아요. 소득공제가 '기준'을 줄인다면, 세액공제는 '계산된 세금'을 바로 깎아요. 그래서 효과가 더 직접적으로 느껴지죠.",
    },
  ],
};
