import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "./app";
import {
  addMonthsToDateOnly,
  formatDateOnly,
  getJakartaDateOnly,
  parseDateOnly,
} from "./utils/date";
import { prisma } from "./utils/prisma";

const runDatabaseTests = process.env.RUN_DATABASE_INTEGRATION_TESTS === "1";
const suffix = randomUUID();
const emails = [`phase2-a-${suffix}@subguard.local`, `phase2-b-${suffix}@subguard.local`];
let userACookie = "";
let userBCookie = "";

function addDays(value: string, days: number) {
  const date = parseDateOnly(value);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDateOnly(date);
}

async function signUp(email: string, name: string) {
  const response = await app.request("/api/auth/sign-up/email", {
    body: JSON.stringify({ email, name, password: "temporary-password-123" }),
    headers: {
      "content-type": "application/json",
      origin: "http://localhost:3000",
    },
    method: "POST",
  });
  expect(response.status).toBe(200);

  const cookie = response.headers.get("set-cookie")?.split(";")[0];
  expect(cookie).toBeTruthy();
  return cookie ?? "";
}

function authenticatedRequest(path: string, cookie: string, init?: RequestInit) {
  return app.request(path, {
    ...init,
    headers: {
      ...init?.headers,
      cookie,
      origin: "http://localhost:3000",
    },
  });
}

