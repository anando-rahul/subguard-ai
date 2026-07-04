import { useTranslation } from "@repo/i18n";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/alert-dialog";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@repo/ui/components/empty";
import { NativeSelect, NativeSelectOption } from "@repo/ui/components/native-select";
import { Skeleton } from "@repo/ui/components/skeleton";
import { toast } from "@repo/ui/components/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { meQueryOptions } from "../../modules/auth/hooks/use-auth";
import { UnauthorizedError } from "../../modules/auth/services";
import {
  subscriptionsQueryOptions,
  useCandidateMutation,
  useDeleteSubscriptionMutation,
  useStatusMutation,
} from "../../modules/subscriptions/hooks/use-subscriptions";
import {
  subscriptionCategories,
  subscriptionStatuses,
  type Subscription,
  type SubscriptionCategory,
  type SubscriptionSort,
  type SubscriptionStatus,
} from "../../modules/subscriptions/types";
import { formatDateOnly, formatIdr, getJakartaDateOnly } from "../../modules/subscriptions/utils";

type SubscriptionSearch = {
  category?: SubscriptionCategory;
  sort: SubscriptionSort;
  status?: SubscriptionStatus;
};

function validateSearch(search: Record<string, unknown>): SubscriptionSearch {
  const category = subscriptionCategories.find((item) => item === search.category);
  const status = subscriptionStatuses.find((item) => item === search.status);
  const sort = search.sort === "nextBillingDateDesc" ? "nextBillingDateDesc" : "nextBillingDateAsc";

  return { category, sort, status };
}

export const Route = createFileRoute("/subscriptions/")({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(meQueryOptions);
    } catch (error) {
      if (error instanceof UnauthorizedError) throw redirect({ to: "/login" });
      throw error;
    }
  },
  component: SubscriptionsPage,
  validateSearch,
});

