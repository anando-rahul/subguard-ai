import { apiClient } from "../../lib/api";
import { ApiRequestError } from "../subscriptions/services";
import type { DashboardSummary, UpcomingBillingItem } from "./types";

export async function getDashboardSummary() {
  const response = await apiClient.dashboard.summary.$get();
  if (!response.ok) throw new ApiRequestError("Failed to load dashboard summary.", response.status);

  return (await response.json()) as DashboardSummary;
}

export async function getUpcomingBilling() {
  const response = await apiClient.dashboard["upcoming-billing"].$get();
  if (!response.ok) throw new ApiRequestError("Failed to load upcoming billing.", response.status);

  return (await response.json()) as { items: UpcomingBillingItem[] };
}
