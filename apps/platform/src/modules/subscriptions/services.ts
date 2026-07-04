import { apiClient } from "../../lib/api";
import type {
  Subscription,
  SubscriptionFilters,
  SubscriptionInput,
  SubscriptionStatus,
} from "./types";

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

async function assertOk(response: Response, fallbackMessage: string) {
  if (!response.ok) {
    throw new ApiRequestError(fallbackMessage, response.status);
  }
}

export async function listSubscriptions(filters: SubscriptionFilters) {
  const response = await apiClient.subscriptions.$get({
    query: {
      category: filters.category,
      sort: filters.sort,
      status: filters.status,
    },
  });
  await assertOk(response, "Failed to load subscriptions.");

  return (await response.json()) as { items: Subscription[] };
}

export async function getSubscription(id: string) {
  const response = await apiClient.subscriptions[":id"].$get({ param: { id } });
  await assertOk(response, "Failed to load subscription.");

  return (await response.json()) as Subscription;
}

export async function createSubscription(input: SubscriptionInput) {
  const response = await apiClient.subscriptions.$post({ json: input });
  await assertOk(response, "Failed to create subscription.");

  return (await response.json()) as Subscription;
}

export async function updateSubscription({ id, input }: { id: string; input: SubscriptionInput }) {
  const response = await apiClient.subscriptions[":id"].$patch({ json: input, param: { id } });
  await assertOk(response, "Failed to update subscription.");

  return (await response.json()) as Subscription;
}

export async function deleteSubscription(id: string) {
  const response = await apiClient.subscriptions[":id"].$delete({ param: { id } });
  await assertOk(response, "Failed to delete subscription.");
}

export async function updateSubscriptionCandidate({
  id,
  isCancellationCandidate,
}: {
  id: string;
  isCancellationCandidate: boolean;
}) {
  const response = await apiClient.subscriptions[":id"].candidate.$patch({
    json: { isCancellationCandidate },
    param: { id },
  });
  await assertOk(response, "Failed to update cancellation candidate.");

  return (await response.json()) as Subscription;
}

export async function updateSubscriptionStatus({
  id,
  status,
}: {
  id: string;
  status: SubscriptionStatus;
}) {
  const response = await apiClient.subscriptions[":id"].status.$patch({
    json: { status },
    param: { id },
  });
  await assertOk(response, "Failed to update subscription status.");

  return (await response.json()) as Subscription;
}
