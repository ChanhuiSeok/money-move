import type { Lesson } from "@/lib/schema";

export const jeonseWolse: Lesson = {
  id: "jeonse-wolse",
  unitId: "u-housing-1",
  order: 1,
  title: "전세, 월세, 뭐가 달라요?",
  durationMin: 4,
  intro:
    "독립의 첫 관문, 집 구하기. 한국엔 [전세](term:jeonse)와 [월세](term:wolse)라는 두 갈래가 있어요.\n둘의 차이와, 무엇보다 큰돈인 [보증금](term:rental-deposit)을 어떻게 지키는지까지 같이 볼게요.",
  glossary: [
    "jeonse",
    "wolse",
    "rental-deposit",
    "jeonse-loan",
    "move-in-report",
    "confirmed-date",
    "jeonse-guarantee",
  ],
  questions: [
    {
      type: "choice",
      prompt: "[전세](term:jeonse)와 [월세](term:wolse)의 가장 큰 차이는?",
      options: [
        "전세는 매달 임대료를 내고, 월세는 안 낸다",
        "전세는 큰 보증금을 맡기고 매달 월세가 없지만, 월세는 작은 보증금에 매달 임대료를 낸다",
        "전세는 내 집이 되고, 월세는 안 된다",
        "둘은 이름만 다를 뿐 똑같다",
      ],
      answerIndex: 1,
      explanation:
        "[전세](term:jeonse)는 큰 [보증금](term:rental-deposit)을 맡기는 대신 매달 나가는 월세가 없어요. 계약이 끝나면 보증금을 그대로 돌려받죠. [월세](term:wolse)는 보증금이 작은 대신 매달 임대료를 내요. 둘 다 '빌리는' 거라 집이 내 소유가 되진 않아요.",
    },
    {
      type: "ox",
      prompt:
        "[전세](term:jeonse)는 매달 월세가 없으니, 전세대출을 받아도 '매달 나가는 돈'은 전혀 없다?",
      answer: false,
      explanation:
        "아니에요. 보증금을 모두 내 돈으로 못 채우면 [전세대출](term:jeonse-loan)을 받는데, 그럼 매달 '대출 이자'가 나가요. 또 큰돈이 보증금으로 묶여 받을 수 있었던 이자(기회비용)도 사라지죠. 그래서 전세도 '공짜'는 아니에요. (전세 vs 월세 계산기로 따져볼 수 있어요!)",
    },
    {
      type: "choice",
      prompt:
        "이사한 뒤, 큰 [보증금](term:rental-deposit)을 지키려면 가장 먼저 챙겨야 할 두 가지는?",
      options: [
        "도배와 청소",
        "전입신고와 확정일자 받기",
        "집들이와 집 보험",
        "관리비 자동이체 신청",
      ],
      answerIndex: 1,
      explanation:
        "[전입신고](term:move-in-report)(새 주소 신고)와 [확정일자](term:confirmed-date)(계약서에 공적 날짜 도장)를 해두면, 혹시 집이 경매로 넘어가도 보증금을 먼저 돌려받을 순위가 생겨요. 이사하면 '바로 그날' 챙기는 게 안전해요.",
    },
    {
      type: "ox",
      prompt:
        "집주인이 [보증금](term:rental-deposit)을 제때 못 돌려줄 위험에 대비해, 보증기관이 대신 돌려주는 [전세보증보험](term:jeonse-guarantee)이라는 안전장치가 있다?",
      answer: true,
      explanation:
        "맞아요. [전세보증보험](term:jeonse-guarantee)에 들어두면, 집주인이 보증금을 안(못) 돌려줄 때 보증기관이 대신 돌려줘요. 전세 사기·'깡통전세'(집값보다 보증금이 큰 경우) 위험을 크게 덜어 주죠. 전세 계약 땐 꼭 알아두면 좋은 제도예요.",
    },
  ],
};
