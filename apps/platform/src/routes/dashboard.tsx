import { useTranslation } from "@repo/i18n";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@repo/ui/components/empty";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect, type ErrorComponentProps } from "@tanstack/react-router";
import { meQueryOptions } from "../modules/auth/hooks/use-auth";
import { UnauthorizedError } from "../modules/auth/services";
import {
  dashboardSummaryQueryOptions,
  upcomingBillingQueryOptions,
} from "../modules/dashboard/hooks/use-dashboard";
import type { DashboardSummary, UpcomingBillingItem } from "../modules/dashboard/types";
import { subscriptionsQueryOptions } from "../modules/subscriptions/hooks/use-subscriptions";
import { formatDateOnly, formatIdr } from "../modules/subscriptions/utils";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(meQueryOptions);
    } catch (error) {
      if (error instanceof UnauthorizedError) throw redirect({ to: "/login" });
      throw error;
    }
  },
  component: DashboardPage,
  errorComponent: DashboardRouteError,
});

function DashboardRouteError({ reset }: ErrorComponentProps) {
  const { t } = useTranslation();

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <Alert variant="destructive">
        <AlertTitle>{t("dashboard.error.title")}</AlertTitle>
        <AlertDescription className="grid gap-4">
          <p>{t("dashboard.error.description")}</p>
          <Button type="button" variant="outline" className="w-fit" onClick={reset}>
            {t("dashboard.error.retry")}
          </Button>
        </AlertDescription>
      </Alert>
    </section>
  );
}

