import { describe, expect, it } from "vitest";
import { i18n } from "./i18n";

describe("platform i18n", () => {
  it("loads critical English and Indonesian product translations", () => {
    expect(i18n.t("nav.brand", { lng: "en" })).toBe("SubGuardAI");
    expect(i18n.t("nav.dashboard", { lng: "id" })).toBe("Dasbor");
    expect(i18n.t("landing.hero.title", { lng: "en" })).toBe(
      "Stop losing money on forgotten subscriptions",
    );
    expect(i18n.t("landing.benefits.visibility.title", { lng: "id" })).toBe("Lacak biaya rutin");
    expect(i18n.t("landing.trust.manual.title", { lng: "en" })).toBe("Manual by design");
    expect(i18n.t("landing.benefits.reminders.label", { lng: "id" })).toBe("Sebelum ditagihkan");
    expect(i18n.t("dashboard.empty.title", { lng: "en" })).toBe("Your subscription list is empty");
    expect(i18n.t("dashboard.error.retry", { lng: "id" })).toBe("Coba lagi");
    expect(i18n.t("nav.subscriptions", { lng: "en" })).toBe("Subscriptions");
    expect(i18n.t("dashboard.summary.monthlySaving", { lng: "id" })).toBe(
      "Potensi penghematan bulanan",
    );
    expect(i18n.t("subscriptions.actions.markCandidate", { lng: "en" })).toBe("Mark candidate");
    expect(i18n.t("subscriptions.categories.ENTERTAINMENT", { lng: "id" })).toBe("Hiburan");
    expect(i18n.t("subscriptions.billingSources.UNKNOWN", { lng: "en" })).toBe("I Am Not Sure");
    expect(i18n.t("subscriptions.billingSources.CARD_OR_BANK", { lng: "id" })).toBe(
      "Debit Otomatis Kartu/Bank",
    );
    expect(i18n.t("subscriptions.actions.howToCancel", { lng: "en" })).toBe("How To Cancel");
    expect(i18n.t("subscriptions.cancellation.sourceQuestion.title", { lng: "id" })).toBe(
      "Di mana Anda berlangganan layanan ini?",
    );
  });
});
