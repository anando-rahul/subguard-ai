import { Prisma } from "../../utils/prisma";
import { describe, expect, it } from "vitest";
import { calculateDashboardSummary, toUpcomingBillingItem } from "./calculations";

describe("dashboard calculations", () => {
  it("excludes cancelled subscriptions and calculates candidate savings", () => {
    const summary = calculateDashboardSummary([
      {
        billingCycle: "MONTHLY",
        isCancellationCandidate: true,
        price: new Prisma.Decimal(120_000),
        status: "ACTIVE",
      },
      {
        billingCycle: "YEARLY",
        isCancellationCandidate: false,
        price: new Prisma.Decimal(1_200_000),
        status: "TRIAL",
      },
      {
        billingCycle: "MONTHLY",
        isCancellationCandidate: true,
        price: new Prisma.Decimal(500_000),
        status: "CANCELLED",
      },
    ]);

    expect(summary).toEqual({
      activeSubscriptionCount: 1,
      cancellationCandidateCount: 1,
      estimatedMonthlySaving: 120_000,
      estimatedMonthlySpend: 220_000,
      estimatedYearlySpend: 2_640_000,
      trialSubscriptionCount: 1,
    });
  });

  it("includes day zero and day seven in the due-soon boundary", () => {
    const base = {
      billingCycle: "MONTHLY" as const,
      currency: "IDR" as const,
      id: "subscription-id",
      name: "Service",
      price: new Prisma.Decimal(10_000),
      status: "ACTIVE" as const,
    };

    expect(
      toUpcomingBillingItem(
        { ...base, nextBillingDate: new Date("2026-07-04T00:00:00Z") },
        "2026-07-04",
      ).isDueSoon,
    ).toBe(true);
    expect(
      toUpcomingBillingItem(
        { ...base, nextBillingDate: new Date("2026-07-11T00:00:00Z") },
        "2026-07-04",
      ).isDueSoon,
    ).toBe(true);
    expect(
      toUpcomingBillingItem(
        { ...base, nextBillingDate: new Date("2026-07-12T00:00:00Z") },
        "2026-07-04",
      ).isDueSoon,
    ).toBe(false);
  });
});
