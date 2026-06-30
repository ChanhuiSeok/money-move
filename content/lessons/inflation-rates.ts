import type { Lesson } from "@/lib/schema";

export const inflationRates: Lesson = {
  id: "inflation-rates",
  unitId: "u-macro-1",
  order: 2,
  title: "물가가 오르면, 금리는?",
  durationMin: 5,
  intro:
    "[물가 상승](term:inflation)과 [기준금리](term:base-rate)는 따로 노는 것 같지만, 사실 한 몸처럼 움직여요.\n뉴스에 '물가·금리'가 늘 붙어 다니는 이유를 직관으로 잡아 볼게요.",
  glossary: ["inflation", "base-rate"],
  questions: [
    {
      type: "ox",
      prompt:
        "'[물가 상승](term:inflation)(인플레이션)'은 같은 돈으로 살 수 있는 게 줄어든다는 뜻이라, 결국 돈의 가치가 떨어지는 것이다?",
      answer: true,
      explanation:
        "맞아요. 물가가 오르면 1만 원으로 살 수 있는 양이 줄어요 = 돈의 가치가 떨어진 거예요. 그래서 현금을 그냥 두면 가만히 있어도 구매력이 조금씩 깎여요.",
    },
    {
      type: "choice",
      prompt:
        "물가가 너무 빠르게 오를 때, 중앙은행이 흔히 꺼내는 대응으로 가장 알맞은 건?",
      options: [
        "기준금리를 올려 소비·투자를 식힌다",
        "기준금리를 내려 돈을 더 풀어 준다",
        "물가는 중앙은행과 상관없으니 그냥 둔다",
        "기업들에게 월급을 강제로 올리게 한다",
      ],
      answerIndex: 0,
      explanation:
        "물가가 과열되면 중앙은행은 [기준금리](term:base-rate)를 올려요. 돈 빌리기가 비싸지면 소비·투자가 줄고, 과열된 수요가 식으면서 물가 오름세가 잡히죠. 반대로 경기가 너무 가라앉으면 금리를 내려 돈을 풀어요. (즉 물가 상승 '자체'가 금리를 올리는 게 아니라, 중앙은행이 대응으로 올리는 거예요.)",
    },
    {
      type: "choice",
      prompt:
        "예금 이자가 연 3%인데 그해 [물가](term:inflation)가 4% 올랐어요. 내 돈의 '실제 구매력'은 어떻게 됐을까요?",
      options: [
        "이자 3%만큼 무조건 부자가 됐다",
        "물가와 이자는 상관없어 그대로다",
        "이자를 받아도 물가가 더 올라, 실질적으로는 구매력이 줄었다",
        "원금이 4% 늘었다",
      ],
      answerIndex: 2,
      explanation:
        "이자로 3%를 벌어도 물가가 4% 올랐다면, 실제로 살 수 있는 양은 오히려 줄어요(대략 −1%). 이렇게 '이자 − 물가상승률'을 실질금리라고 해요. 그래서 '이자를 받으니 무조건 이득'이 아니라, 물가도 함께 봐야 진짜 손익이 보여요.",
    },
  ],
};
