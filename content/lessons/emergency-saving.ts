import type { Lesson } from "@/lib/schema";

export const emergencySaving: Lesson = {
  id: "emergency-saving",
  unitId: "u-basics-2",
  order: 2,
  title: "먼저 떼고, 남은 걸 쓰기",
  durationMin: 3,
  intro:
    "쓰고 남는 걸 모으려 하면 늘 안 남죠. 순서를 바꿔서 받자마자 '먼저' 떼두는 게 핵심이에요.\n그렇게 모은 [비상금](term:emergency-fund)을 어디에 둬야 하는지도 함께 볼게요.",
  glossary: ["emergency-fund", "budget"],
  questions: [
    {
      type: "choice",
      prompt:
        "'선저축 후지출'(먼저 저축하고 남은 걸 쓰기)이 잘 통하는 이유로 가장 가까운 건?",
      options: [
        "쓰고 남기려 하면 보통 안 남기 때문에",
        "저축하면 이자가 아주 높아서",
        "저축한 만큼 세금이 줄어서",
        "카드값이 자동으로 줄어서",
      ],
      answerIndex: 0,
      explanation:
        "사람은 있으면 쓰게 돼요. 그래서 받자마자 저축을 [예산](term:budget) 맨 앞에 두고 자동이체로 떼두면, '남기기'에 의존하지 않아도 모여요.",
    },
    {
      type: "ox",
      prompt:
        "[비상금](term:emergency-fund)은 갑자기 필요할 때 바로 꺼내 써야 하니, 가격이 출렁이는 주식보다 수시입출금·파킹통장이 더 알맞다?",
      answer: true,
      explanation:
        "맞아요. 비상금의 목적은 '불릴' 돈이 아니라 '급할 때 바로 쓸' 돈이에요. 그래서 수익률보다 즉시 꺼낼 수 있고 원금이 안전한 곳이 맞아요. 하필 급할 때 주가가 빠져 있으면 손해 보고 팔아야 하니까요.",
    },
    {
      type: "ox",
      prompt:
        "[비상금](term:emergency-fund) 3~6개월치는 꼭 지켜야 할 규칙이라, 그만큼 못 모을 거면 시작할 의미가 없다?",
      answer: false,
      explanation:
        "괜찮아요, 3~6개월치는 '목표 예시'일 뿐 절대 규칙이 아니에요. 단돈 30만 원이라도 있으면 갑작스러운 일에 빚지지 않아요. 작게 시작하는 게 안 하는 것보다 훨씬 나아요.",
    },
  ],
};
