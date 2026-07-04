import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AuthVariables } from "../auth/middleware";
import { requireUser } from "../auth/middleware";
import {
  candidateUpdateSchema,
  statusUpdateSchema,
  subscriptionIdSchema,
  subscriptionInputSchema,
  subscriptionsQuerySchema,
  subscriptionUpdateSchema,
} from "./schema";
import {
  cancelSubscription,
  createSubscription,
  deleteSubscription,
  getSubscription,
  listSubscriptions,
  renewSubscription,
  updateSubscription,
  updateSubscriptionCandidate,
  updateSubscriptionStatus,
} from "./services";

function unauthorized(c: Parameters<typeof requireUser>[0]) {
  return c.json({ error: "unauthorized" }, 401);
}

function notFound(c: Parameters<typeof requireUser>[0]) {
  return c.json({ error: "subscription_not_found" }, 404);
}

export const subscriptionsRouter = new Hono<{ Variables: AuthVariables }>()
  .use("*", async (c, next) => {
    if (!requireUser(c)) return c.json({ error: "unauthorized" }, 401);
    await next();
  })
  .get("/", zValidator("query", subscriptionsQuerySchema), async (c) => {
    const user = requireUser(c);
    if (!user) return unauthorized(c);

    const items = await listSubscriptions(user.id, c.req.valid("query"));
    return c.json({ items }, 200);
  })
  .post("/", zValidator("json", subscriptionInputSchema), async (c) => {
    const user = requireUser(c);
    if (!user) return unauthorized(c);

    const subscription = await createSubscription(user.id, c.req.valid("json"));
    return c.json(subscription, 201);
  })
  .get("/:id", zValidator("param", subscriptionIdSchema), async (c) => {
    const user = requireUser(c);
    if (!user) return unauthorized(c);

    const subscription = await getSubscription(user.id, c.req.valid("param").id);
    return subscription ? c.json(subscription, 200) : notFound(c);
  })
  .patch(
    "/:id",
    zValidator("param", subscriptionIdSchema),
    zValidator("json", subscriptionUpdateSchema),
    async (c) => {
      const user = requireUser(c);
      if (!user) return unauthorized(c);

      const subscription = await updateSubscription(
        user.id,
        c.req.valid("param").id,
        c.req.valid("json"),
      );
      return subscription ? c.json(subscription, 200) : notFound(c);
    },
  )
  .delete("/:id", zValidator("param", subscriptionIdSchema), async (c) => {
    const user = requireUser(c);
    if (!user) return unauthorized(c);

    const deleted = await deleteSubscription(user.id, c.req.valid("param").id);
    return deleted ? c.body(null, 204) : notFound(c);
  })
  .patch("/:id/renew", zValidator("param", subscriptionIdSchema), async (c) => {
    const user = requireUser(c);
    if (!user) return unauthorized(c);

    const subscription = await renewSubscription(user.id, c.req.valid("param").id);
    return subscription ? c.json(subscription, 200) : notFound(c);
  })
  .patch("/:id/cancel", zValidator("param", subscriptionIdSchema), async (c) => {
    const user = requireUser(c);
    if (!user) return unauthorized(c);

    const subscription = await cancelSubscription(user.id, c.req.valid("param").id);
    return subscription ? c.json(subscription, 200) : notFound(c);
  })
  .patch(
    "/:id/candidate",
    zValidator("param", subscriptionIdSchema),
    zValidator("json", candidateUpdateSchema),
    async (c) => {
      const user = requireUser(c);
      if (!user) return unauthorized(c);

      const subscription = await updateSubscriptionCandidate(
        user.id,
        c.req.valid("param").id,
        c.req.valid("json").isCancellationCandidate,
      );
      return subscription ? c.json(subscription, 200) : notFound(c);
    },
  )
  .patch(
    "/:id/status",
    zValidator("param", subscriptionIdSchema),
    zValidator("json", statusUpdateSchema),
    async (c) => {
      const user = requireUser(c);
      if (!user) return unauthorized(c);

      const subscription = await updateSubscriptionStatus(
        user.id,
        c.req.valid("param").id,
        c.req.valid("json").status,
      );
      return subscription ? c.json(subscription, 200) : notFound(c);
    },
  );
