import { describe, expect, it } from "vitest";
import { LANGUAGE_CHOICE_URL, pageUrl } from "./pageUrl.ts";

describe("pageUrl", () => {
  it("builds the official address of a page, ending with a slash", () => {
    expect(pageUrl("fr", "/")).toBe("https://www.georges-mouratidis.be/fr/");
    expect(pageUrl("en", "/projects/wordeul")).toBe(
      "https://www.georges-mouratidis.be/en/projects/wordeul/",
    );
    expect(pageUrl("fr", "/contact")).toBe("https://www.georges-mouratidis.be/fr/contact/");
  });

  it("points the language choice to the bare site", () => {
    expect(LANGUAGE_CHOICE_URL).toBe("https://www.georges-mouratidis.be/");
  });
});
