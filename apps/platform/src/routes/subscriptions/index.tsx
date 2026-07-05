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
import {
  BookmarkCheckIcon,
  BookmarkIcon,
  CircleXIcon,
  PencilIcon,
  RefreshCwIcon,
  Trash2Icon,
} from "@repo/ui/components/icons";
import { CalendarIcon, CreditCard, LinkIcon, MoreHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { HowToCancelDialog } from "../../components/subscriptions/how-to-cancel-dialog";
import { meQueryOptions } from "../../modules/auth/hooks/use-auth";
import { UnauthorizedError } from "../../modules/auth/services";
import {
  subscriptionsQueryOptions,
  useCancelSubscriptionMutation,
  useCandidateMutation,
  useDeleteSubscriptionMutation,
  useRenewSubscriptionMutation,
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

      <div className="mt-8 rounded-xl border bg-muted/20 p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <label htmlFor="subscription-status-filter" className="grid gap-2 text-sm font-medium text-muted-foreground">
            {t("subscriptions.filters.status")}
            <NativeSelect
              id="subscription-status-filter"
              className="w-full bg-background"
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

          <label htmlFor="subscription-category-filter" className="grid gap-2 text-sm font-medium text-muted-foreground">
            {t("subscriptions.filters.category")}
            <NativeSelect
              id="subscription-category-filter"
              className="w-full bg-background"
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

          <label htmlFor="subscription-sort" className="grid gap-2 text-sm font-medium text-muted-foreground">
            {t("subscriptions.filters.sort")}
            <NativeSelect
              id="subscription-sort"
              className="w-full bg-background"
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
        </div>
      </div>

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
        <Empty className="mt-8 rounded-xl border bg-card py-20 shadow-sm">
          <EmptyHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <EmptyTitle className="text-xl font-bold">
              {t(isFiltered ? "subscriptions.empty.filteredTitle" : "subscriptions.empty.title")}
            </EmptyTitle>
            <EmptyDescription className="max-w-md mx-auto">
              {t(
                isFiltered
                  ? "subscriptions.empty.filteredDescription"
                  : "subscriptions.empty.description",
              )}
            </EmptyDescription>
          </EmptyHeader>
          <div className="mt-4 flex justify-center">
            {isFiltered ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => void navigate({ search: { sort: "nextBillingDateAsc" } })}
              >
                {t("subscriptions.actions.clearFilters")}
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link to="/subscriptions/new">{t("subscriptions.actions.addFirst")}</Link>
              </Button>
            )}
          </div>
        </Empty>
      ) : null}

      {subscriptions.data && subscriptions.data.items.length > 0 ? (
        <TooltipProvider delayDuration={250}>
          <div className="mt-8 hidden overflow-x-auto rounded-xl border bg-card lg:block">
            <Table className="min-w-[1480px] table-fixed">
              <colgroup>
                <col className="w-[240px]" />
                <col className="w-[160px]" />
                <col className="w-[180px]" />
                <col className="w-[220px]" />
                <col className="w-[180px]" />
                <col className="w-[140px]" />
              </colgroup>
              <TableHeader>
                <TableRow className="border-b bg-muted/30 hover:bg-muted/30">
                  <TableHead className="px-6 py-4">{t("subscriptions.fields.name")}</TableHead>
                  <TableHead className="px-6 py-4">{t("subscriptions.fields.price")}</TableHead>
                  <TableHead className="px-6 py-4">
                    {t("subscriptions.fields.nextBillingDate")}
                  </TableHead>
                  <TableHead className="px-6 py-4">{t("subscriptions.fields.paymentMethod")}</TableHead>
                  <TableHead className="px-6 py-4">{t("subscriptions.fields.status")}</TableHead>
                  <TableHead className="px-6 py-4 text-center">
                    {t("subscriptions.fields.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.data.items.map((subscription) => (
                  <TableRow key={subscription.id} data-subscription-id={subscription.id} className="hover:bg-muted/40 transition-colors">
                    <TableCell className="px-6 py-5 align-top">
                      <div className="grid gap-1.5">
                        <Link to="/subscriptions/$subscriptionId" params={{ subscriptionId: subscription.id }} className="font-semibold text-base break-words hover:underline decoration-primary/50 underline-offset-4 transition-all" title={subscription.name}>
                          {subscription.name}
                        </Link>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="px-1.5 py-0 rounded-sm font-normal text-[10px]">
                            {t(`subscriptions.categories.${subscription.category}`)}
                          </Badge>
                          {subscription.isCancellationCandidate && (
                            <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-600 px-1.5 py-0 text-[10px] font-bold">
                              Candidate
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 align-top">
                      <div className="grid gap-1">
                        <span className="text-lg font-bold">{formatIdr(subscription.price, i18n.resolvedLanguage ?? "en")}</span>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                          {t(`subscriptions.billingCycles.${subscription.billingCycle}`)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 align-top">
                      <BillingDate subscription={subscription} />
                    </TableCell>
                    <TableCell className="px-6 py-5 align-top">
                      <div className="grid gap-1.5">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span
                            className="block truncate text-sm font-medium"
                            title={
                              subscription.paymentMethod ??
                              t("subscriptions.list.paymentMethodFallback")
                            }
                          >
                            {subscription.paymentMethod ??
                              t("subscriptions.list.paymentMethodFallback")}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {t(`subscriptions.billingSources.${subscription.billingSource}`)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 align-top">
                      <div className="grid gap-1.5 items-start">
                        <StatusBadge status={subscription.status} />
                        <span className="text-xs text-muted-foreground">
                          {t(`subscriptions.usageFrequencies.${subscription.usageFrequency}`)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 align-top text-center">
                      <SubscriptionActions subscription={subscription} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 grid gap-4 lg:hidden">
            {subscriptions.data.items.map((subscription) => (
              <Card key={subscription.id} className="overflow-hidden shadow-sm">
                <CardContent className="grid gap-5 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-lg break-words" title={subscription.name}>
                        <Link to="/subscriptions/$subscriptionId" params={{ subscriptionId: subscription.id }} className="hover:underline decoration-primary/50 underline-offset-4 transition-all">
                          {subscription.name}
                        </Link>
                      </h2>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <Badge variant="secondary" className="px-1.5 py-0 rounded-sm font-normal text-[10px]">
                          {t(`subscriptions.categories.${subscription.category}`)}
                        </Badge>
                        <StatusBadge status={subscription.status} />
                        {subscription.isCancellationCandidate && (
                          <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-600 px-1.5 py-0 text-[10px] font-bold">
                            Candidate
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-lg">{formatIdr(subscription.price, i18n.resolvedLanguage ?? "en")}</p>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
                        {t(`subscriptions.billingCycles.${subscription.billingCycle}`)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="h-px bg-border/50 w-full" />

                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-xs text-muted-foreground mb-1">
                        {t("subscriptions.fields.nextBillingDate")}
                      </dt>
                      <dd>
                        <BillingDate subscription={subscription} />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground mb-1">
                        {t("subscriptions.fields.paymentMethod")}
                      </dt>
                      <dd className="font-medium flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="truncate">
                          {subscription.paymentMethod ?? t("subscriptions.list.paymentMethodFallback")}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground mb-1">
                        {t("subscriptions.fields.usageFrequency")}
                      </dt>
                      <dd className="font-medium">
                        {t(`subscriptions.usageFrequencies.${subscription.usageFrequency}`)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground mb-1">
                        {t("subscriptions.fields.billingSource")}
                      </dt>
                      <dd className="font-medium">
                        {t(`subscriptions.billingSources.${subscription.billingSource}`)}
                      </dd>
                    </div>
                  </dl>
                  <div className="pt-2">
                    <SubscriptionActions subscription={subscription} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TooltipProvider>
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
    <div className="grid gap-1.5">
      <div className="flex items-center gap-2">
        <CalendarIcon className={`h-4 w-4 shrink-0 ${isPast ? 'text-destructive' : 'text-muted-foreground'}`} />
        <span className="text-sm font-medium">{formatDateOnly(subscription.nextBillingDate, i18n.resolvedLanguage ?? "en")}</span>
      </div>
      {isPast ? (
        <span className="text-[10px] font-bold uppercase tracking-wider text-destructive bg-destructive/10 w-fit px-1.5 py-0.5 rounded-sm">
          {t("subscriptions.list.pastDue")}
        </span>
      ) : null}
    </div>
  );
}

function SubscriptionActions({ subscription }: { subscription: Subscription }) {
  const { t } = useTranslation();
  const cancelMutation = useCancelSubscriptionMutation();
  const candidateMutation = useCandidateMutation();
  const renewMutation = useRenewSubscriptionMutation();
  const deleteMutation = useDeleteSubscriptionMutation();
  const isPending =
    cancelMutation.isPending ||
    candidateMutation.isPending ||
    renewMutation.isPending ||
    deleteMutation.isPending;

  function showError(error: unknown) {
    toast.error(error instanceof Error ? error.message : t("subscriptions.toast.mutationError"));
  }

  return (
    <div className="flex flex-nowrap items-center justify-center gap-1.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon-sm" variant="ghost" disabled={isPending}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/subscriptions/$subscriptionId" params={{ subscriptionId: subscription.id }}>
              <Eye aria-hidden="true" />
              <span>Detail Subscription</span>
            </Link>
          </DropdownMenuItem>

          <HowToCancelDialog subscription={subscription} disabled={isPending} triggerAsMenuItem />
          
          <DropdownMenuItem
            disabled={isPending}
            className="cursor-pointer"
            onClick={() =>
              renewMutation.mutate(subscription.id, {
                onError: showError,
                onSuccess: () => toast.success(t("subscriptions.toast.renewed")),
              })
            }
          >
            <RefreshCwIcon aria-hidden="true" />
            <span>{t("subscriptions.actions.renewSubscription")}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={isPending || subscription.status === "CANCELLED"}
            className="cursor-pointer"
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
            {subscription.isCancellationCandidate ? (
              <BookmarkCheckIcon aria-hidden="true" />
            ) : (
              <BookmarkIcon aria-hidden="true" />
            )}
            <span>
              {t(
                subscription.isCancellationCandidate
                  ? "subscriptions.actions.unmarkCandidate"
                  : "subscriptions.actions.markCandidate",
              )}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild size="icon-sm" variant="outline">
            <Link
              to="/subscriptions/$subscriptionId/edit"
              params={{ subscriptionId: subscription.id }}
              aria-label={t("subscriptions.actions.editLabel", { name: subscription.name })}
            >
              <PencilIcon aria-hidden="true" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          {t("subscriptions.actions.edit")}
        </TooltipContent>
      </Tooltip>

      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20"
                aria-label={t("subscriptions.actions.deleteLabel", { name: subscription.name })}
                disabled={isPending}
              >
                <Trash2Icon aria-hidden="true" />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6}>
            {t("subscriptions.actions.delete")}
          </TooltipContent>
        </Tooltip>
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
