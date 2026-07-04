import type { SubscriptionFieldErrors, SubscriptionFormValues, SubscriptionInput } from "./types";

const dateOnlyPattern = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidDateOnly(value: string) {
  const match = dateOnlyPattern.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

export function validateSubscriptionForm(values: SubscriptionFormValues) {
  const errors: SubscriptionFieldErrors = {};
  const name = values.name.trim();
  const price = Number(values.price);

  if (name.length < 2 || name.length > 80) errors.name = "name";
  if (!Number.isFinite(price) || price <= 0 || price > 9_999_999_999.99) {
    errors.price = "price";
  }
  if (!isValidDateOnly(values.nextBillingDate)) errors.nextBillingDate = "nextBillingDate";
  if ((values.paymentMethod?.trim().length ?? 0) > 80) errors.paymentMethod = "paymentMethod";
  if ((values.notes?.trim().length ?? 0) > 500) errors.notes = "notes";

  if (Object.keys(errors).length > 0) {
    return { errors, success: false } as const;
  }

  const input: SubscriptionInput = {
    ...values,
    name,
    notes: values.notes?.trim() || null,
    paymentMethod: values.paymentMethod?.trim() || null,
    price,
  };

  return { input, success: true } as const;
}
