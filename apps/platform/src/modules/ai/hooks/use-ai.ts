import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewSubscription, getAIReviewHistory, deleteAllAIReviewHistory, deleteAIReviewHistoryById } from "../services";
import { toast } from "@repo/ui/components/sonner";

export function useReviewSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewSubscription,
    onSuccess: () => {
      toast.success("AI analysis completed successfully!");
      void queryClient.invalidateQueries({ queryKey: ["ai-review-history"] });
    },
    onError: () => {
      toast.error("Failed to generate AI analysis. Please try again.");
    }
  });
}

export function useAIReviewHistoryQuery() {
  return useQuery({
    queryKey: ["ai-review-history"],
    queryFn: getAIReviewHistory,
  });
}

export function useDeleteAllAIReviewHistoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAllAIReviewHistory,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["ai-review-history"] });
      toast.success("All review history deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete review history.");
    },
  });
}

export function useDeleteAIReviewHistoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAIReviewHistoryById,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["ai-review-history"] });
      toast.success("Review history deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete review history.");
    },
  });
}
