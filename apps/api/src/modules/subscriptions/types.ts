import type {
  BillingCycle,
  BillingSource,
  Currency,
  SubscriptionCategory,
  SubscriptionStatus,
  UsageFrequency,
} from "../../utils/prisma";

export type SubscriptionResponse = {
  billingCycle: BillingCycle;
  billingSource: BillingSource;
  category: SubscriptionCategory;
  createdAt: string;
  currency: Currency;
  id: string;
  isCancellationCandidate: boolean;
  name: string;
  nextBillingDate: string;
  notes: string | null;
  paymentMethod: string | null;
  price: number;
  status: SubscriptionStatus;
  updatedAt: string;
  usageFrequency: UsageFrequency;
};
