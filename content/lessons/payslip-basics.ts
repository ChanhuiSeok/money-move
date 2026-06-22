import type { Lesson } from "@/lib/schema";

export const payslipBasics: Lesson = {
  id: "payslip-basics",
  unitId: "u-tax-1",
  order: 1,
  title: "월급명세서, 뭐가 이렇게 많아?",
  durationMin: 3,
  intro:
    "첫 월급명세서를 보면 항목이 잔뜩이라 당황스럽죠.\n크게 보면 딱 둘이에요: 받기로 한 돈([세전 월급](term:gross-pay))과, 거기서 빠지는 것들.",
  glossary: ["take-home-pay", "gross-pay", "withholding"],
  questions: [
    {
      type: "ox",
      prompt: "월급명세서에는 크게 '받는 돈'과 '빠지는 돈'이 적혀 있어요. 맞을까요?",
      answer: true,
      explanation:
        "맞아요. 받기로 한 [세전 월급](term:gross-pay)에서 세금·보험료가 빠지고, 남은 게 통장에 들어와요.",
    },
    {
      type: "choice",
      prompt: "세금·보험료를 떼고 실제로 통장에 들어오는 금액을 뭐라고 할까요?",
      options: ["실수령액", "세전 월급", "연봉", "상여금"],
      answerIndex: 0,
      explanation:
        "[실수령액](term:take-home-pay)이에요. '세후 월급'이라고도 해요. 보통 세전보다 꽤 줄어들어서 처음엔 놀라기도 해요.",
    },
    {
      type: "fill",
      prompt:
        "회사가 월급에서 세금을 미리 떼어 나라에 대신 내주는 걸 '○○징수'라고 해요. (두 글자)",
      answer: ["원천", "원천징수"],
      explanation:
        "정답은 '원천'이에요. [원천징수](term:withholding) 덕분에 우리는 따로 세금을 내러 가지 않아도 돼요.",
    },
  ],
};
