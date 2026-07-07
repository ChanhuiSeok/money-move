import type { Lesson } from "@/lib/schema";
import { welcome } from "@/content/lessons/welcome";
import { incomeExpense } from "@/content/lessons/income-expense";
import { budgetBasics } from "@/content/lessons/budget-basics";
import { emergencySaving } from "@/content/lessons/emergency-saving";
import { payslipBasics } from "@/content/lessons/payslip-basics";
import { fourInsurances } from "@/content/lessons/four-insurances";
import { deductionVsCredit } from "@/content/lessons/deduction-vs-credit";
import { yearEndTax } from "@/content/lessons/year-end-tax";
import { stockBasics } from "@/content/lessons/stock-basics";
import { brokerageAccount } from "@/content/lessons/brokerage-account";
import { buySellOrder } from "@/content/lessons/buy-sell-order";
import { riskDiversification } from "@/content/lessons/risk-diversification";
import { etfBasics } from "@/content/lessons/etf-basics";
import { bondBasics } from "@/content/lessons/bond-basics";
import { interestRates } from "@/content/lessons/interest-rates";
import { inflationRates } from "@/content/lessons/inflation-rates";
import { exchangeRates } from "@/content/lessons/exchange-rates";
import { usInvesting } from "@/content/lessons/us-investing";
import { marketEvents } from "@/content/lessons/market-events";
import { jeonseWolse } from "@/content/lessons/jeonse-wolse";
import { housingSubscription } from "@/content/lessons/housing-subscription";

/** 모든 레슨. 레벨 1(돈의 기초) + 레벨 2(세금과 공제) + 레벨 3(투자 첫걸음) + 레벨 4(투자, 한 걸음 더). */
export const allLessons: Lesson[] = [
  // 레벨 1
  welcome,
  incomeExpense,
  budgetBasics,
  emergencySaving,
  // 레벨 2
  payslipBasics,
  fourInsurances,
  deductionVsCredit,
  yearEndTax,
  // 레벨 3
  stockBasics,
  brokerageAccount,
  buySellOrder,
  riskDiversification,
  etfBasics,
  bondBasics,
  // 레벨 4
  interestRates,
  inflationRates,
  exchangeRates,
  usInvesting,
  marketEvents,
  // 레벨 5
  jeonseWolse,
  housingSubscription,
];

const byId = new Map(allLessons.map((lesson) => [lesson.id, lesson]));

export function getLessonById(id: string): Lesson | undefined {
  return byId.get(id);
}

export function getLessonTitle(id: string): string {
  return byId.get(id)?.title ?? id;
}
