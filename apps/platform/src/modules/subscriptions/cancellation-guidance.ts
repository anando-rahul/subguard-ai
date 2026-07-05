import type { BillingSource } from "./types";

export const billingSourcePromptChoices = [
  "APPLE_APP_STORE",
  "GOOGLE_PLAY",
  "MERCHANT_WEBSITE",
  "IN_APP_DIRECT",
  "RECURRING_PAYMENT",
  "TELCO_BUNDLE",
  "INVOICE_MANUAL",
  "UNKNOWN",
] as const;

export type BillingSourcePromptChoice = (typeof billingSourcePromptChoices)[number];

export const recurringPaymentChoices = [
  "E_WALLET",
  "CARD_OR_BANK",
] as const satisfies readonly BillingSource[];

export const cancellationGuideStepCounts = {
  APPLE_APP_STORE: 4,
  CARD_OR_BANK: 4,
  E_WALLET: 4,
  GOOGLE_PLAY: 4,
  IN_APP_DIRECT: 4,
  INVOICE_MANUAL: 4,
  MERCHANT_WEBSITE: 4,
  TELCO_BUNDLE: 4,
  UNKNOWN: 5,
} as const satisfies Record<BillingSource, number>;

export function getCancellationGuideStepKeys(source: BillingSource) {
  return Array.from(
    { length: cancellationGuideStepCounts[source] },
    (_, index) => `subscriptions.cancellation.guides.${source}.steps.${index + 1}`,
  );
}
