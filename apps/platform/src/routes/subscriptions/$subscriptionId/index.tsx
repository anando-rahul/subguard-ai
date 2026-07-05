import { useTranslation } from "@repo/i18n";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import { formatDateOnly, formatIdr } from "../../../modules/subscriptions/utils";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarIcon,
  CreditCard,
  Edit2Icon,
  Clock,
  Activity,
  AlertCircle,
  FileText
} from "lucide-react";
import { meQueryOptions } from "../../../modules/auth/hooks/use-auth";
import { UnauthorizedError } from "../../../modules/auth/services";
import { subscriptionQueryOptions } from "../../../modules/subscriptions/hooks/use-subscriptions";
import { ApiRequestError } from "../../../modules/subscriptions/services";
import type { SubscriptionStatus } from "../../../modules/subscriptions/types";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";

export const Route = createFileRoute("/subscriptions/$subscriptionId/")({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(meQueryOptions);
    } catch (error) {
      if (error instanceof UnauthorizedError) throw redirect({ to: "/login" });
      throw error;
    }
  },
  component: SubscriptionDetailPage,
});

function SubscriptionDetailPage() {
  const { subscriptionId } = Route.useParams();
  const { t, i18n } = useTranslation();
  const subscription = useQuery(subscriptionQueryOptions(subscriptionId));

  if (subscription.isPending) {
    return (
      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <Skeleton className="h-10 w-24 mb-8" />
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-6 w-32 mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
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

  const data = subscription.data;

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header */}
      <div className="mb-10">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-3 text-muted-foreground hover:text-foreground">
          <Link to="/subscriptions" search={{ sort: "nextBillingDateAsc" }}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("subscriptions.actions.backToList", "Back to list")}
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
              {data.isCancellationCandidate && (
                <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-600 px-2 py-0.5 text-xs font-bold">
                  Candidate
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="px-2.5 py-1 text-xs rounded-md">
                {t(`subscriptions.categories.${data.category}`)}
              </Badge>
              <StatusBadge status={data.status} />
            </div>
          </div>
          
          <Button asChild variant="outline" className="shrink-0">
            <Link to="/subscriptions/$subscriptionId/edit" params={{ subscriptionId: data.id }}>
              <Edit2Icon className="mr-2 h-4 w-4" />
              {t("subscriptions.actions.edit")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Cost & Cycle */}
        <Card className="shadow-sm border-border/50 lg:col-span-1">
          <CardHeader className="pb-3 flex flex-row items-center space-y-0 gap-2">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">Cost & Cycle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {formatIdr(data.price, i18n.resolvedLanguage ?? "en")}
            </div>
            <p className="text-sm text-muted-foreground mt-1 font-medium uppercase tracking-wider">
              {t(`subscriptions.billingCycles.${data.billingCycle}`)}
            </p>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card className="shadow-sm border-border/50 lg:col-span-1">
          <CardHeader className="pb-3 flex flex-row items-center space-y-0 gap-2">
            <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
              <CalendarIcon className="h-5 w-5 text-blue-500" />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">Billing Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDateOnly(data.nextBillingDate, i18n.resolvedLanguage ?? "en")}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {t("subscriptions.fields.nextBillingDate")}
            </p>
          </CardContent>
        </Card>

        {/* Usage */}
        <Card className="shadow-sm border-border/50 lg:col-span-1">
          <CardHeader className="pb-3 flex flex-row items-center space-y-0 gap-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg shrink-0">
              <Activity className="h-5 w-5 text-emerald-500" />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">Usage Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {t(`subscriptions.usageFrequencies.${data.usageFrequency}`)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Service activity
            </p>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card className="shadow-sm border-border/50 md:col-span-2">
          <CardHeader className="pb-4 border-b border-border/40">
            <CardTitle className="text-base font-semibold">Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {t("subscriptions.fields.paymentMethod")}
                </p>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-base">
                    {data.paymentMethod ?? t("subscriptions.list.paymentMethodFallback")}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {t("subscriptions.fields.billingSource")}
                </p>
                <p className="font-semibold text-base">
                  {t(`subscriptions.billingSources.${data.billingSource}`)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="shadow-sm border-border/50 md:col-span-1">
          <CardHeader className="pb-4 border-b border-border/40">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {data.notes ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.notes}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">No notes provided.</p>
            )}
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="shadow-sm bg-muted/20 border-transparent lg:col-span-3 mt-4">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col sm:flex-row flex-wrap sm:items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span><strong className="font-medium text-foreground">Added:</strong> {formatDateOnly(data.createdAt.slice(0, 10), i18n.resolvedLanguage ?? "en")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span><strong className="font-medium text-foreground">Updated:</strong> {formatDateOnly(data.updatedAt.slice(0, 10), i18n.resolvedLanguage ?? "en")}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </section>
  );
}

function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const { t } = useTranslation();
  const variant = status === "CANCELLED" ? "outline" : status === "TRIAL" ? "secondary" : "default";

  return <Badge variant={variant}>{t(`subscriptions.statuses.${status}`)}</Badge>;
}
