import type { Lesson } from "@/lib/schema";

export const incomeExpense: Lesson = {
  id: "income-expense",
  unitId: "u-basics-1",
  order: 2,
  title: "버는 돈, 쓰는 돈",
  durationMin: 3,
  intro:
    "통장을 들여다보면 크게 두 가지예요: 들어오는 돈과 나가는 돈.\n이 둘만 또렷이 봐도 돈 관리가 한결 쉬워져요. 가볍게 짚어볼까요?",
  glossary: ["fixed-expense", "variable-expense"],
  questions: [
    {
      type: "ox",
      prompt: "돈은 크게 '들어오는 돈'과 '나가는 돈'으로 나눠볼 수 있어요. 맞을까요?",
      answer: true,
      explanation:
        "맞아요. 이 둘을 구분하는 게 돈 관리의 출발점이에요. 나가는 돈을 좀 더 들여다볼게요.",
    },
    {
      type: "choice",
      prompt:
        "매달 같은 날 비슷한 금액으로 나가는 [고정지출](term:fixed-expense)에 가장 가까운 건?",
      options: ["넷플릭스 구독료", "마트 장보기", "택시비", "경조사비"],
      answerIndex: 0,
      explanation:
        "구독료는 매달 정해진 금액이라 [고정지출](term:fixed-expense)이에요. 나머지는 달마다 달라지는 [변동지출](term:variable-expense)에 가까워요.",
    },
    {
      type: "fill",
      prompt: "외식·쇼핑처럼 그때그때 달라지는 지출을 '○○지출'이라고 해요. (두 글자)",
      answer: ["변동", "변동지출"],
      explanation:
        "정답은 '변동'이에요. [변동지출](term:variable-expense)은 내가 조절하기 쉬운 돈이라, 아끼기 시작할 때 먼저 보면 좋아요.",
    },
  ],
};
