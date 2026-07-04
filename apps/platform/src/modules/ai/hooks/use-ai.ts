import { useMutation } from "@tanstack/react-query";
import { reviewSubscription } from "../services";

export function useReviewSubscription() {
  return useMutation({
    mutationFn: reviewSubscription,
  });
}
