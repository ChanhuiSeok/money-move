import type { Lesson } from "@/lib/schema";

export const budgetBasics: Lesson = {
  id: "budget-basics",
  unitId: "u-basics-2",
  order: 1,
  title: "예산 첫걸음",
  durationMin: 3,
  intro:
    "쓸 돈을 미리 정해두는 걸 [예산](term:budget)이라고 해요.\n거창할 것 없어요. '이번 달 외식은 OO원까지'처럼 정하면 그게 예산이에요.",
  glossary: ["budget"],
  questions: [
    {
      type: "choice",
      prompt: "'[예산](term:budget)을 세운다'는 건 무슨 뜻에 가장 가까울까요?",
      options: [
        "쓸 돈을 미리 정해둔다",
        "돈을 무조건 아낀다",
        "통장을 여러 개 만든다",
        "카드를 잘라버린다",
      ],
      answerIndex: 0,
      explanation:
        "예산은 '미리 정해두는 계획'이에요. 무조건 참는 게 아니라, 어디에 얼마 쓸지 나눠두는 거예요.",
    },
    {
      type: "ox",
      prompt: "한 번 세운 예산은 절대 바꾸면 안 된다?",
      answer: false,
      explanation:
        "괜찮아요, 예산은 살아있는 계획이에요. 상황이 바뀌면 다시 조정해도 전혀 문제없어요.",
    },
  ],
};
