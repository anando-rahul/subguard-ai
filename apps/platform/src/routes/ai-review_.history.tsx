import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { ArrowLeft, History, AlertTriangle, ShieldCheck, Info, Trash2 } from "lucide-react";
import { useAIReviewHistoryQuery, useDeleteAllAIReviewHistoryMutation, useDeleteAIReviewHistoryMutation } from "../modules/ai/hooks/use-ai";
import { meQueryOptions } from "../modules/auth/hooks/use-auth";
import { UnauthorizedError } from "../modules/auth/services";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";
import { Badge } from "@repo/ui/components/badge";
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

export const Route = createFileRoute("/ai-review_/history")({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(meQueryOptions);
    } catch (error) {
      if (error instanceof UnauthorizedError) throw redirect({ to: "/login" });
      throw error;
    }
  },
  component: AIReviewHistoryPage,
});

function AIReviewHistoryPage() {
  const historyQuery = useAIReviewHistoryQuery();
  const deleteAllMutation = useDeleteAllAIReviewHistoryMutation();
  const deleteMutation = useDeleteAIReviewHistoryMutation();

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8 space-y-4">
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-3 text-muted-foreground">
          <Link to="/ai-review">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to AI Assistant
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <History className="h-7 w-7 text-primary" />
          Review History
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-muted-foreground">
            View past AI recommendations to track your subscription optimizations.
          </p>
          {historyQuery.data && historyQuery.data.data.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2 shrink-0">
                  <Trash2 className="h-4 w-4" />
                  Clear All History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your AI review history from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    variant="destructive"
                    onClick={() => deleteAllMutation.mutate()}
                  >
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {historyQuery.isPending && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 w-full animate-pulse rounded-md bg-muted"></div>
          ))}
        </div>
      )}

      {historyQuery.isError && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="py-6">
            <p className="text-destructive font-medium text-center">
              {historyQuery.error instanceof Error ? historyQuery.error.message : "Failed to load history"}
            </p>
          </CardContent>
        </Card>
      )}

      {historyQuery.data && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {historyQuery.data.data.length === 0 ? (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center space-y-4 py-12 text-center text-muted-foreground">
                <History className="h-8 w-8 opacity-50" />
                <p>No review history found. Run your first analysis on the AI Assistant page.</p>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {historyQuery.data.data.map((log: any) => {
                const date = new Date(log.createdAt).toLocaleDateString("en-US", {
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });
                
                const isFailed = log.status === "FAILED";

                return (
                  <AccordionItem key={log.id} value={log.id} className="border rounded-lg bg-card px-4 shadow-sm data-[state=open]:border-primary/50 transition-colors">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pr-4 gap-2">
                        <div className="font-semibold text-left">{date}</div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMutation.mutate(log.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      {isFailed ? (
                        <p className="text-destructive font-medium bg-destructive/10 p-3 rounded-md">
                          {log.errorMessage || "Analysis failed."}
                        </p>
                      ) : (
                        <div className="space-y-6">
                          {log.outputSummary?.overallSummary && (
                            <div className="bg-primary/5 border border-primary/10 p-4 rounded-md">
                              <h4 className="font-semibold text-primary mb-2 text-sm uppercase tracking-wider">Overall Summary</h4>
                              <p className="text-sm leading-relaxed">{log.outputSummary.overallSummary}</p>
                            </div>
                          )}
                          
                          {log.outputSummary?.recommendations && log.outputSummary.recommendations.length > 0 && (
                            <div className="space-y-4">
                              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Recommendations</h4>
                              <div className="grid gap-4 sm:grid-cols-2">
                                {log.outputSummary.recommendations.map((rec: any, idx: number) => {
                                  const isHigh = rec.urgency === "HIGH";
                                  const isMedium = rec.urgency === "MEDIUM";
                                  
                                  return (
                                    <div key={idx} className={`p-4 rounded-md border ${isHigh ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-muted/30'}`}>
                                      <div className="flex items-start justify-between mb-3">
                                        <h5 className="font-semibold">{rec.name}</h5>
                                        <Badge 
                                          variant={isHigh ? "destructive" : isMedium ? "secondary" : "default"}
                                          className="uppercase text-[10px] font-bold"
                                        >
                                          {rec.urgency}
                                        </Badge>
                                      </div>
                                      <div className="space-y-3 text-sm">
                                        <div className="flex gap-2 items-start">
                                          <Info className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                                          <span className="text-muted-foreground">{rec.reason}</span>
                                        </div>
                                        <div className="flex gap-2 items-start">
                                          {isHigh ? <AlertTriangle className="h-3.5 w-3.5 mt-0.5 text-destructive shrink-0" /> : <ShieldCheck className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />}
                                          <span className={isHigh ? "text-destructive-foreground font-medium" : "text-foreground font-medium"}>
                                            {rec.suggestedAction}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          
                          {(!log.outputSummary?.recommendations || log.outputSummary.recommendations.length === 0) && (
                            <p className="text-muted-foreground text-sm italic">No specific recommendations in this analysis.</p>
                          )}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      )}
    </div>
  );
}
