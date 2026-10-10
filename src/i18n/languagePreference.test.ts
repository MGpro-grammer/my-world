import { describe, expect, it } from "vitest";
import { pickLanguage } from "./languagePreference.ts";

describe("pickLanguage", () => {
  it("prefers the language the visitor chose before", () => {
    expect(pickLanguage("en", ["fr-BE", "fr"])).toBe("en");
  });

  it("ignores a saved value that is not a language of the site", () => {
    expect(pickLanguage("de", ["fr-BE"])).toBe("fr");
    expect(pickLanguage(null, ["fr-BE"])).toBe("fr");
  });

  it.each([
    [["fr-BE", "fr", "en"], "fr"],
    [["en-US", "en"], "en"],
    [["nl-BE", "fr-BE", "en"], "fr"],
    [["FR-be"], "fr"],
  ])("takes the first browser language the site has: %j", (browserLanguages, expected) => {
    expect(pickLanguage(null, browserLanguages)).toBe(expected);
  });

  it.each([[["nl-BE"]], [["de-DE", "es"]], [[]]])(
    "falls back to English for %j",
    (browserLanguages) => {
      expect(pickLanguage(null, browserLanguages)).toBe("en");
    },
  );
});
