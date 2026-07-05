import { describe, expect, it } from "vitest";
import type { Subscription } from "./types";
import { needsBillingAttention, subscriptionToFormValues } from "./utils";

describe("subscription utilities", () => {
  it("flags past-due and next-seven-day billing dates", () => {
    expect(
      needsBillingAttention({ nextBillingDate: "2026-07-04", status: "ACTIVE" }, "2026-07-05"),
    ).toBe(true);
    expect(
      needsBillingAttention({ nextBillingDate: "2026-07-12", status: "TRIAL" }, "2026-07-05"),
    ).toBe(true);
    expect(
      needsBillingAttention({ nextBillingDate: "2026-07-13", status: "ACTIVE" }, "2026-07-05"),
    ).toBe(false);
  });

  it("excludes cancelled subscriptions", () => {
    expect(
      needsBillingAttention({ nextBillingDate: "2026-07-05", status: "CANCELLED" }, "2026-07-05"),
    ).toBe(false);
  });

  it("retains billing source when preparing edit form values", () => {
    const subscription = {
      billingCycle: "MONTHLY",
      billingSource: "APPLE_APP_STORE",
      category: "ENTERTAINMENT",
      createdAt: "2026-07-05T00:00:00.000Z",
      currency: "IDR",
      id: "subscription-id",
      isCancellationCandidate: false,
      name: "Streaming Service",
      nextBillingDate: "2026-08-01",
      notes: null,
      paymentMethod: null,
      price: 99_000,
      status: "ACTIVE",
      updatedAt: "2026-07-05T00:00:00.000Z",
      usageFrequency: "OFTEN",
    } satisfies Subscription;

    expect(subscriptionToFormValues(subscription)).toMatchObject({
      billingSource: "APPLE_APP_STORE",
      notes: "",
      paymentMethod: "",
      price: "99000",
    });
  });
});
