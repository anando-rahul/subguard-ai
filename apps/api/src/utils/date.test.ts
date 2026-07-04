import { describe, expect, it } from "vitest";
import {
  addMonthsToDateOnly,
  differenceInCalendarDays,
  formatDateOnly,
  getJakartaDateOnly,
  isValidDateOnly,
  parseDateOnly,
} from "./date";

describe("date-only utilities", () => {
  it("strictly validates calendar dates", () => {
    expect(isValidDateOnly("2026-02-28")).toBe(true);
    expect(isValidDateOnly("2026-02-30")).toBe(false);
    expect(isValidDateOnly("04/07/2026")).toBe(false);
  });

  it("round-trips valid date-only values", () => {
    expect(formatDateOnly(parseDateOnly("2026-07-04"))).toBe("2026-07-04");
  });

  it("advances date-only values while clamping month-end dates", () => {
    expect(formatDateOnly(addMonthsToDateOnly(parseDateOnly("2026-01-31"), 1))).toBe("2026-02-28");
    expect(formatDateOnly(addMonthsToDateOnly(parseDateOnly("2024-02-29"), 12))).toBe("2025-02-28");
  });

  it("calculates calendar-day boundaries without local timezone drift", () => {
    expect(differenceInCalendarDays("2026-07-04", "2026-07-04")).toBe(0);
    expect(differenceInCalendarDays("2026-07-11", "2026-07-04")).toBe(7);
    expect(differenceInCalendarDays("2026-07-03", "2026-07-04")).toBe(-1);
  });

  it("derives the current date in Asia/Jakarta", () => {
    expect(getJakartaDateOnly(new Date("2026-07-03T18:00:00.000Z"))).toBe("2026-07-04");
  });
});
