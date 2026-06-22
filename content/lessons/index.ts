import type { Lesson } from "@/lib/schema";
import { welcome } from "@/content/lessons/welcome";
import { incomeExpense } from "@/content/lessons/income-expense";
import { budgetBasics } from "@/content/lessons/budget-basics";
import { emergencySaving } from "@/content/lessons/emergency-saving";
import { payslipBasics } from "@/content/lessons/payslip-basics";
import { fourInsurances } from "@/content/lessons/four-insurances";
import { deductionVsCredit } from "@/content/lessons/deduction-vs-credit";
import { yearEndTax } from "@/content/lessons/year-end-tax";

/** 모든 레슨. 레벨 1(돈의 기초) + 레벨 2(세금과 공제). */
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
];

const byId = new Map(allLessons.map((lesson) => [lesson.id, lesson]));

export function getLessonById(id: string): Lesson | undefined {
  return byId.get(id);
}

export function getLessonTitle(id: string): string {
  return byId.get(id)?.title ?? id;
}
