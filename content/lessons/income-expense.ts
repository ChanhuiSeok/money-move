import type { Lesson } from "@/lib/schema";

export const incomeExpense: Lesson = {
  id: "income-expense",
  unitId: "u-basics-1",
  order: 2,
  title: "버는 돈, 쓰는 돈",
  durationMin: 3,
  intro:
    "나가는 돈은 두 종류예요. 매달 비슷하게 빠지는 [고정지출](term:fixed-expense)과, 그때그때 달라지는 [변동지출](term:variable-expense).\n이 둘을 가르는 게 왜 돈 관리의 핵심인지 짚어볼게요.",
  glossary: ["fixed-expense", "variable-expense"],
  questions: [
    {
      type: "choice",
      prompt:
        "이번 달 지출을 줄여보려 해요. 보통 가장 손대기 '쉬운' 쪽은 어디일까요?",
      options: [
        "외식·배달 같은 변동지출",
        "월세·보험료 같은 고정지출",
        "월급에서 떼는 4대 보험료",
        "이미 낸 소득세",
      ],
      answerIndex: 0,
      explanation:
        "변동지출은 내 선택으로 바로 조절돼서 절약의 출발점이에요. 고정지출은 계약을 바꿔야 해서 손대기 어렵고, 보험료·세금은 내 맘대로 못 줄여요.",
    },
    {
      type: "ox",
      prompt:
        "통신요금제를 더 싼 걸로 한 번 바꾸면, 그 절약 효과는 매달 자동으로 이어진다?",
      answer: true,
      explanation:
        "맞아요. [고정지출](term:fixed-expense)은 줄이기는 번거로워도 한 번 낮추면 매달 계속 아껴져요. 그래서 '고정비 다이어트'가 효율이 좋아요 — 변동지출은 매달 다시 신경 써야 하거든요.",
    },
    {
      type: "ox",
      prompt:
        "예측이 쉬운 [고정지출](term:fixed-expense)을 예산에서 먼저 채워두면, 남는 돈이 또렷해져 계획이 쉬워진다?",
      answer: true,
      explanation:
        "맞아요. '먼저 고정지출 → 남은 돈에서 변동지출·저축'으로 보면, 이번 달 진짜 쓸 수 있는 돈이 한눈에 들어와요.",
    },
  ],
};
