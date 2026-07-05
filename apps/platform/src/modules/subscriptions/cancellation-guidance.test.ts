import { describe, expect, it } from "vitest";
import {
  billingSourcePromptChoices,
  cancellationGuideStepCounts,
  getCancellationGuideStepKeys,
  recurringPaymentChoices,
} from "./cancellation-guidance";
import { billingSources } from "./types";

describe("cancellation guidance", () => {
  it("covers every persisted billing source", () => {
    expect(Object.keys(cancellationGuideStepCounts).sort()).toEqual([...billingSources].sort());

    for (const source of billingSources) {
      expect(getCancellationGuideStepKeys(source)).toHaveLength(
        cancellationGuideStepCounts[source],
      );
    }
  });

  it("keeps eight initial choices and disambiguates recurring payments", () => {
    expect(billingSourcePromptChoices).toHaveLength(8);
    expect(billingSourcePromptChoices).toContain("RECURRING_PAYMENT");
    expect(recurringPaymentChoices).toEqual(["E_WALLET", "CARD_OR_BANK"]);
  });
});
