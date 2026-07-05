import { describe, expect, it } from "vitest";
import { subscriptionInputSchema, subscriptionUpdateSchema } from "./schema";

const validSubscription = {
  billingCycle: "MONTHLY",
  category: "ENTERTAINMENT",
  currency: "IDR",
  isCancellationCandidate: false,
  name: "Streaming Service",
  nextBillingDate: "2026-08-01",
  notes: null,
  paymentMethod: null,
  price: 99_000,
  status: "ACTIVE",
  usageFrequency: "OFTEN",
} as const;

describe("subscription billing-source schema", () => {
  it("defaults omitted create input to UNKNOWN", () => {
    expect(subscriptionInputSchema.parse(validSubscription).billingSource).toBe("UNKNOWN");
  });

  it("accepts valid values and rejects unknown enum values", () => {
    expect(
      subscriptionInputSchema.parse({
        ...validSubscription,
        billingSource: "APPLE_APP_STORE",
      }).billingSource,
    ).toBe("APPLE_APP_STORE");
    expect(
      subscriptionInputSchema.safeParse({
        ...validSubscription,
        billingSource: "CASHIER",
      }).success,
    ).toBe(false);
  });

  it("does not inject a billing source into unrelated partial updates", () => {
    expect(subscriptionUpdateSchema.parse({ price: 120_000 })).toEqual({ price: 120_000 });
  });
});
