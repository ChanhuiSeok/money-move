import type { Lesson } from "@/lib/schema";

export const fourInsurances: Lesson = {
  id: "four-insurances",
  unitId: "u-tax-1",
  order: 2,
  title: "4대 보험이 뭐예요?",
  durationMin: 4,
  intro:
    "월급에서 매달 빠지는 큰 덩어리, 바로 [4대 보험](term:four-major-insurance)이에요.\n아깝게 느껴지지만 사실 나를 지켜주는 안전망이에요. 하나씩 볼까요?",
  glossary: [
    "four-major-insurance",
    "national-pension",
    "health-insurance",
    "employment-insurance",
  ],
  questions: [
    {
      type: "choice",
      prompt: "다음 중 [4대 보험](term:four-major-insurance)에 '속하지 않는' 것은?",
      options: ["자동차보험", "국민연금", "건강보험", "고용보험"],
      answerIndex: 0,
      explanation:
        "4대 보험은 국민연금·건강보험·고용보험·산재보험이에요. 자동차보험은 따로 드는 민간 보험이라 여기엔 안 들어가요.",
    },
    {
      type: "ox",
      prompt:
        "[국민연금](term:national-pension)은 나중에 노후에 연금으로 돌려받는 돈이에요. 맞을까요?",
      answer: true,
      explanation:
        "맞아요. 지금 떼이는 게 아깝게 느껴져도, 노후의 나에게 보내는 돈이라고 생각하면 조금 든든해져요.",
    },
    {
      type: "ox",
      prompt: "산재보험료는 보통 회사가 전액 부담해요. 맞을까요?",
      answer: true,
      explanation:
        "맞아요. 산재보험은 일하다 다쳤을 때를 대비하는 보험이라 사업주가 전액 부담하는 게 원칙이에요.",
    },
    {
      type: "fill",
      prompt: "아플 때 병원비 부담을 크게 줄여주는 보험은 '○○보험'이에요. (두 글자)",
      answer: ["건강"],
      explanation:
        "[건강보험](term:health-insurance)이에요. 모두가 조금씩 부담해 아픈 사람을 함께 돕는 구조랍니다.",
    },
  ],
};
