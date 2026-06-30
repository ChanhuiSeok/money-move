/** 전세 vs 월세 — 기회비용 기반 '월 실부담' 비교 (순수 함수).
   ⚠️ 교육용 추정치. 보증금 회수 리스크·집값 변동·세금 등은 빼고 단순화했어요.

   핵심 아이디어: 전세는 매달 나가는 돈이 없어 보이지만, 큰 보증금이 묶여
   '벌 수 있었던 이자(기회비용)'를 잃어요. 월세는 매달 월세가 나가죠.
   둘을 같은 '월 실부담'으로 환산해 비교한다. */

export type RentVsJeonseInput = {
  jeonseDeposit: number; // 전세 보증금
  jeonseLoan: number; // 그중 전세대출로 빌리는 돈
  jeonseLoanRate: number; // 전세대출 연이율(예: 0.04)
  monthlyDeposit: number; // 월세 보증금
  monthlyRent: number; // 월세(월)
  opportunityRate: number; // 자기자금 기회비용 연이율(예: 0.03)
};

export type RentVsJeonseResult = {
  jeonseMonthlyCost: number; // 전세 월 실부담
  monthlyTotalCost: number; // 월세 월 실부담
  cheaper: "jeonse" | "monthly" | "tie";
  monthlyDiff: number; // 두 방식의 월 차액(절댓값)
  yearlyDiff: number; // 연 차액(절댓값)
  // 분해(설명용)
  jeonseOppCost: number; // 전세 자기자금 기회비용(월)
  jeonseInterest: number; // 전세대출 이자(월)
  monthlyDepositOppCost: number; // 월세 보증금 기회비용(월)
};

/** 월 실부담을 환산해 전세와 월세를 비교한다. */
export function compareRentVsJeonse(
  input: RentVsJeonseInput,
): RentVsJeonseResult {
  const jeonseDeposit = Math.max(0, input.jeonseDeposit);
  // 대출은 보증금을 넘을 수 없다.
  const jeonseLoan = Math.min(Math.max(0, input.jeonseLoan), jeonseDeposit);
  const ownFunds = jeonseDeposit - jeonseLoan; // 자기자금(묶이는 돈)

  const oppMonthly = Math.max(0, input.opportunityRate) / 12;
  const loanMonthly = Math.max(0, input.jeonseLoanRate) / 12;

  const jeonseOppCost = Math.round(ownFunds * oppMonthly);
  const jeonseInterest = Math.round(jeonseLoan * loanMonthly);
  const jeonseMonthlyCost = jeonseOppCost + jeonseInterest;

  const monthlyDepositOppCost = Math.round(
    Math.max(0, input.monthlyDeposit) * oppMonthly,
  );
  const monthlyTotalCost =
    Math.max(0, input.monthlyRent) + monthlyDepositOppCost;

  const diff = monthlyTotalCost - jeonseMonthlyCost; // >0 이면 전세가 저렴
  const cheaper: RentVsJeonseResult["cheaper"] =
    diff > 0 ? "jeonse" : diff < 0 ? "monthly" : "tie";

  return {
    jeonseMonthlyCost,
    monthlyTotalCost,
    cheaper,
    monthlyDiff: Math.abs(diff),
    yearlyDiff: Math.abs(diff) * 12,
    jeonseOppCost,
    jeonseInterest,
    monthlyDepositOppCost,
  };
}
