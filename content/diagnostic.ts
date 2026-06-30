import type { Question } from "@/lib/schema";

/** 진단 문항 — 어느 레벨의 실력을 보는지 levelId로 표시한다.
   "이미 아는 레벨은 건너뛰기" 용도라서, 첫 레슨보다 살짝 어렵게(레벨 핵심 개념). */
export type DiagnosticItem = { levelId: string; question: Question };

/** 레벨 1~2를 대표하는 진단 문항. 레벨당 2문제, 레벨 순서대로. */
export const diagnosticItems: DiagnosticItem[] = [
  // 레벨 1 — 돈의 기초
  {
    levelId: "l-basics",
    question: {
      type: "ox",
      prompt:
        "예산을 짤 때는 매달 비슷하게 나가는 [고정지출](term:fixed-expense)부터 파악하는 게 도움이 된다?",
      answer: true,
      explanation:
        "맞아요. 고정지출을 먼저 알면 '쓸 수 있는 돈'이 또렷해져서 예산 짜기가 쉬워져요.",
    },
  },
  {
    levelId: "l-basics",
    question: {
      type: "choice",
      prompt:
        "갑작스러운 일에 대비해 따로 모아두는 돈을 무엇이라고 부를까요?",
      options: ["보험금", "연말정산", "고정지출", "비상금"],
      answerIndex: 3,
      explanation:
        "[비상금](term:emergency-fund)이에요. 갑작스러운 지출에 빚지지 않게 버텨주는 돈이죠.",
    },
  },
  // 레벨 2 — 세금과 공제
  {
    levelId: "l-tax",
    question: {
      type: "choice",
      prompt:
        "월급에서 국민연금·건강보험·고용보험·산재보험으로 빠져나가는 것을 묶어 무엇이라 할까요?",
      options: ["소득공제", "4대 보험", "세액공제", "연말정산"],
      answerIndex: 1,
      explanation:
        "[4대 보험](term:four-major-insurance)이에요. 월급명세서에서 세금과 함께 가장 크게 빠지는 항목이죠.",
    },
  },
  {
    levelId: "l-tax",
    question: {
      type: "ox",
      prompt:
        "[세액공제](term:tax-credit)는 내야 할 세금 자체를 줄여주고, [소득공제](term:income-deduction)는 세금을 매기는 소득을 줄여준다?",
      answer: true,
      explanation:
        "맞아요. 둘 다 세금을 아껴주지만 줄이는 대상이 달라요. 세액공제가 보통 체감이 더 커요.",
    },
  },
];
