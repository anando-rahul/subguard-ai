const dateOnlyPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
const millisecondsPerDay = 86_400_000;

function getDateParts(value: string) {
  const match = dateOnlyPattern.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return { day, month, year };
}

export function isValidDateOnly(value: string) {
  return getDateParts(value) !== null;
}

export function parseDateOnly(value: string) {
  const parts = getDateParts(value);

  if (!parts) {
    throw new Error("Invalid date-only value");
  }

  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
}

export function formatDateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function addMonthsToDateOnly(value: Date, months: number) {
  const targetMonth = value.getUTCMonth() + months;
  const targetYear = value.getUTCFullYear() + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;
  const lastDayOfTargetMonth = new Date(Date.UTC(targetYear, normalizedMonth + 1, 0)).getUTCDate();

  return new Date(
    Date.UTC(targetYear, normalizedMonth, Math.min(value.getUTCDate(), lastDayOfTargetMonth)),
  );
}

export function getJakartaDateOnly(value = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Jakarta",
    year: "numeric",
  }).formatToParts(value);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}

export function differenceInCalendarDays(date: string, fromDate: string) {
  const target = parseDateOnly(date).getTime();
  const origin = parseDateOnly(fromDate).getTime();

  return Math.round((target - origin) / millisecondsPerDay);
}
