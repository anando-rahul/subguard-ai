import type { BillingCycle, SubscriptionStatus } from "../../utils/prisma";
import { differenceInCalendarDays, formatDateOnly } from "../../utils/date";
import {
  getMonthlyNormalizedCost,
  getYearlyNormalizedCost,
  sumMoney,
} from "../subscriptions/calculations";

export type SummaryItem = {
  billingCycle: BillingCycle;
  isCancellationCandidate: boolean;
  price: { toString(): string };
  status: SubscriptionStatus;
};

export function calculateDashboardSummary(items: SummaryItem[]) {
  const included = items.filter((item) => item.status !== "CANCELLED");
  const candidates = included.filter((item) => item.isCancellationCandidate);

  return {
    activeSubscriptionCount: included.filter((item) => item.status === "ACTIVE").length,
    cancellationCandidateCount: candidates.length,
    estimatedMonthlySaving: sumMoney(
      candidates.map((item) => getMonthlyNormalizedCost(item.price.toString(), item.billingCycle)),
    ).toNumber(),
    estimatedMonthlySpend: sumMoney(
      included.map((item) => getMonthlyNormalizedCost(item.price.toString(), item.billingCycle)),
    ).toNumber(),
    estimatedYearlySpend: sumMoney(
      included.map((item) => getYearlyNormalizedCost(item.price.toString(), item.billingCycle)),
    ).toNumber(),
    trialSubscriptionCount: included.filter((item) => item.status === "TRIAL").length,
  };
}

export function toUpcomingBillingItem(
  item: {
    billingCycle: BillingCycle;
    currency: "IDR";
    id: string;
    name: string;
    nextBillingDate: Date;
    price: { toNumber(): number };
    status: SubscriptionStatus;
  },
  today: string,
) {
  const nextBillingDate = formatDateOnly(item.nextBillingDate);
  const daysUntilBilling = differenceInCalendarDays(nextBillingDate, today);

  return {
    billingCycle: item.billingCycle,
    currency: item.currency,
    daysUntilBilling,
    id: item.id,
    isDueSoon: daysUntilBilling >= 0 && daysUntilBilling <= 7,
    name: item.name,
    nextBillingDate,
    price: item.price.toNumber(),
    status: item.status,
  };
}
