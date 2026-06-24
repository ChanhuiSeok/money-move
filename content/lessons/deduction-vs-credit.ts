import type { Lesson } from "@/lib/schema";

export const deductionVsCredit: Lesson = {
  id: "deduction-vs-credit",
  unitId: "u-tax-2",
  order: 1,
  title: "소득공제 vs 세액공제, 뭐가 달라?",
  durationMin: 4,
  intro:
    "연말정산의 핵심 두 단어, [소득공제](term:income-deduction)와 [세액공제](term:tax-credit).\n둘 다 세금을 깎지만 '깎는 자리'가 달라서, 같은 100만 원이라도 효과가 달라져요. 숫자로 느껴볼게요.",
  glossary: ["income-deduction", "tax-credit", "income-tax"],
  questions: [
    {
      type: "choice",
      prompt:
        "[소득공제](term:income-deduction)와 [세액공제](term:tax-credit)의 가장 큰 차이는?",
      options: [
        "소득공제는 '세금 매기는 소득'을, 세액공제는 '계산된 세금'을 줄인다",
        "둘은 이름만 다르고 사실 똑같다",
        "소득공제는 부자만, 세액공제는 서민만 받는다",
        "소득공제는 월급에, 세액공제는 보너스에만 적용된다",
      ],
      answerIndex: 0,
      explanation:
        "소득공제는 세금을 '매기기 전' 소득을 줄이고, 세액공제는 이미 '계산된 세금'을 바로 깎아요. 깎는 지점이 다르니 같은 금액이라도 효과가 달라지는데, 다음 문제에서 직접 봐요.",
    },
    {
      type: "choice",
      prompt:
        "세율 15% 구간인 사람이 똑같이 100만 원을 공제받아요. 보통 더 많이 돌려받는 쪽은?",
      options: [
        "세액공제 100만 원",
        "소득공제 100만 원",
        "둘이 정확히 똑같다",
        "사람마다 달라 알 수 없다",
      ],
      answerIndex: 0,
      explanation:
        "[소득공제](term:income-deduction)는 '세금을 매기는 소득'을 100만 원 줄여줘요. 그런데 그 소득엔 원래 세율 15%가 붙어 있었죠? 그러니 줄어든 100만 원에 매겨졌을 세금, 즉 100만 × 15% = 15만 원만큼만 세금이 줄어요. 반면 [세액공제](term:tax-credit) 100만 원은 '세금 자체'를 그대로 100만 원 깎아요. 그래서 보통 세액공제가 훨씬 세요. (소득공제는 내 세율이 높을수록 효과가 커져요.)",
    },
    {
      type: "ox",
      prompt:
        "[세액공제](term:tax-credit)는 '이미 계산된 세금'에서 빼는 거라, 낼 세금보다 공제액이 더 크면 그 초과분은 돌려받지 못한다?",
      answer: true,
      explanation:
        "맞아요. 세금은 0원 밑으로 내려가지 않아요. 예를 들어 낼 세금([산출세액])이 40만 원인데 세액공제가 100만 원이면, 40만 원까지만 깎여 세금은 0이 되고 나머지 60만 원은 그냥 사라져요. 이게 연말정산에서 가장 헷갈리는 부분이라, 다음 단원 시뮬레이터에서 눈으로 확인해요.",
    },
  ],
};
