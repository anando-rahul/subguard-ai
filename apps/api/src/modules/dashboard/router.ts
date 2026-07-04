import { Hono } from "hono";
import type { AuthVariables } from "../auth/middleware";
import { requireUser } from "../auth/middleware";
import { getDashboardSummary, getUpcomingBilling } from "./services";

export const dashboardRouter = new Hono<{ Variables: AuthVariables }>()
  .use("*", async (c, next) => {
    if (!requireUser(c)) return c.json({ error: "unauthorized" }, 401);
    await next();
  })
  .get("/summary", async (c) => {
    const user = requireUser(c);
    if (!user) return c.json({ error: "unauthorized" }, 401);

    return c.json(await getDashboardSummary(user.id), 200);
  })
  .get("/upcoming-billing", async (c) => {
    const user = requireUser(c);
    if (!user) return c.json({ error: "unauthorized" }, 401);

    return c.json({ items: await getUpcomingBilling(user.id) }, 200);
  });
