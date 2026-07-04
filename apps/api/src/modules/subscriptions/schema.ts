import { z } from "zod";
import { isValidDateOnly } from "../../utils/date";

export const billingCycles = ["MONTHLY", "YEARLY"] as const;
export const subscriptionCategories = [
  "ENTERTAINMENT",
  "WORK_TOOLS",
  "FAMILY",
  "EDUCATION",
  "CLOUD",
  "TELCO",
  "AI_TOOLS",
  "OTHER",
] as const;
export const subscriptionStatuses = [
  "ACTIVE",
  "TRIAL",
  "PENDING_CANCELLATION",
  "CANCELLED",
] as const;
export const usageFrequencies = ["OFTEN", "SOMETIMES", "RARELY", "NOT_SURE"] as const;

const optionalText = (maximum: number) => z.string().trim().max(maximum).nullable().optional();

export const subscriptionInputSchema = z
  .object({
    billingCycle: z.enum(billingCycles),
    category: z.enum(subscriptionCategories),
    currency: z.literal("IDR"),
    isCancellationCandidate: z.boolean().default(false),
    name: z.string().trim().min(2).max(80),
    nextBillingDate: z.string().refine(isValidDateOnly, "Invalid calendar date"),
    notes: optionalText(500),
    paymentMethod: optionalText(80),
    price: z.number().finite().positive().max(9_999_999_999.99),
    status: z.enum(subscriptionStatuses),
    usageFrequency: z.enum(usageFrequencies),
  })
  .strict();

export const subscriptionUpdateSchema = subscriptionInputSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");

export const subscriptionIdSchema = z.object({ id: z.string().trim().min(1) }).strict();

export const subscriptionsQuerySchema = z
  .object({
    category: z.enum(subscriptionCategories).optional(),
    sort: z.enum(["nextBillingDateAsc", "nextBillingDateDesc"]).default("nextBillingDateAsc"),
    status: z.enum(subscriptionStatuses).optional(),
  })
  .strict();

export const candidateUpdateSchema = z.object({ isCancellationCandidate: z.boolean() }).strict();

export const statusUpdateSchema = z.object({ status: z.enum(subscriptionStatuses) }).strict();

export type SubscriptionInput = z.infer<typeof subscriptionInputSchema>;
export type SubscriptionUpdateInput = z.infer<typeof subscriptionUpdateSchema>;
export type SubscriptionsQuery = z.infer<typeof subscriptionsQuerySchema>;
