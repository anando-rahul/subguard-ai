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

export async function getAIReviewHistory() {
  const response = await apiClient.ai.history.$get();
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error((errorData as any).message || "Failed to fetch AI review history");
  }
  
  const data = await response.json();
  return data;
}

export async function deleteAllAIReviewHistory() {
  const response = await apiClient.ai.history.$delete();
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error((errorData as any).message || "Failed to clear AI review history");
  }
  
  const data = await response.json();
  return data;
}

export async function deleteAIReviewHistoryById(id: string) {
  const response = await apiClient.ai.history[":id"].$delete({
    param: { id },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error((errorData as any).message || "Failed to delete AI review log");
  }
  
  const data = await response.json();
  return data;
}
