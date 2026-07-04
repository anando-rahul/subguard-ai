import type { BillingCycle, SubscriptionStatus } from "../subscriptions/types";

export type DashboardSummary = {
  activeSubscriptionCount: number;
  cancellationCandidateCount: number;
  estimatedMonthlySaving: number;
  estimatedMonthlySpend: number;
  estimatedYearlySpend: number;
  trialSubscriptionCount: number;
};

export type UpcomingBillingItem = {
  billingCycle: BillingCycle;
  currency: "IDR";
  daysUntilBilling: number;
  id: string;
  isDueSoon: boolean;
  name: string;
  nextBillingDate: string;
  price: number;
  status: SubscriptionStatus;
};
