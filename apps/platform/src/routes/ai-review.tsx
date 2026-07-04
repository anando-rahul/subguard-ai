import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTranslation } from "@repo/i18n";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { useReviewSubscription } from "../modules/ai/hooks/use-ai";
import { Sparkles, AlertTriangle, ShieldCheck, Info } from "lucide-react";
import { Badge } from "@repo/ui/components/badge";
import { meQueryOptions } from "../modules/auth/hooks/use-auth";
import { UnauthorizedError } from "../modules/auth/services";

export const Route = createFileRoute("/ai-review")({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(meQueryOptions);
    } catch (error) {
      if (error instanceof UnauthorizedError) throw redirect({ to: "/login" });
      throw error;
    }
  },
  component: AIReviewPage,
});

function AIReviewPage() {
  const { t } = useTranslation();
  const reviewMutation = useReviewSubscription();

  const handleStartAnalysis = () => {
    reviewMutation.mutate();
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Review Assistant</h1>
        <p className="text-muted-foreground">
          Biarkan AI kami menganalisis kebiasaan langganan Anda dan memberikan rekomendasi untuk menghemat uang.
        </p>
      </div>

      {!reviewMutation.data && !reviewMutation.isPending && (
        <Card className="border-dashed bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Mulai Analisis Cerdas</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                AI kami akan meninjau langganan Anda berdasarkan frekuensi penggunaan, biaya, dan siklus tagihan untuk mengidentifikasi potensi penghematan.
              </p>
            </div>
            <Button size="lg" onClick={handleStartAnalysis} className="mt-4 gap-2">
              <Sparkles className="h-4 w-4" />
              Start Analysis
            </Button>
            {reviewMutation.isError && (
              <p className="text-sm text-destructive mt-4 font-medium">
                {reviewMutation.error instanceof Error ? reviewMutation.error.message : "Terjadi kesalahan"}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {reviewMutation.isPending && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="h-6 w-1/3 animate-pulse rounded bg-muted"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
                <div className="h-4 w-5/6 animate-pulse rounded bg-muted"></div>
                <div className="h-4 w-4/6 animate-pulse rounded bg-muted"></div>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-5 w-1/2 animate-pulse rounded bg-muted"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {reviewMutation.data && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Overall Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">{reviewMutation.data.data.overallSummary}</p>
              <div className="mt-6">
                <Button variant="outline" size="sm" onClick={handleStartAnalysis} disabled={reviewMutation.isPending}>
                  Refresh Analysis
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Recommendations</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {reviewMutation.data.data.recommendations.map((rec: any, index: number) => {
                const isHigh = rec.urgency === "HIGH";
                const isMedium = rec.urgency === "MEDIUM";
                
                return (
                  <Card key={index} className={isHigh ? "border-destructive/50" : ""}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{rec.name}</CardTitle>
                        <Badge 
                          variant={isHigh ? "destructive" : isMedium ? "secondary" : "default"}
                          className="uppercase text-[10px] font-bold"
                        >
                          {rec.urgency} URGENCY
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div className="flex gap-2 items-start">
                        <div className="mt-0.5 rounded-full p-1 bg-muted">
                          <Info className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <span className="font-semibold block text-xs uppercase text-muted-foreground mb-1">Reason</span>
                          {rec.reason}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 items-start bg-muted/30 p-3 rounded-md border border-border/50">
                        <div className={`mt-0.5 rounded-full p-1 ${isHigh ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                          {isHigh ? <AlertTriangle className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                        </div>
                        <div>
                          <span className="font-semibold block text-xs uppercase text-muted-foreground mb-1">Suggested Action</span>
                          {rec.suggestedAction}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {reviewMutation.data.data.recommendations.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                  Tidak ada rekomendasi spesifik saat ini. Anda mengelola langganan dengan sangat baik!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
