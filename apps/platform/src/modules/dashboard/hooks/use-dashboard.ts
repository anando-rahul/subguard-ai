import { queryOptions } from "@tanstack/react-query";
import { getDashboardSummary, getUpcomingBilling } from "../services";

export const dashboardSummaryQueryOptions = queryOptions({
  queryFn: getDashboardSummary,
  queryKey: ["dashboard", "summary"],
});

export const upcomingBillingQueryOptions = queryOptions({
  queryFn: getUpcomingBilling,
  queryKey: ["dashboard", "upcoming"],
});
