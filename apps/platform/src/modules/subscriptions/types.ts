export const billingCycles = ["MONTHLY", "YEARLY"] as const;
export const subscriptionCategories = [
  "ENTERTAINMENT",
  "WORK_TOOLS",
  "FAMILY",
  "EDUCATION",
  "CLOUD",
  "TELCO",
  "AI_TOOLS",
  "OTHER",
] as const;
export const subscriptionStatuses = [
  "ACTIVE",
  "TRIAL",
  "PENDING_CANCELLATION",
  "CANCELLED",
] as const;
export const usageFrequencies = ["OFTEN", "SOMETIMES", "RARELY", "NOT_SURE"] as const;

export type BillingCycle = (typeof billingCycles)[number];
export type SubscriptionCategory = (typeof subscriptionCategories)[number];
export type SubscriptionStatus = (typeof subscriptionStatuses)[number];
export type UsageFrequency = (typeof usageFrequencies)[number];
export type SubscriptionSort = "nextBillingDateAsc" | "nextBillingDateDesc";

export type Subscription = {
  billingCycle: BillingCycle;
  category: SubscriptionCategory;
  createdAt: string;
  currency: "IDR";
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

export type SubscriptionInput = {
  billingCycle: BillingCycle;
  category: SubscriptionCategory;
  currency: "IDR";
  isCancellationCandidate: boolean;
  name: string;
  nextBillingDate: string;
  notes?: string | null;
  paymentMethod?: string | null;
  price: number;
  status: SubscriptionStatus;
  usageFrequency: UsageFrequency;
};

export type SubscriptionFilters = {
  category?: SubscriptionCategory;
  sort: SubscriptionSort;
  status?: SubscriptionStatus;
};

export type SubscriptionFormValues = Omit<SubscriptionInput, "price"> & { price: string };
export type SubscriptionFieldErrors = Partial<Record<keyof SubscriptionFormValues, string>>;
