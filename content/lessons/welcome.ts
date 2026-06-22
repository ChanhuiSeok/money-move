import type { Lesson } from "@/lib/schema";

/** 첫 맛보기 레슨 — 첫 문제는 누구나 맞힐 만큼 쉽게. */
export const welcome: Lesson = {
  id: "welcome",
  unitId: "u-basics-1",
  order: 1,
  title: "돈, 어디로 갔지?",
  durationMin: 3,
  intro:
    "월급은 들어왔는데 통장은 텅… 누구나 한 번쯤 겪죠.\n오늘은 '내 돈이 어디로 가는지' 아주 가볍게 살펴볼 거예요.\n30초면 첫 문제 맞혀요. 같이 가볼까요?",
  glossary: ["fixed-expense", "emergency-fund"],
  questions: [
    {
      type: "ox",
      prompt: "돈을 계획 없이 쓰면, 모으기가 더 어려워지겠죠?",
      answer: true,
      explanation:
        "맞아요. 어디에 쓰는지 알아야 모으기도 쉬워져요. 그 '알아보기'가 첫걸음이에요.",
    },
    {
      type: "choice",
      prompt:
        "다음 중 매달 비슷하게 나가는 [고정지출](term:fixed-expense)에 가장 가까운 것은?",
      options: ["월세", "충동구매한 신발", "길에서 산 떡볶이", "친구 깜짝 선물"],
      answerIndex: 0,
      explanation:
        "월세처럼 매달 정해진 날, 비슷한 금액으로 나가는 돈이 [고정지출](term:fixed-expense)이에요. 나머지는 그때그때 달라지는 [변동지출](term:variable-expense)에 가까워요.",
    },
    {
      type: "fill",
      prompt:
        "매달 정해진 날 자동으로 빠져나가는 지출을 '○○지출'이라고 해요. (두 글자)",
      answer: ["고정", "고정지출"],
      explanation:
        "정답은 '고정'이에요. 월세·통신비·구독료처럼 예측 가능한 지출이죠. 먼저 파악해두면 예산 짜기가 쉬워져요.",
    },
    {
      type: "ox",
      prompt:
        "갑작스러운 일에 대비하는 [비상금](term:emergency-fund)은 없어도 괜찮다?",
      answer: false,
      explanation:
        "괜찮아요, 헷갈리기 쉬운 부분이에요. [비상금](term:emergency-fund)이 있으면 갑작스러운 지출에 빚지지 않고 버틸 수 있어서, 작게라도 모아두면 든든해요.",
    },
  ],
};
