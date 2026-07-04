import { describe, expect, it } from "vitest";
import { getMonthlyNormalizedCost, getYearlyNormalizedCost, sumMoney } from "./calculations";

describe("subscription calculations", () => {
  it("normalizes monthly subscriptions", () => {
    expect(getMonthlyNormalizedCost(95_000, "MONTHLY").toNumber()).toBe(95_000);
    expect(getYearlyNormalizedCost(95_000, "MONTHLY").toNumber()).toBe(1_140_000);
  });

  it("normalizes yearly subscriptions", () => {
    expect(getMonthlyNormalizedCost(1_200_000, "YEARLY").toNumber()).toBe(100_000);
    expect(getYearlyNormalizedCost(1_200_000, "YEARLY").toNumber()).toBe(1_200_000);
  });

  it("aggregates decimal values without floating point accumulation", () => {
    expect(
      sumMoney([
        getMonthlyNormalizedCost("100000.50", "MONTHLY"),
        getMonthlyNormalizedCost("1200000", "YEARLY"),
      ]).toNumber(),
    ).toBe(200_000.5);
  });
});
