import { getJakartaDateOnly, parseDateOnly } from "../../utils/date";
import { prisma } from "../../utils/prisma";
import { calculateDashboardSummary, toUpcomingBillingItem } from "./calculations";

export async function getDashboardSummary(userId: string) {
  const subscriptions = await prisma.subscription.findMany({
    select: {
      billingCycle: true,
      isCancellationCandidate: true,
      price: true,
      status: true,
    },
    where: { userId },
  });

  return calculateDashboardSummary(subscriptions);
}

export async function getUpcomingBilling(userId: string) {
  const today = getJakartaDateOnly();
  const subscriptions = await prisma.subscription.findMany({
    orderBy: { nextBillingDate: "asc" },
    select: {
      billingCycle: true,
      currency: true,
      id: true,
      name: true,
      nextBillingDate: true,
      price: true,
      status: true,
    },
    where: {
      nextBillingDate: { gte: parseDateOnly(today) },
      status: { not: "CANCELLED" },
      userId,
    },
  });

  return subscriptions.map((subscription) => toUpcomingBillingItem(subscription, today));
}
