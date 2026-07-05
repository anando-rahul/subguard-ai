import { useTranslation } from "@repo/i18n";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { CircleHelpIcon } from "@repo/ui/components/icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/components/tooltip";
import { useState } from "react";
import {
  billingSourcePromptChoices,
  getCancellationGuideStepKeys,
  recurringPaymentChoices,
  type BillingSourcePromptChoice,
} from "../../modules/subscriptions/cancellation-guidance";
import { useBillingSourceMutation } from "../../modules/subscriptions/hooks/use-subscriptions";
import type { BillingSource, Subscription } from "../../modules/subscriptions/types";

type DialogStep = "guide" | "recurring-payment" | "source-question";

type HowToCancelDialogProps = {
  disabled?: boolean;
  subscription: Subscription;
};

export function HowToCancelDialog({ disabled, subscription }: HowToCancelDialogProps) {
  const { t } = useTranslation();
  const mutation = useBillingSourceMutation();
  const [activeSource, setActiveSource] = useState<BillingSource>(subscription.billingSource);
  const [error, setError] = useState<string>();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<DialogStep>("guide");

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setActiveSource(subscription.billingSource);
      setError(undefined);
      setStep(subscription.billingSource === "UNKNOWN" ? "source-question" : "guide");
    }
    setOpen(nextOpen);
  }

  function showGuide(source: BillingSource) {
    setActiveSource(source);
    setError(undefined);
    setStep("guide");
  }

  function persistAndShowGuide(source: BillingSource) {
    setError(undefined);

    if (source === activeSource) {
      showGuide(source);
      return;
    }

    mutation.mutate(
      { billingSource: source, id: subscription.id },
      {
        onError: () => setError(t("subscriptions.cancellation.saveError.description")),
        onSuccess: (updatedSubscription) => showGuide(updatedSubscription.billingSource),
      },
    );
  }

  function choosePromptOption(choice: BillingSourcePromptChoice) {
    if (choice === "RECURRING_PAYMENT") {
      setError(undefined);
      setStep("recurring-payment");
      return;
    }

    persistAndShowGuide(choice);
  }

  function showSourceQuestion() {
    setError(undefined);
    setStep("source-question");
  }

  const sourceLabel = t(`subscriptions.billingSources.${activeSource}`);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              aria-label={t("subscriptions.actions.howToCancelLabel", {
                name: subscription.name,
              })}
              disabled={disabled}
            >
              <CircleHelpIcon aria-hidden="true" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          {t("subscriptions.actions.howToCancel")}
        </TooltipContent>
      </Tooltip>

      <DialogContent
        className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-xl"
        showCloseButton={false}
      >
        {step === "source-question" ? (
          <>
            <DialogHeader>
              <DialogTitle>{t("subscriptions.cancellation.sourceQuestion.title")}</DialogTitle>
              <DialogDescription>
                {t("subscriptions.cancellation.sourceQuestion.description", {
                  name: subscription.name,
                })}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              {billingSourcePromptChoices.map((choice) => (
                <Button
                  key={choice}
                  type="button"
                  variant="outline"
                  className="h-auto min-h-10 justify-start whitespace-normal px-4 py-2.5 text-left"
                  disabled={mutation.isPending}
                  onClick={() => choosePromptOption(choice)}
                >
                  {t(`subscriptions.cancellation.sourceQuestion.options.${choice}`)}
                </Button>
              ))}
            </div>
            <SaveError error={error} />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  {t("subscriptions.cancellation.actions.close")}
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : null}

        {step === "recurring-payment" ? (
          <>
            <DialogHeader>
              <DialogTitle>{t("subscriptions.cancellation.recurringPayment.title")}</DialogTitle>
              <DialogDescription>
                {t("subscriptions.cancellation.recurringPayment.description")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              {recurringPaymentChoices.map((source) => (
                <Button
                  key={source}
                  type="button"
                  variant="outline"
                  className="h-auto min-h-10 justify-start whitespace-normal px-4 py-2.5 text-left"
                  disabled={mutation.isPending}
                  onClick={() => persistAndShowGuide(source)}
                >
                  {t(`subscriptions.cancellation.recurringPayment.options.${source}`)}
                </Button>
              ))}
            </div>
            <SaveError error={error} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={showSourceQuestion}>
                {t("subscriptions.cancellation.actions.back")}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  {t("subscriptions.cancellation.actions.close")}
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : null}

        {step === "guide" ? (
          <>
            <DialogHeader>
              <DialogTitle>
                {t("subscriptions.cancellation.guide.title", { name: subscription.name })}
              </DialogTitle>
              <DialogDescription>
                {t("subscriptions.cancellation.guide.description", { source: sourceLabel })}
              </DialogDescription>
            </DialogHeader>
            <ol className="grid list-decimal gap-3 pl-5 text-sm leading-6">
              {getCancellationGuideStepKeys(activeSource).map((key) => (
                <li key={key} className="pl-1">
                  {t(key)}
                </li>
              ))}
            </ol>
            <p className="rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">
              {t("subscriptions.cancellation.guide.note")}
            </p>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={showSourceQuestion}>
                {t("subscriptions.cancellation.actions.changeSource")}
              </Button>
              <DialogClose asChild>
                <Button type="button">{t("subscriptions.cancellation.actions.close")}</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function SaveError({ error }: { error?: string }) {
  const { t } = useTranslation();

  if (!error) return null;

  return (
    <Alert variant="destructive" aria-live="polite">
      <AlertTitle>{t("subscriptions.cancellation.saveError.title")}</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
