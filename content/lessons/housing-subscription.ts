import type { Lesson } from "@/lib/schema";

export const housingSubscription: Lesson = {
  id: "housing-subscription",
  unitId: "u-housing-1",
  order: 2,
  title: "청약, 내 집 마련의 첫 단추",
  durationMin: 4,
  intro:
    "새로 짓는 아파트를 분양받으려면 '[청약](term:housing-subscription)'을 해야 해요. 그 자격을 만드는 게 [주택청약종합저축](term:housing-subscription)이죠.\n당장 집을 살 게 아니어도, 일찍 만들어두면 쓸모가 큰 통장이에요. 왜 그런지 볼게요.",
  glossary: ["housing-subscription", "homeless-householder"],
  questions: [
    {
      type: "choice",
      prompt: "[주택청약종합저축](term:housing-subscription)은 한마디로 무엇일까요?",
      options: [
        "넣으면 원금이 두 배가 되는 특별 적금",
        "새로 분양하는 아파트에 청약(신청)할 자격을 만드는 저축 통장",
        "집을 살 때 정부가 공짜로 주는 돈",
        "전세 보증금을 대신 내주는 보험",
      ],
      answerIndex: 1,
      explanation:
        "[주택청약종합저축](term:housing-subscription)은 새 아파트 분양에 '신청할 자격'을 쌓는 통장이에요. 매달 꾸준히 넣으며 가입 기간·납입 횟수를 채우면, 나중에 청약할 때 유리해져요. 그래서 '일단 만들어두라'는 말이 많죠.",
    },
    {
      type: "ox",
      prompt:
        "[무주택 세대주](term:homeless-householder)라면, [주택청약종합저축](term:housing-subscription) 납입액의 일부를 연말정산 때 소득공제로 돌려받을 수 있다?",
      answer: true,
      explanation:
        "맞아요. [무주택 세대주](term:homeless-householder)이고 총급여가 일정 이하면, 청약저축 납입액(연 한도 내)의 일부를 소득공제해 줘요. 집을 준비하면서 세금도 아끼는 셈이라, 연말정산 시뮬레이터에서 '주택청약저축' 항목으로 효과를 확인할 수 있어요.",
    },
    {
      type: "choice",
      prompt:
        "일반적으로 아파트 [청약](term:housing-subscription) 당첨에 '유리하게' 작용하는 조건에 가장 가까운 것은?",
      options: [
        "통장에 큰돈을 한 번에 넣어 둔 사람",
        "집을 여러 채 가진 사람",
        "무주택 기간이 길고, 청약통장 가입 기간·부양가족이 많은 사람",
        "나이가 어릴수록 무조건 유리",
      ],
      answerIndex: 2,
      explanation:
        "인기 단지는 '가점제'로 뽑는 경우가 많아요. 무주택 기간이 길수록, 청약통장 가입 기간이 길수록, 부양가족이 많을수록 점수가 높죠. 한 번에 큰돈을 넣는다고 유리해지는 게 아니라, '꾸준히·오래'가 핵심이라 일찍 시작할수록 좋아요.",
    },
  ],
};
