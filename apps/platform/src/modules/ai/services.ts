import { apiClient } from "../../lib/api";

export async function reviewSubscription() {
  const response = await apiClient.ai["subscription-review"].$post();
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error((errorData as any).message || "Failed to fetch AI review");
  }
  
  const data = await response.json();
  return data;
}
