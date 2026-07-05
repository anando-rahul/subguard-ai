import { Hono } from "hono";
import type { AuthVariables } from "../auth/middleware";
import { requireUser } from "../auth/middleware";
import { reviewSubscriptions, getAIReviewHistory, deleteAllAIReviewHistory, deleteAIReviewHistoryById } from "./services";

function unauthorized(c: Parameters<typeof requireUser>[0]) {
  return c.json({ error: "unauthorized" }, 401);
}

export const aiRouter = new Hono<{ Variables: AuthVariables }>()
  .use("*", async (c, next) => {
    if (!requireUser(c)) return unauthorized(c);
    await next();
  })
  .post("/subscription-review", async (c) => {
    const user = requireUser(c);
    if (!user) return unauthorized(c);

    const result = await reviewSubscriptions(user.id);
    
    if (!result.success) {
      return c.json({ success: false, message: result.message }, 400);
    }

    return c.json(result, 200);
  })
  .get("/history", async (c) => {
    const user = requireUser(c);
    if (!user) return unauthorized(c);

    const result = await getAIReviewHistory(user.id);
    if (!result.success) {
      return c.json({ success: false, message: result.message }, 400);
    }
    return c.json(result, 200);
  })
  .delete("/history", async (c) => {
    const user = requireUser(c);
    if (!user) return unauthorized(c);

    const result = await deleteAllAIReviewHistory(user.id);
    if (!result.success) {
      return c.json({ success: false, message: result.message }, 400);
    }
    return c.json(result, 200);
  })
  .delete("/history/:id", async (c) => {
    const user = requireUser(c);
    if (!user) return unauthorized(c);
    
    const id = c.req.param("id");
    const result = await deleteAIReviewHistoryById(user.id, id);
    if (!result.success) {
      return c.json({ success: false, message: result.message }, 400);
    }
    return c.json(result, 200);
  });
