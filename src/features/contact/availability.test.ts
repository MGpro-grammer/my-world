import { afterEach, describe, expect, it, vi } from "vitest";
import type { AvailabilityRule } from "../../data/contact.ts";
import { describeAvailability } from "./availability.ts";

/** Same hours as the phone channel of the site. */
const RULES: readonly AvailabilityRule[] = [
  {
    days: [1, 2, 4, 5],
    slots: [
      { from: "08:00", to: "10:00" },
      { from: "18:00", to: "20:00" },
    ],
  },
  {
    days: [3],
    slots: [
      { from: "08:00", to: "14:00" },
      { from: "16:00", to: "20:00" },
    ],
  },
  { days: [6, 7], slots: [{ from: "08:00", to: "20:00" }] },
];

/**
 * Replaces the special spaces of the browser formats (thin, narrow no-break)
 * with plain spaces: they vary between versions of the date library.
 */
function plain(text: string): string {
  return text.replace(/\s+/gu, " ");
}

/** Lines of availability with plain spaces, for comparison. */
function linesIn(locale: string) {
  return describeAvailability(RULES, locale).map(({ days, hours }) => ({
    days: plain(days),
    hours: plain(hours),
  }));
}

describe("describeAvailability", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("writes the days and hours in French", () => {
    expect(linesIn("fr")).toEqual([
      { days: "Lundi, mardi, jeudi et vendredi", hours: "08:00 – 10:00 et 18:00 – 20:00" },
      { days: "Mercredi", hours: "08:00 – 14:00 et 16:00 – 20:00" },
      { days: "Samedi et dimanche", hours: "08:00 – 20:00" },
    ]);
  });

  it("writes the days and hours in English", () => {
    expect(linesIn("en")).toEqual([
      {
        days: "Monday, Tuesday, Thursday, and Friday",
        hours: "8:00 – 10:00 AM and 6:00 – 8:00 PM",
      },
      { days: "Wednesday", hours: "8:00 AM – 2:00 PM and 4:00 – 8:00 PM" },
      { days: "Saturday and Sunday", hours: "8:00 AM – 8:00 PM" },
    ]);
  });

  it("does not depend on the time zone of the computer", () => {
    // UTC+14 then UTC−11: the same dates fall on different days there.
    vi.stubEnv("TZ", "Pacific/Kiritimati");
    const farEast = linesIn("fr");
    vi.stubEnv("TZ", "Pacific/Pago_Pago");
    expect(linesIn("fr")).toEqual(farEast);
  });
});
