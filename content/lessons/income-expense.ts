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
      type: "choice",
      prompt:
        "매달은 아니지만 가끔 '한 번에 크게' 나가는 돈(명절 비용·자동차 보험료처럼)은 어떻게 다루면 좋을까요?",
      options: [
        "그때 가서 카드로 막고 잊어버린다",
        "1년 치를 12로 나눠, 매달 조금씩 미리 모아둔다",
        "변동지출이니 신경 쓰지 않는다",
        "그 달에 다른 지출을 모두 멈춘다",
      ],
      answerIndex: 1,
      explanation:
        "매달은 아니어도 예측되는 큰 지출은, 1년 치를 미리 나눠 조금씩 모아두면 그달에 휘청이지 않아요. 가계부에서 자주 놓치는 부분이라, 미리 떼두면 '갑자기 큰돈'에 당황하지 않아요.",
    },
  ],
};
