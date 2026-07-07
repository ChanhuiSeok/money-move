import type { Lesson } from "@/lib/schema";

export const payslipBasics: Lesson = {
  id: "payslip-basics",
  unitId: "u-tax-1",
  order: 1,
  title: "월급명세서, 뭐가 이렇게 많아?",
  durationMin: 3,
  intro:
    "월급명세서는 크게 둘이에요: 받기로 한 [세전 월급](term:gross-pay)과, 거기서 빠지는 것들.\n빠지고 남은 게 통장에 꽂히는 [실수령액](term:take-home-pay) — 사용자님은 매달 약 [271만원](my:takehome)쯤이에요. 헷갈리기 쉬운 곳만 짚을게요.",
  glossary: ["take-home-pay", "gross-pay", "withholding"],
  questions: [
    {
      type: "ox",
      prompt:
        "연봉 3,600만 원으로 계약하면, 매달 통장에 딱 300만 원(3,600÷12)이 들어온다?",
      answer: false,
      explanation:
        "아니에요. 3,600÷12=300만은 [세전](term:gross-pay) 기준이에요. 여기서 4대 보험·세금이 빠지면 실제로는 270만 원 안팎이 들어와요. 사용자님 기준으로는 매달 약 [271만원](my:takehome) — 세전에서 [약 29만원](my:deduction)이 빠진 셈이죠. '연봉 ÷ 12 ≠ [실수령액](term:take-home-pay)' — 연봉 협상할 때 꼭 기억해요.",
    },
    {
      type: "choice",
      prompt:
        "월급명세서에서 '실제로 통장에 들어오는 돈'에 해당하는 항목은?",
      options: [
        "지급 합계 (세전)",
        "기본급",
        "상여금",
        "공제 후 차인지급액 (실수령액)",
      ],
      answerIndex: 3,
      explanation:
        "맨 아래 '차인지급액' = [실수령액](term:take-home-pay)이에요. 위쪽 지급 합계는 떼기 '전' 금액이라 더 커요. 그 둘의 차이가 바로 공제(세금·보험료)예요.",
    },
    {
      type: "fill",
      prompt:
        "회사가 월급에서 세금을 미리 떼어 나라에 대신 내주는 걸 '○○징수'라고 해요. (두 글자)",
      answer: ["원천", "원천징수"],
      explanation:
        "정답은 '원천'이에요. [원천징수](term:withholding) 덕분에 우리는 따로 세금 신고를 하지 않아도 돼요. 다만 매달은 '대략' 떼는 거라, 1년에 한 번 연말정산으로 정확히 맞춰요.",
    },
  ],
};