function DashboardPage() {
  const { t } = useTranslation();
  const user = useQuery(meQueryOptions);
  const summary = useQuery(dashboardSummaryQueryOptions);
  const upcoming = useQuery(upcomingBillingQueryOptions);
  const subscriptions = useQuery(subscriptionsQueryOptions({ sort: "nextBillingDateAsc" }));

  if (!user.data) {
    return <DashboardSkeleton />;
  }

  const identity = user.data.name || user.data.email;
  const isEmpty = subscriptions.data?.items.length === 0;
  const hasSubscriptions = Boolean(subscriptions.data?.items.length);
  const dueSoon = upcoming.data?.items.filter((item) => item.isDueSoon) ?? [];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <Badge variant="secondary">{t("dashboard.eyebrow")}</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("dashboard.title", { name: identity })}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("dashboard.description")}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline">
            <Link to="/subscriptions" search={{ sort: "nextBillingDateAsc" }}>
              {t("dashboard.actions.viewSubscriptions")}
            </Link>
          </Button>
          <Button asChild>
            <Link to="/subscriptions/new">{t("dashboard.actions.addSubscription")}</Link>
          </Button>
        </div>
      </header>

      {subscriptions.isError ? (
        <Alert variant="destructive" className="mt-8">
          <AlertTitle>{t("dashboard.subscriptionsError.title")}</AlertTitle>
          <AlertDescription>{t("dashboard.subscriptionsError.description")}</AlertDescription>
        </Alert>
      ) : null}

      {subscriptions.isPending ? <Skeleton className="mt-8 h-40 w-full rounded-xl" /> : null}

      {isEmpty ? (
        <Empty className="mt-8 rounded-xl border bg-card py-16">
          <EmptyHeader>
            <EmptyTitle>{t("dashboard.empty.title")}</EmptyTitle>
            <EmptyDescription>{t("dashboard.empty.description")}</EmptyDescription>
          </EmptyHeader>
          <Button asChild>
            <Link to="/subscriptions/new">{t("dashboard.actions.addFirst")}</Link>
          </Button>
        </Empty>
      ) : null}

      {hasSubscriptions && summary.isPending ? <SummarySkeleton /> : null}

      {hasSubscriptions && summary.isError ? (
        <Alert variant="destructive" className="mt-8">
          <AlertTitle>{t("dashboard.summary.errorTitle")}</AlertTitle>
          <AlertDescription className="grid gap-4">
            <p>{t("dashboard.summary.error")}</p>
            <Button
              type="button"
              variant="outline"
              className="w-fit"
              onClick={() => summary.refetch()}
            >
              {t("dashboard.actions.retry")}
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {hasSubscriptions && summary.data ? <SummaryCards summary={summary.data} /> : null}

      {hasSubscriptions && dueSoon.length > 0 ? <DueSoonAlert items={dueSoon} /> : null}

      {hasSubscriptions ? (
        <section className="mt-10" aria-labelledby="upcoming-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary">{t("dashboard.upcoming.eyebrow")}</p>
              <h2 id="upcoming-heading" className="mt-2 text-2xl font-semibold tracking-tight">
                {t("dashboard.upcoming.title")}
              </h2>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/subscriptions" search={{ sort: "nextBillingDateAsc" }}>
                {t("dashboard.actions.viewAll")}
              </Link>
            </Button>
          </div>

          {upcoming.isPending ? (
            <div className="mt-5 grid gap-3">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          ) : null}

          {upcoming.isError ? (
            <Alert variant="destructive" className="mt-5">
              <AlertTitle>{t("dashboard.upcoming.errorTitle")}</AlertTitle>
              <AlertDescription className="grid gap-4">
                <p>{t("dashboard.upcoming.error")}</p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-fit"
                  onClick={() => upcoming.refetch()}
                >
                  {t("dashboard.actions.retry")}
                </Button>
              </AlertDescription>
            </Alert>
          ) : null}

          {upcoming.data?.items.length === 0 ? (
            <Card className="mt-5">
              <CardContent>
                <Empty className="py-10">
                  <EmptyHeader>
                    <EmptyTitle>{t("dashboard.upcoming.emptyTitle")}</EmptyTitle>
                    <EmptyDescription>{t("dashboard.upcoming.emptyDescription")}</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </CardContent>
            </Card>
          ) : null}

          {upcoming.data && upcoming.data.items.length > 0 ? (
            <div className="mt-5 overflow-hidden rounded-xl border bg-card">
              {upcoming.data.items.slice(0, 6).map((item, index) => (
                <UpcomingRow
                  key={item.id}
                  item={item}
                  isLast={index === Math.min(upcoming.data.items.length, 6) - 1}
                />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </section>
  );
}

function SummaryCards({ summary }: { summary: DashboardSummary }) {
  const { i18n, t } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";
  const metrics = [
    {
      label: t("dashboard.summary.monthlySpend"),
      value: formatIdr(summary.estimatedMonthlySpend, locale),
      featured: true,
    },
    {
      label: t("dashboard.summary.monthlySaving"),
      value: formatIdr(summary.estimatedMonthlySaving, locale),
      featured: true,
    },
    {
      label: t("dashboard.summary.yearlySpend"),
      value: formatIdr(summary.estimatedYearlySpend, locale),
    },
    {
      label: t("dashboard.summary.activeCount"),
      value: summary.activeSubscriptionCount.toLocaleString(locale),
    },
    {
      label: t("dashboard.summary.trialCount"),
      value: summary.trialSubscriptionCount.toLocaleString(locale),
    },
    {
      label: t("dashboard.summary.candidateCount"),
      value: summary.cancellationCandidateCount.toLocaleString(locale),
    },
  ];

  return (
    <section className="mt-8" aria-labelledby="summary-heading">
      <h2 id="summary-heading" className="sr-only">
        {t("dashboard.summary.title")}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className={metric.featured ? "xl:col-span-2" : undefined}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={
                  metric.featured
                    ? "text-3xl font-semibold tracking-tight"
                    : "text-2xl font-semibold"
                }
              >
                {metric.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function DueSoonAlert({ items }: { items: UpcomingBillingItem[] }) {
  const { t } = useTranslation();

  return (
    <Alert
      aria-live="polite"
      className="mt-8 border-amber-500/70 bg-amber-50 px-5 py-5 text-amber-950 shadow-sm ring-1 ring-amber-500/20 dark:border-amber-400/60 dark:bg-amber-950/40 dark:text-amber-100"
    >
      <Badge className="col-start-2 mb-2 w-fit bg-amber-600 text-white hover:bg-amber-600 dark:bg-amber-400 dark:text-amber-950">
        {t("dashboard.reminder.badge", { count: items.length })}
      </Badge>
      <AlertTitle className="line-clamp-none text-lg font-semibold">
        {t("dashboard.reminder.title", { count: items.length })}
      </AlertTitle>
      <AlertDescription className="mt-1 gap-4 text-amber-900 dark:text-amber-100">
        <p>
          {t("dashboard.reminder.description", {
            count: items.length,
            names: items
              .slice(0, 3)
              .map((item) => item.name)
              .join(", "),
          })}
        </p>
        <Button
          asChild
          size="sm"
          className="bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-300 dark:text-amber-950 dark:hover:bg-amber-200"
        >
          <Link to="/subscriptions" search={{ sort: "nextBillingDateAsc" }}>
            {t("dashboard.actions.reviewBillingDates")}
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}

function UpcomingRow({ item, isLast }: { item: UpcomingBillingItem; isLast: boolean }) {
  const { i18n, t } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";
  const dueLabel =
    item.daysUntilBilling === 0
      ? t("dashboard.upcoming.today")
      : item.daysUntilBilling === 1
        ? t("dashboard.upcoming.tomorrow")
        : t("dashboard.upcoming.inDays", { count: item.daysUntilBilling });

  return (
    <div
      className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between ${isLast ? "" : "border-b"}`}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium">{item.name}</h3>
          {item.isDueSoon ? <Badge variant="secondary">{dueLabel}</Badge> : null}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatDateOnly(item.nextBillingDate, locale)}
        </p>
      </div>
      <div className="sm:text-right">
        <p className="font-medium">{formatIdr(item.price, locale)}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {t(`subscriptions.billingCycles.${item.billingCycle}`)}
        </p>
      </div>
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Skeleton className="h-32 rounded-xl xl:col-span-2" />
      <Skeleton className="h-32 rounded-xl xl:col-span-2" />
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-28 rounded-xl" />
    </div>
  );
}

function DashboardSkeleton() {
  const { t } = useTranslation();

  return (
    <section
      className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14"
      aria-label={t("dashboard.loadingLabel")}
    >
      <Skeleton className="h-7 w-40" />
      <Skeleton className="mt-4 h-10 w-full max-w-md" />
      <Skeleton className="mt-4 h-5 w-full max-w-2xl" />
      <SummarySkeleton />
    </section>
  );
}
