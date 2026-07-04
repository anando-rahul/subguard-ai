import { useTranslation } from "@repo/i18n";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import { toast } from "@repo/ui/components/sonner";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SubscriptionForm } from "../../../components/subscriptions/subscription-form";
import { meQueryOptions } from "../../../modules/auth/hooks/use-auth";
import { UnauthorizedError } from "../../../modules/auth/services";
import {
  subscriptionQueryOptions,
  useUpdateSubscriptionMutation,
} from "../../../modules/subscriptions/hooks/use-subscriptions";
import { ApiRequestError } from "../../../modules/subscriptions/services";
import type { SubscriptionInput } from "../../../modules/subscriptions/types";
import { subscriptionToFormValues } from "../../../modules/subscriptions/utils";

export const Route = createFileRoute("/subscriptions/$subscriptionId/edit")({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(meQueryOptions);
    } catch (error) {
      if (error instanceof UnauthorizedError) throw redirect({ to: "/login" });
      throw error;
    }
  },
  component: EditSubscriptionPage,
});

function EditSubscriptionPage() {
  const { subscriptionId } = Route.useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const subscription = useQuery(subscriptionQueryOptions(subscriptionId));
  const mutation = useUpdateSubscriptionMutation();
  const [error, setError] = useState<string>();

  if (subscription.isPending) {
    return (
      <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-4 h-5 w-full max-w-lg" />
        <Skeleton className="mt-8 h-96 w-full rounded-xl" />
      </section>
    );
  }

  if (subscription.isError || !subscription.data) {
    const notFound =
      subscription.error instanceof ApiRequestError && subscription.error.status === 404;
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        <Alert variant="destructive">
          <AlertTitle>
            {t(notFound ? "subscriptions.edit.notFoundTitle" : "subscriptions.edit.errorTitle")}
          </AlertTitle>
          <AlertDescription className="grid gap-4">
            <p>{t(notFound ? "subscriptions.edit.notFound" : "subscriptions.edit.error")}</p>
            <Button asChild variant="outline" className="w-fit">
              <Link to="/subscriptions" search={{ sort: "nextBillingDateAsc" }}>
                {t("subscriptions.actions.backToList")}
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      </section>
    );
  }

  function handleSubmit(input: SubscriptionInput) {
    setError(undefined);
    mutation.mutate(
      { id: subscriptionId, input },
      {
        onError: (mutationError) => {
          setError(
            mutationError instanceof Error
              ? mutationError.message
              : t("subscriptions.form.submitErrorFallback"),
          );
        },
        onSuccess: async () => {
          toast.success(t("subscriptions.toast.updated"));
          await navigate({ to: "/subscriptions", search: { sort: "nextBillingDateAsc" } });
        },
      },
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 max-w-2xl">
        <p className="text-sm font-medium text-primary">{t("subscriptions.form.eyebrow")}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {t("subscriptions.edit.title", { name: subscription.data.name })}
        </h1>
        <p className="mt-3 text-muted-foreground">{t("subscriptions.edit.description")}</p>
      </header>
      <SubscriptionForm
        error={error}
        initialValues={subscriptionToFormValues(subscription.data)}
        isSubmitting={mutation.isPending}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
