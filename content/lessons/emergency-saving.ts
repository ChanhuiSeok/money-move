import type { Lesson } from "@/lib/schema";

export const emergencySaving: Lesson = {
  id: "emergency-saving",
  unitId: "u-basics-2",
  order: 2,
  title: "먼저 떼고, 남은 걸 쓰기",
  durationMin: 3,
  intro:
    "월급 받으면 쓰고 남는 걸 모으려 하면… 늘 안 남죠?\n순서를 살짝 바꿔봐요. 받자마자 일정 금액을 '먼저' 떼두는 거예요.",
  glossary: ["emergency-fund", "budget"],
  questions: [
    {
      type: "ox",
      prompt: "쓰고 남은 돈을 모으려 하면, 보통 잘 안 모여요. 맞을까요?",
      answer: true,
      explanation:
        "맞아요. 그래서 '선저축 후지출' — 받자마자 먼저 떼두는 방법이 통해요.",
    },
    {
      type: "choice",
      prompt: "돈을 잘 모으는 순서로 가장 좋은 건?",
      options: [
        "받자마자 먼저 저축하고, 남은 걸 쓴다",
        "다 쓰고 남으면 저축한다",
        "이번 달은 일단 쓰고 다음 달에 모은다",
        "모을 수 있을 때까지 미룬다",
      ],
      answerIndex: 0,
      explanation:
        "'먼저 떼고 남은 걸 쓰기'예요. 저축을 [예산](term:budget)의 맨 앞에 두는 거죠. 자동이체로 해두면 더 쉬워요.",
    },
    {
      type: "ox",
      prompt:
        "[비상금](term:emergency-fund)은 흔히 3~6개월치 생활비를 목표로 하지만, 작게 시작해도 괜찮다?",
      answer: true,
      explanation:
        "맞아요. 정해진 규칙은 아니에요. 단돈 몇 만 원이라도 시작하는 게 중요해요. 있으면 갑작스러운 일에 빚지지 않아요.",
    },
  ],
};
