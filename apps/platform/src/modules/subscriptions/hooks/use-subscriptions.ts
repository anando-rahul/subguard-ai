import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
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
} from "../services";
import type { SubscriptionFilters } from "../types";

export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  detail: (id: string) => ["subscriptions", "detail", id] as const,
  list: (filters: SubscriptionFilters) => ["subscriptions", "list", filters] as const,
};

export function subscriptionsQueryOptions(filters: SubscriptionFilters) {
  return queryOptions({
    queryFn: () => listSubscriptions(filters),
    queryKey: subscriptionKeys.list(filters),
  });
}

export function subscriptionQueryOptions(id: string) {
  return queryOptions({
    queryFn: () => getSubscription(id),
    queryKey: subscriptionKeys.detail(id),
  });
}

function useProductMutation<TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: subscriptionKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ]);
    },
  });
}

export function useCreateSubscriptionMutation() {
  return useProductMutation(createSubscription);
}

export function useUpdateSubscriptionMutation() {
  return useProductMutation(updateSubscription);
}

export function useDeleteSubscriptionMutation() {
  return useProductMutation(deleteSubscription);
}

export function useCandidateMutation() {
  return useProductMutation(updateSubscriptionCandidate);
}

export function useStatusMutation() {
  return useProductMutation(updateSubscriptionStatus);
}

export function useRenewSubscriptionMutation() {
  return useProductMutation(renewSubscription);
}

export function useCancelSubscriptionMutation() {
  return useProductMutation(cancelSubscription);
}
