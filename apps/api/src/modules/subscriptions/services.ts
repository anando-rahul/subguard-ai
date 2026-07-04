import { formatDateOnly, parseDateOnly } from "../../utils/date";
import { Prisma, prisma, type Subscription } from "../../utils/prisma";
import type { SubscriptionInput, SubscriptionsQuery, SubscriptionUpdateInput } from "./schema";
import type { SubscriptionResponse } from "./types";

function nullableText(value: string | null | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return value?.trim() || null;
}

export function serializeSubscription(subscription: Subscription): SubscriptionResponse {
  return {
    billingCycle: subscription.billingCycle,
    category: subscription.category,
    createdAt: subscription.createdAt.toISOString(),
    currency: subscription.currency,
    id: subscription.id,
    isCancellationCandidate: subscription.isCancellationCandidate,
    name: subscription.name,
    nextBillingDate: formatDateOnly(subscription.nextBillingDate),
    notes: subscription.notes,
    paymentMethod: subscription.paymentMethod,
    price: subscription.price.toNumber(),
    status: subscription.status,
    updatedAt: subscription.updatedAt.toISOString(),
    usageFrequency: subscription.usageFrequency,
  };
}

export async function listSubscriptions(userId: string, query: SubscriptionsQuery) {
  const subscriptions = await prisma.subscription.findMany({
    orderBy: {
      nextBillingDate: query.sort === "nextBillingDateDesc" ? "desc" : "asc",
    },
    where: {
      category: query.category,
      status: query.status,
      userId,
    },
  });

  return subscriptions.map(serializeSubscription);
}

export async function getSubscription(userId: string, id: string) {
  const subscription = await prisma.subscription.findFirst({ where: { id, userId } });

  return subscription ? serializeSubscription(subscription) : null;
}

export async function createSubscription(userId: string, input: SubscriptionInput) {
  const subscription = await prisma.subscription.create({
    data: {
      ...input,
      nextBillingDate: parseDateOnly(input.nextBillingDate),
      notes: nullableText(input.notes),
      paymentMethod: nullableText(input.paymentMethod),
      userId,
    },
  });

  return serializeSubscription(subscription);
}

function toUpdateData(input: SubscriptionUpdateInput) {
  const data: Prisma.SubscriptionUncheckedUpdateInput = {};

  if (input.billingCycle !== undefined) data.billingCycle = input.billingCycle;
  if (input.category !== undefined) data.category = input.category;
  if (input.currency !== undefined) data.currency = input.currency;
  if (input.isCancellationCandidate !== undefined) {
    data.isCancellationCandidate = input.isCancellationCandidate;
  }
  if (input.name !== undefined) data.name = input.name;
  if (input.nextBillingDate !== undefined) {
    data.nextBillingDate = parseDateOnly(input.nextBillingDate);
  }
  if (input.notes !== undefined) data.notes = nullableText(input.notes);
  if (input.paymentMethod !== undefined) data.paymentMethod = nullableText(input.paymentMethod);
  if (input.price !== undefined) data.price = input.price;
  if (input.status !== undefined) data.status = input.status;
  if (input.usageFrequency !== undefined) data.usageFrequency = input.usageFrequency;

  return data;
}

function isMissingRecordError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error as { code?: unknown }).code === "P2025"
  );
}

export async function updateSubscription(
  userId: string,
  id: string,
  input: SubscriptionUpdateInput,
) {
  try {
    const subscription = await prisma.subscription.update({
      data: toUpdateData(input),
      where: { id, userId },
    });

    return serializeSubscription(subscription);
  } catch (error) {
    if (isMissingRecordError(error)) return null;
    throw error;
  }
}

export async function updateSubscriptionCandidate(
  userId: string,
  id: string,
  isCancellationCandidate: boolean,
) {
  return updateSubscription(userId, id, { isCancellationCandidate });
}

export async function updateSubscriptionStatus(
  userId: string,
  id: string,
  status: Subscription["status"],
) {
  return updateSubscription(userId, id, { status });
}

export async function deleteSubscription(userId: string, id: string) {
  try {
    await prisma.subscription.delete({ where: { id, userId } });
    return true;
  } catch (error) {
    if (isMissingRecordError(error)) return false;
    throw error;
  }
}
