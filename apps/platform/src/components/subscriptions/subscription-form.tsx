import { useTranslation } from "@repo/i18n";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/field";
import { Input } from "@repo/ui/components/input";
import { NativeSelect, NativeSelectOption } from "@repo/ui/components/native-select";
import { Textarea } from "@repo/ui/components/textarea";
import { Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { validateSubscriptionForm } from "../../modules/subscriptions/schema";
import {
  billingCycles,
  subscriptionCategories,
  subscriptionStatuses,
  usageFrequencies,
  type SubscriptionFieldErrors,
  type SubscriptionFormValues,
  type SubscriptionInput,
} from "../../modules/subscriptions/types";
import { getJakartaDateOnly } from "../../modules/subscriptions/utils";

type SubscriptionFormProps = {
  error?: string;
  initialValues: SubscriptionFormValues;
  isSubmitting: boolean;
  onSubmit: (input: SubscriptionInput) => void;
};

export function SubscriptionForm({
  error,
  initialValues,
  isSubmitting,
  onSubmit,
}: SubscriptionFormProps) {
  const { t } = useTranslation();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<SubscriptionFieldErrors>({});
  const isPastDate = Boolean(
    values.nextBillingDate && values.nextBillingDate < getJakartaDateOnly(),
  );

  function update<K extends keyof SubscriptionFormValues>(
    field: K,
    value: SubscriptionFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateSubscriptionForm(values);

    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    onSubmit(result.input);
  }

  function errorMessage(field: keyof SubscriptionFormValues) {
    const errorKey = errors[field];
    return errorKey ? t(`subscriptions.validation.${errorKey}`) : undefined;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>{t("subscriptions.form.submitErrorTitle")}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <div className="grid gap-6 md:grid-cols-2">
              <Field data-invalid={Boolean(errors.name)}>
                <FieldLabel htmlFor="subscription-name">
                  {t("subscriptions.fields.name")}
                </FieldLabel>
                <Input
                  id="subscription-name"
                  autoComplete="off"
                  maxLength={80}
                  aria-invalid={Boolean(errors.name)}
                  value={values.name}
                  onChange={(event) => update("name", event.target.value)}
                />
                <FieldError>{errorMessage("name")}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.price)}>
                <FieldLabel htmlFor="subscription-price">
                  {t("subscriptions.fields.price")}
                </FieldLabel>
                <Input
                  id="subscription-price"
                  inputMode="decimal"
                  min="0.01"
                  step="0.01"
                  type="number"
                  aria-invalid={Boolean(errors.price)}
                  value={values.price}
                  onChange={(event) => update("price", event.target.value)}
                />
                <FieldDescription>{t("subscriptions.form.priceHint")}</FieldDescription>
                <FieldError>{errorMessage("price")}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="subscription-cycle">
                  {t("subscriptions.fields.billingCycle")}
                </FieldLabel>
                <NativeSelect
                  id="subscription-cycle"
                  className="w-full"
                  value={values.billingCycle}
                  onChange={(event) =>
                    update(
                      "billingCycle",
                      event.target.value as SubscriptionFormValues["billingCycle"],
                    )
                  }
                >
                  {billingCycles.map((cycle) => (
                    <NativeSelectOption key={cycle} value={cycle}>
                      {t(`subscriptions.billingCycles.${cycle}`)}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>

              <Field data-invalid={Boolean(errors.nextBillingDate)}>
                <FieldLabel htmlFor="subscription-date">
                  {t("subscriptions.fields.nextBillingDate")}
                </FieldLabel>
                <Input
                  id="subscription-date"
                  type="date"
                  aria-invalid={Boolean(errors.nextBillingDate)}
                  value={values.nextBillingDate}
                  onChange={(event) => update("nextBillingDate", event.target.value)}
                />
                {isPastDate ? (
                  <FieldDescription className="text-amber-700 dark:text-amber-300">
                    {t("subscriptions.form.pastDateWarning")}
                  </FieldDescription>
                ) : null}
                <FieldError>{errorMessage("nextBillingDate")}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="subscription-category">
                  {t("subscriptions.fields.category")}
                </FieldLabel>
                <NativeSelect
                  id="subscription-category"
                  className="w-full"
                  value={values.category}
                  onChange={(event) =>
                    update("category", event.target.value as SubscriptionFormValues["category"])
                  }
                >
                  {subscriptionCategories.map((category) => (
                    <NativeSelectOption key={category} value={category}>
                      {t(`subscriptions.categories.${category}`)}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>

              <Field>
                <FieldLabel htmlFor="subscription-status">
                  {t("subscriptions.fields.status")}
                </FieldLabel>
                <NativeSelect
                  id="subscription-status"
                  className="w-full"
                  value={values.status}
                  onChange={(event) =>
                    update("status", event.target.value as SubscriptionFormValues["status"])
                  }
                >
                  {subscriptionStatuses.map((status) => (
                    <NativeSelectOption key={status} value={status}>
                      {t(`subscriptions.statuses.${status}`)}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>

              <Field>
                <FieldLabel htmlFor="subscription-usage">
                  {t("subscriptions.fields.usageFrequency")}
                </FieldLabel>
                <NativeSelect
                  id="subscription-usage"
                  className="w-full"
                  value={values.usageFrequency}
                  onChange={(event) =>
                    update(
                      "usageFrequency",
                      event.target.value as SubscriptionFormValues["usageFrequency"],
                    )
                  }
                >
                  {usageFrequencies.map((frequency) => (
                    <NativeSelectOption key={frequency} value={frequency}>
                      {t(`subscriptions.usageFrequencies.${frequency}`)}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>

              <Field data-invalid={Boolean(errors.paymentMethod)}>
                <FieldLabel htmlFor="subscription-payment">
                  {t("subscriptions.fields.paymentMethod")}
                </FieldLabel>
                <Input
                  id="subscription-payment"
                  maxLength={80}
                  aria-invalid={Boolean(errors.paymentMethod)}
                  value={values.paymentMethod ?? ""}
                  onChange={(event) => update("paymentMethod", event.target.value)}
                />
                <FieldError>{errorMessage("paymentMethod")}</FieldError>
              </Field>
            </div>

            <Field data-invalid={Boolean(errors.notes)}>
              <FieldLabel htmlFor="subscription-notes">
                {t("subscriptions.fields.notes")}
              </FieldLabel>
              <Textarea
                id="subscription-notes"
                maxLength={500}
                rows={4}
                aria-invalid={Boolean(errors.notes)}
                value={values.notes ?? ""}
                onChange={(event) => update("notes", event.target.value)}
              />
              <FieldDescription>
                {t("subscriptions.form.notesCount", { count: values.notes?.length ?? 0 })}
              </FieldDescription>
              <FieldError>{errorMessage("notes")}</FieldError>
            </Field>

            <Field orientation="horizontal">
              <Checkbox
                id="subscription-candidate"
                checked={values.isCancellationCandidate}
                onCheckedChange={(checked) => update("isCancellationCandidate", checked === true)}
              />
              <div className="grid gap-1">
                <FieldLabel htmlFor="subscription-candidate">
                  {t("subscriptions.fields.candidate")}
                </FieldLabel>
                <FieldDescription>{t("subscriptions.form.candidateHint")}</FieldDescription>
              </div>
            </Field>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button asChild variant="outline">
                <Link to="/subscriptions" search={{ sort: "nextBillingDateAsc" }}>
                  {t("subscriptions.actions.cancel")}
                </Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("subscriptions.actions.saving") : t("subscriptions.actions.save")}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
