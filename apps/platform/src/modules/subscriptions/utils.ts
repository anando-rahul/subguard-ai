import type { Subscription, SubscriptionFormValues } from "./types";

export const emptySubscriptionForm: SubscriptionFormValues = {
  billingCycle: "MONTHLY",
  billingSource: "UNKNOWN",
  category: "ENTERTAINMENT",
  currency: "IDR",
  isCancellationCandidate: false,
  name: "",
  nextBillingDate: "",
  notes: "",
  paymentMethod: "",
  price: "",
  status: "ACTIVE",
  usageFrequency: "NOT_SURE",
};

export function subscriptionToFormValues(subscription: Subscription): SubscriptionFormValues {
  return {
    billingCycle: subscription.billingCycle,
    billingSource: subscription.billingSource,
    category: subscription.category,
    currency: subscription.currency,
    isCancellationCandidate: subscription.isCancellationCandidate,
    name: subscription.name,
    nextBillingDate: subscription.nextBillingDate,
    notes: subscription.notes ?? "",
    paymentMethod: subscription.paymentMethod ?? "",
    price: String(subscription.price),
    status: subscription.status,
    usageFrequency: subscription.usageFrequency,
  };
}

export function formatIdr(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    currency: "IDR",
    maximumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

export function formatDateOnly(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00.000Z`));
}

export function getJakartaDateOnly(value = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Jakarta",
    year: "numeric",
  }).formatToParts(value);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}

export function needsBillingAttention(
  subscription: Pick<Subscription, "nextBillingDate" | "status">,
  today = getJakartaDateOnly(),
) {
  if (subscription.status === "CANCELLED") return false;

  const cutoff = new Date(`${today}T00:00:00.000Z`);
  cutoff.setUTCDate(cutoff.getUTCDate() + 7);

  return subscription.nextBillingDate <= cutoff.toISOString().slice(0, 10);
}