describe.skipIf(!runDatabaseTests)("subscription database integration", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: emails } } });
    userACookie = await signUp(emails[0], "Phase Two A");
    userBCookie = await signUp(emails[1], "Phase Two B");
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: emails } } });
  });

  it("persists subscriptions, calculates totals, filters billing, and isolates ownership", async () => {
    const today = getJakartaDateOnly();
    const createBodies = [
      {
        billingCycle: "MONTHLY",
        category: "ENTERTAINMENT",
        currency: "IDR",
        isCancellationCandidate: true,
        name: "Monthly Candidate",
        nextBillingDate: today,
        notes: "Integration verification",
        paymentMethod: "Debit card",
        price: 120_000,
        status: "ACTIVE",
        usageFrequency: "RARELY",
      },
      {
        billingCycle: "YEARLY",
        billingSource: "GOOGLE_PLAY",
        category: "WORK_TOOLS",
        currency: "IDR",
        isCancellationCandidate: false,
        name: "Yearly Trial",
        nextBillingDate: addDays(today, 7),
        notes: null,
        paymentMethod: null,
        price: 1_200_000,
        status: "TRIAL",
        usageFrequency: "OFTEN",
      },
      {
        billingCycle: "MONTHLY",
        category: "OTHER",
        currency: "IDR",
        isCancellationCandidate: true,
        name: "Cancelled Service",
        nextBillingDate: addDays(today, 1),
        notes: null,
        paymentMethod: null,
        price: 500_000,
        status: "CANCELLED",
        usageFrequency: "NOT_SURE",
      },
      {
        billingCycle: "MONTHLY",
        category: "OTHER",
        currency: "IDR",
        isCancellationCandidate: false,
        name: "Past Cancelled Service",
        nextBillingDate: "2020-01-01",
        notes: null,
        paymentMethod: null,
        price: 10_000,
        status: "CANCELLED",
        usageFrequency: "NOT_SURE",
      },
    ];

    const invalid = await authenticatedRequest("/subscriptions", userACookie, {
      body: JSON.stringify({ ...createBodies[0], price: 0 }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });
    expect(invalid.status).toBe(400);

    const invalidBillingSource = await authenticatedRequest("/subscriptions", userACookie, {
      body: JSON.stringify({ ...createBodies[0], billingSource: "CASHIER" }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });
    expect(invalidBillingSource.status).toBe(400);

    const created = [];
    for (const body of createBodies) {
      const response = await authenticatedRequest("/subscriptions", userACookie, {
        body: JSON.stringify(body),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      expect(response.status).toBe(201);
      created.push(await response.json());
    }

    const monthlyId = (created[0] as { id: string }).id;
    const unaffectedId = (created[1] as { id: string }).id;
    expect(created[0]).toMatchObject({ billingSource: "UNKNOWN" });
    expect(created[1]).toMatchObject({ billingSource: "GOOGLE_PLAY" });

    const detail = await authenticatedRequest(`/subscriptions/${monthlyId}`, userACookie);
    await expect(detail.json()).resolves.toMatchObject({ billingSource: "UNKNOWN" });
    const summary = await authenticatedRequest("/dashboard/summary", userACookie);
    await expect(summary.json()).resolves.toEqual({
      activeSubscriptionCount: 1,
      cancellationCandidateCount: 1,
      estimatedMonthlySaving: 120_000,
      estimatedMonthlySpend: 220_000,
      estimatedYearlySpend: 2_640_000,
      trialSubscriptionCount: 1,
    });

    const upcoming = await authenticatedRequest("/dashboard/upcoming-billing", userACookie);
    const upcomingBody = (await upcoming.json()) as {
      items: Array<{ daysUntilBilling: number; isDueSoon: boolean; name: string }>;
    };
    expect(upcomingBody.items).toHaveLength(2);
    expect(upcomingBody.items.map((item) => item.daysUntilBilling)).toEqual([0, 7]);
    expect(upcomingBody.items.every((item) => item.isDueSoon)).toBe(true);
    expect(upcomingBody.items.some((item) => item.name === "Cancelled Service")).toBe(false);

    const filtered = await authenticatedRequest(
      "/subscriptions?status=TRIAL&sort=nextBillingDateDesc",
      userACookie,
    );
    const filteredBody = (await filtered.json()) as {
      items: Array<{ billingSource: string; name: string }>;
    };
    expect(filteredBody.items.map((item) => item.name)).toEqual(["Yearly Trial"]);
    expect(filteredBody.items[0]?.billingSource).toBe("GOOGLE_PLAY");

    for (const request of [
      authenticatedRequest(`/subscriptions/${monthlyId}`, userBCookie),
      authenticatedRequest(`/subscriptions/${monthlyId}/candidate`, userBCookie, {
        body: JSON.stringify({ isCancellationCandidate: false }),
        headers: { "content-type": "application/json" },
        method: "PATCH",
      }),
      authenticatedRequest(`/subscriptions/${monthlyId}`, userBCookie, {
        body: JSON.stringify({ billingSource: "APPLE_APP_STORE" }),
        headers: { "content-type": "application/json" },
        method: "PATCH",
      }),
      authenticatedRequest(`/subscriptions/${monthlyId}/renew`, userBCookie, {
        method: "PATCH",
      }),
      authenticatedRequest(`/subscriptions/${monthlyId}/cancel`, userBCookie, {
        method: "PATCH",
      }),
      authenticatedRequest(`/subscriptions/${monthlyId}`, userBCookie, { method: "DELETE" }),
    ]) {
      expect((await request).status).toBe(404);
    }

    const updated = await authenticatedRequest(`/subscriptions/${monthlyId}`, userACookie, {
      body: JSON.stringify({ price: 180_000 }),
      headers: { "content-type": "application/json" },
      method: "PATCH",
    });
    expect(updated.status).toBe(200);
    await expect(updated.json()).resolves.toMatchObject({ price: 180_000 });

    const billingSourceUpdated = await authenticatedRequest(
      `/subscriptions/${monthlyId}`,
      userACookie,
      {
        body: JSON.stringify({ billingSource: "E_WALLET" }),
        headers: { "content-type": "application/json" },
        method: "PATCH",
      },
    );
    expect(billingSourceUpdated.status).toBe(200);
    await expect(billingSourceUpdated.json()).resolves.toMatchObject({ billingSource: "E_WALLET" });

    const candidate = await authenticatedRequest(
      `/subscriptions/${monthlyId}/candidate`,
      userACookie,
      {
        body: JSON.stringify({ isCancellationCandidate: false }),
        headers: { "content-type": "application/json" },
        method: "PATCH",
      },
    );
    expect(candidate.status).toBe(200);

    const unaffectedBefore = await authenticatedRequest(
      `/subscriptions/${unaffectedId}`,
      userACookie,
    );
    const unaffectedSubscription = (await unaffectedBefore.json()) as {
      nextBillingDate: string;
      status: string;
    };

    const cancelled = await authenticatedRequest(
      `/subscriptions/${monthlyId}/cancel`,
      userACookie,
      {
        method: "PATCH",
      },
    );
    expect(cancelled.status).toBe(200);
    await expect(cancelled.json()).resolves.toMatchObject({ status: "CANCELLED" });

    const renewed = await authenticatedRequest(`/subscriptions/${monthlyId}/renew`, userACookie, {
      method: "PATCH",
    });
    expect(renewed.status).toBe(200);
    await expect(renewed.json()).resolves.toMatchObject({
      nextBillingDate: formatDateOnly(addMonthsToDateOnly(parseDateOnly(today), 1)),
      status: "ACTIVE",
    });

    const unaffectedAfter = await authenticatedRequest(
      `/subscriptions/${unaffectedId}`,
      userACookie,
    );
    await expect(unaffectedAfter.json()).resolves.toMatchObject(unaffectedSubscription);

    const updatedSummary = await authenticatedRequest("/dashboard/summary", userACookie);
    await expect(updatedSummary.json()).resolves.toMatchObject({
      cancellationCandidateCount: 0,
      estimatedMonthlySaving: 0,
      estimatedMonthlySpend: 280_000,
    });
  });
});
