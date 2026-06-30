import type { Lesson } from "@/lib/schema";

export const yearEndTax: Lesson = {
  id: "year-end-tax",
  unitId: "u-tax-2",
  order: 2,
  title: "연말정산, 13월의 월급?",
  durationMin: 4,
  intro:
    "매달 떼인 세금은 '대략' 떼인 거예요. 1년 치를 모아 실제 낼 세금과 비교해, 더 냈으면 돌려주고 덜 냈으면 더 걷는 게 [연말정산](term:year-end-settlement)이에요.\n'13월의 월급'이라 불리지만, 사실은 내 돈을 돌려받는 거랍니다.",
  glossary: ["year-end-settlement", "withholding", "income-deduction"],
  questions: [
    {
      type: "choice",
      prompt:
        "[연말정산](term:year-end-settlement)에서 돈을 '환급받는다'는 건 정확히 무슨 뜻일까요?",
      options: [
        "나라가 공짜로 보너스를 얹어 주는 것",
        "올해는 세금을 한 푼도 안 내도 되는 것",
        "1년간 미리 떼인 세금이 실제 낼 세금보다 많아서, 그 차액을 돌려받는 것",
        "월급이 한 달치 더 오르는 것",
      ],
      answerIndex: 2,
      explanation:
        "환급은 '내가 미리 더 낸 세금'을 돌려받는 거예요. [원천징수](term:withholding)로 매달 넉넉히 떼였다가 정산 때 돌아오는 것뿐, 공돈이 생기는 건 아니에요. 그래서 환급이 크다고 꼭 이득인 것도 아니에요(그만큼 1년간 내 돈이 묶여 있었으니까요).",
    },
    {
      type: "ox",
      prompt:
        "공제를 많이 챙길수록 환급이 커지니까, 미리 떼인 세금보다도 훨씬 많이 무한정 돌려받을 수 있다?",
      answer: false,
      explanation:
        "아니에요. 돌려받는 한도는 '내가 1년간 미리 낸 세금([기납부세액])'이에요. 공제로 실제 낼 세금이 0이 되면, 거기서 더 깎을 게 없어 환급도 멈춰요. 그래서 소득이 적어 세금을 거의 안 낸 사람은 공제를 많이 받아도 돌려받을 게 적어요.",
    },
    {
      type: "choice",
      prompt:
        "맞벌이 부부가 연말정산에서 흔히 쓰는 절세 방법은? (상황 따라 달라요)",
      options: [
        "부양가족 공제를 소득(세율)이 더 높은 배우자 쪽으로 몰아주기",
        "무조건 둘이 정확히 반반 나누기",
        "둘 다 공제를 안 받기",
        "소득이 더 적은 쪽으로 몰아주기",
      ],
      answerIndex: 0,
      explanation:
        "[소득공제](term:income-deduction)는 세율이 높을수록 효과가 커요. 그래서 부양가족 공제 등은 소득이 높은 배우자가 받는 게 보통 유리해요. (단, 의료비처럼 기준이 따로 있는 항목도 있어 늘 그런 건 아니에요.)",
    },
  ],
};
