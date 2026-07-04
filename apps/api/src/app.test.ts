import { describe, expect, it } from "vitest";
import { app } from "./app";

describe("api app", () => {
  it("returns health status", async () => {
    const response = await app.request("/health");

    await expect(response.json()).resolves.toEqual({
      ok: true,
      service: "api",
    });
    expect(response.status).toBe(200);
  });

  it.each([
    "/subscriptions",
    "/subscriptions/subscription-id",
    "/dashboard/summary",
    "/dashboard/upcoming-billing",
  ])("protects %s", async (path) => {
    const response = await app.request(path);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "unauthorized" });
  });
});
