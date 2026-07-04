import { useTranslation } from "@repo/i18n";
import { toast } from "@repo/ui/components/sonner";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SubscriptionForm } from "../../components/subscriptions/subscription-form";
import { meQueryOptions } from "../../modules/auth/hooks/use-auth";
import { UnauthorizedError } from "../../modules/auth/services";
import { useCreateSubscriptionMutation } from "../../modules/subscriptions/hooks/use-subscriptions";
import type { SubscriptionInput } from "../../modules/subscriptions/types";
import { emptySubscriptionForm } from "../../modules/subscriptions/utils";

export const Route = createFileRoute("/subscriptions/new")({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(meQueryOptions);
    } catch (error) {
      if (error instanceof UnauthorizedError) throw redirect({ to: "/login" });
      throw error;
    }
  },
  component: NewSubscriptionPage,
});

function NewSubscriptionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mutation = useCreateSubscriptionMutation();
  const [error, setError] = useState<string>();

  function handleSubmit(input: SubscriptionInput) {
    setError(undefined);
    mutation.mutate(input, {
      onError: (mutationError) => {
        setError(
          mutationError instanceof Error
            ? mutationError.message
            : t("subscriptions.form.submitErrorFallback"),
        );
      },
      onSuccess: async () => {
        toast.success(t("subscriptions.toast.created"));
        await navigate({ to: "/subscriptions", search: { sort: "nextBillingDateAsc" } });
      },
    });
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 max-w-2xl">
        <p className="text-sm font-medium text-primary">{t("subscriptions.form.eyebrow")}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {t("subscriptions.new.title")}
        </h1>
        <p className="mt-3 text-muted-foreground">{t("subscriptions.new.description")}</p>
      </header>
      <SubscriptionForm
        error={error}
        initialValues={emptySubscriptionForm}
        isSubmitting={mutation.isPending}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