function SubscriptionsPage() {
  const { i18n, t } = useTranslation();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const subscriptions = useQuery(subscriptionsQueryOptions(search));
  const isFiltered = Boolean(search.category || search.status);

  function updateSearch(patch: Partial<SubscriptionSearch>) {
    void navigate({ search: (current) => ({ ...current, ...patch }) });
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">{t("subscriptions.list.eyebrow")}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("subscriptions.list.title")}
          </h1>
          <p className="mt-3 text-muted-foreground">{t("subscriptions.list.description")}</p>
        </div>
        <Button asChild>
          <Link to="/subscriptions/new">{t("subscriptions.actions.add")}</Link>
        </Button>
      </header>

      <Card className="mt-8">
        <CardContent className="grid gap-4 pt-6 md:grid-cols-3">
          <label htmlFor="subscription-status-filter" className="grid gap-2 text-sm font-medium">
            {t("subscriptions.filters.status")}
            <NativeSelect
              id="subscription-status-filter"
              className="w-full"
              value={search.status ?? "ALL"}
              onChange={(event) =>
                updateSearch({
                  status:
                    event.target.value === "ALL"
                      ? undefined
                      : (event.target.value as SubscriptionStatus),
                })
              }
            >
              <NativeSelectOption value="ALL">
                {t("subscriptions.filters.allStatuses")}
              </NativeSelectOption>
              {subscriptionStatuses.map((status) => (
                <NativeSelectOption key={status} value={status}>
                  {t(`subscriptions.statuses.${status}`)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </label>

          <label htmlFor="subscription-category-filter" className="grid gap-2 text-sm font-medium">
            {t("subscriptions.filters.category")}
            <NativeSelect
              id="subscription-category-filter"
              className="w-full"
              value={search.category ?? "ALL"}
              onChange={(event) =>
                updateSearch({
                  category:
                    event.target.value === "ALL"
                      ? undefined
                      : (event.target.value as SubscriptionCategory),
                })
              }
            >
              <NativeSelectOption value="ALL">
                {t("subscriptions.filters.allCategories")}
              </NativeSelectOption>
              {subscriptionCategories.map((category) => (
                <NativeSelectOption key={category} value={category}>
                  {t(`subscriptions.categories.${category}`)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </label>

          <label htmlFor="subscription-sort" className="grid gap-2 text-sm font-medium">
            {t("subscriptions.filters.sort")}
            <NativeSelect
              id="subscription-sort"
              className="w-full"
              value={search.sort}
              onChange={(event) => updateSearch({ sort: event.target.value as SubscriptionSort })}
            >
              <NativeSelectOption value="nextBillingDateAsc">
                {t("subscriptions.filters.nearestFirst")}
              </NativeSelectOption>
              <NativeSelectOption value="nextBillingDateDesc">
                {t("subscriptions.filters.latestFirst")}
              </NativeSelectOption>
            </NativeSelect>
          </label>
        </CardContent>
      </Card>

      {subscriptions.isPending ? <SubscriptionListSkeleton /> : null}

      {subscriptions.isError ? (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>{t("subscriptions.list.errorTitle")}</AlertTitle>
          <AlertDescription className="grid gap-4">
            <p>{t("subscriptions.list.error")}</p>
            <Button
              type="button"
              variant="outline"
              className="w-fit"
              onClick={() => subscriptions.refetch()}
            >
              {t("subscriptions.actions.retry")}
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {subscriptions.data?.items.length === 0 ? (
        <Empty className="mt-8 rounded-xl border py-16">
          <EmptyHeader>
            <EmptyTitle>
              {t(isFiltered ? "subscriptions.empty.filteredTitle" : "subscriptions.empty.title")}
            </EmptyTitle>
            <EmptyDescription>
              {t(
                isFiltered
                  ? "subscriptions.empty.filteredDescription"
                  : "subscriptions.empty.description",
              )}
            </EmptyDescription>
          </EmptyHeader>
          {isFiltered ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => void navigate({ search: { sort: "nextBillingDateAsc" } })}
            >
              {t("subscriptions.actions.clearFilters")}
            </Button>
          ) : (
            <Button asChild>
              <Link to="/subscriptions/new">{t("subscriptions.actions.addFirst")}</Link>
            </Button>
          )}
        </Empty>
      ) : null}

      {subscriptions.data && subscriptions.data.items.length > 0 ? (
        <>
          <div className="mt-8 hidden overflow-hidden rounded-xl border bg-card lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("subscriptions.fields.name")}</TableHead>
                  <TableHead>{t("subscriptions.fields.price")}</TableHead>
                  <TableHead>{t("subscriptions.fields.nextBillingDate")}</TableHead>
                  <TableHead>{t("subscriptions.fields.status")}</TableHead>
                  <TableHead>{t("subscriptions.fields.usageFrequency")}</TableHead>
                  <TableHead className="text-right">{t("subscriptions.fields.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.data.items.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div className="grid gap-1">
                        <span className="font-medium">{subscription.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {t(`subscriptions.categories.${subscription.category}`)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid gap-1">
                        <span>{formatIdr(subscription.price, i18n.resolvedLanguage ?? "en")}</span>
                        <span className="text-xs text-muted-foreground">
                          {t(`subscriptions.billingCycles.${subscription.billingCycle}`)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <BillingDate subscription={subscription} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={subscription.status} />
                    </TableCell>
                    <TableCell>
                      {t(`subscriptions.usageFrequencies.${subscription.usageFrequency}`)}
                    </TableCell>
                    <TableCell>
                      <SubscriptionActions subscription={subscription} compact />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 grid gap-4 lg:hidden">
            {subscriptions.data.items.map((subscription) => (
              <Card key={subscription.id}>
                <CardContent className="grid gap-5 pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-semibold">{subscription.name}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t(`subscriptions.categories.${subscription.category}`)}
                      </p>
                    </div>
                    <StatusBadge status={subscription.status} />
                  </div>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-muted-foreground">{t("subscriptions.fields.price")}</dt>
                      <dd className="mt-1 font-medium">
                        {formatIdr(subscription.price, i18n.resolvedLanguage ?? "en")}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">
                        {t("subscriptions.fields.nextBillingDate")}
                      </dt>
                      <dd className="mt-1">
                        <BillingDate subscription={subscription} />
                      </dd>
                    </div>
                  </dl>
                  <SubscriptionActions subscription={subscription} />
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}

function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const { t } = useTranslation();
  const variant = status === "CANCELLED" ? "outline" : status === "TRIAL" ? "secondary" : "default";

  return <Badge variant={variant}>{t(`subscriptions.statuses.${status}`)}</Badge>;
}

function BillingDate({ subscription }: { subscription: Subscription }) {
  const { i18n, t } = useTranslation();
  const isPast = subscription.nextBillingDate < getJakartaDateOnly();

  return (
    <div className="grid gap-1">
      <span>{formatDateOnly(subscription.nextBillingDate, i18n.resolvedLanguage ?? "en")}</span>
      {isPast ? (
        <span className="text-xs text-amber-700 dark:text-amber-300">
          {t("subscriptions.list.pastDue")}
        </span>
      ) : null}
    </div>
  );
}

function SubscriptionActions({
  compact = false,
  subscription,
}: {
  compact?: boolean;
  subscription: Subscription;
}) {
  const { t } = useTranslation();
  const candidateMutation = useCandidateMutation();
  const statusMutation = useStatusMutation();
  const deleteMutation = useDeleteSubscriptionMutation();
  const isPending =
    candidateMutation.isPending || statusMutation.isPending || deleteMutation.isPending;

  function showError(error: unknown) {
    toast.error(error instanceof Error ? error.message : t("subscriptions.toast.mutationError"));
  }

  return (
    <div className={compact ? "flex items-center justify-end gap-2" : "grid gap-3"}>
      <NativeSelect
        aria-label={t("subscriptions.actions.changeStatus", { name: subscription.name })}
        className={compact ? "w-40" : "w-full"}
        size="sm"
        disabled={isPending}
        value={subscription.status}
        onChange={(event) =>
          statusMutation.mutate(
            { id: subscription.id, status: event.target.value as SubscriptionStatus },
            {
              onError: showError,
              onSuccess: () => toast.success(t("subscriptions.toast.statusUpdated")),
            },
          )
        }
      >
        {subscriptionStatuses.map((status) => (
          <NativeSelectOption key={status} value={status}>
            {t(`subscriptions.statuses.${status}`)}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <Button
        type="button"
        size="sm"
        variant={subscription.isCancellationCandidate ? "secondary" : "outline"}
        disabled={isPending || subscription.status === "CANCELLED"}
        onClick={() =>
          candidateMutation.mutate(
            {
              id: subscription.id,
              isCancellationCandidate: !subscription.isCancellationCandidate,
            },
            {
              onError: showError,
              onSuccess: () => toast.success(t("subscriptions.toast.candidateUpdated")),
            },
          )
        }
      >
        {t(
          subscription.isCancellationCandidate
            ? "subscriptions.actions.unmarkCandidate"
            : "subscriptions.actions.markCandidate",
        )}
      </Button>

      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline" className={compact ? undefined : "flex-1"}>
          <Link
            to="/subscriptions/$subscriptionId/edit"
            params={{ subscriptionId: subscription.id }}
          >
            {t("subscriptions.actions.edit")}
          </Link>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className={compact ? undefined : "flex-1"}
              disabled={isPending}
            >
              {t("subscriptions.actions.delete")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("subscriptions.delete.title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("subscriptions.delete.description", { name: subscription.name })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("subscriptions.actions.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() =>
                  deleteMutation.mutate(subscription.id, {
                    onError: showError,
                    onSuccess: () => toast.success(t("subscriptions.toast.deleted")),
                  })
                }
              >
                {t("subscriptions.actions.confirmDelete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

function SubscriptionListSkeleton() {
  return (
    <div className="mt-8 grid gap-4" role="status" aria-label="Loading subscriptions">
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-20 w-full rounded-xl" />
    </div>
  );
}
