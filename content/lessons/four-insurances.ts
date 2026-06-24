import type { Lesson } from "@/lib/schema";

export const fourInsurances: Lesson = {
  id: "four-insurances",
  unitId: "u-tax-1",
  order: 2,
  title: "4대 보험이 뭐예요?",
  durationMin: 4,
  intro:
    "월급에서 매달 빠지는 큰 덩어리, [4대 보험](term:four-major-insurance)이에요.\n아깝게 느껴지지만 나를 지켜주는 안전망이죠. 얼마나 빠지고, 가끔 왜 갑자기 늘어나는지까지 볼게요.",
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
        "4대 보험은 [국민연금](term:national-pension)·[건강보험](term:health-insurance)·[고용보험](term:employment-insurance)·산재보험이에요. 자동차보험은 내가 따로 드는 민간 보험이라 여기엔 안 들어가요.",
    },
    {
      type: "ox",
      prompt:
        "[4대 보험](term:four-major-insurance)으로 매달 빠지는 근로자 부담은, 대략 월급의 9% 안팎이다? (소득세와는 별개)",
      answer: true,
      explanation:
        "맞아요. 국민연금·건강보험·장기요양·고용보험을 합치면 근로자 부담이 월급(과세분)의 약 9%대예요. 여기에 소득세가 또 따로 붙어요. 그래서 세전과 실수령 차이가 꽤 나는 거예요.",
    },
    {
      type: "choice",
      prompt:
        "연봉이 그대로인데 다음 해 4월에 [건강보험료](term:health-insurance)가 갑자기 오르기도 해요. 가장 흔한 이유는?",
      options: [
        "작년에 덜 떼인 보험료를 실제 소득에 맞춰 정산해서",
        "나이가 한 살 늘어서",
        "은행 예금 이자율이 올라서",
        "물가가 올라서",
      ],
      answerIndex: 0,
      explanation:
        "[건강보험](term:health-insurance)도 매달은 '대략' 떼고 4월에 작년 소득으로 정산해요. 성과급 등으로 작년 소득이 예상보다 많았다면, 4월 월급에서 그만큼 추가로 떼여요. 깜짝 놀라지 않으려면 알아두면 좋아요.",
    },
    {
      type: "ox",
      prompt:
        "산재보험료는 일하다 다친 경우를 대비하는 보험이라, 보통 회사가 전액 부담한다?",
      answer: true,
      explanation:
        "맞아요. 산재보험은 사업주가 전액 부담하는 게 원칙이라 내 월급에선 안 빠져요. 4대 보험 중 유일하게 근로자 부담이 0인 항목이에요.",
    },
  ],
};
