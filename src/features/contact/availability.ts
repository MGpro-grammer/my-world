import type { AvailabilityRule, ClockTime, Weekday } from "../../data/contact.ts";

/** One line of availability, ready to display: some days and their hours. */
export interface AvailabilityLine {
  /** The days, e.g. `"Lundi, mardi, jeudi et vendredi"`. */
  readonly days: string;
  /** Their hours, e.g. `"08:00 – 10:00 et 18:00 – 20:00"`. */
  readonly hours: string;
}

/**
 * Year and month of the reference week used to name weekdays: 1 January 2024
 * was a Monday, so day `n` of January 2024 is ISO weekday `n`.
 */
const REFERENCE_YEAR = 2024;
const REFERENCE_MONTH = 0;

/**
 * Turns availability rules into text in the visitor's language, with the
 * browser's own date and list formats: no day name, time format or "and" is
 * written by hand in a translation file.
 *
 * The hours are shown as they are written in the rules; all dates are built
 * and formatted in UTC so that the visitor's own time zone never shifts them.
 * @param rules - Days and hours at which the author can be called.
 * @param locale - Language of the text, e.g. `"fr"` or `"en"`.
 * @returns One line per rule, in the same order.
 */
export function describeAvailability(
  rules: readonly AvailabilityRule[],
  locale: string,
): AvailabilityLine[] {
  const dayFormat = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" });
  const timeFormat = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });
  const list = new Intl.ListFormat(locale, { style: "long", type: "conjunction" });

  return rules.map((rule) => ({
    days: capitalize(list.format(rule.days.map((day) => dayFormat.format(dateOf(day)))), locale),
    hours: list.format(
      rule.slots.map((slot) => timeFormat.formatRange(dateOf(1, slot.from), dateOf(1, slot.to))),
    ),
  }));
}

/**
 * Builds a date of the reference week, in UTC.
 * @param day - Weekday of the date.
 * @param time - Time of the date; midnight if omitted.
 * @returns The matching date.
 */
function dateOf(day: Weekday, time: ClockTime = "00:00"): Date {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(Date.UTC(REFERENCE_YEAR, REFERENCE_MONTH, day, hours, minutes));
}

/**
 * Puts the first letter of a text in upper case, by the rules of its language.
 * @param text - Text to change.
 * @param locale - Language of the text.
 * @returns The text, starting with a capital letter.
 */
function capitalize(text: string, locale: string): string {
  return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
}
