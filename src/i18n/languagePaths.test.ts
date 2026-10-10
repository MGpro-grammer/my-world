import { describe, expect, it } from "vitest";
import { languageOfPath, localizedPath, pathInLanguage } from "./languagePaths.ts";

describe("languageOfPath", () => {
  it.each([
    ["/fr", "fr"],
    ["/en/projects/wordeul", "en"],
    ["/fr/contact", "fr"],
  ])("reads the language of %s", (pathname, language) => {
    expect(languageOfPath(pathname)).toBe(language);
  });

  it.each(["/", "/projects/wordeul", "/de/contact", "/french", ""])(
    "finds no language in %j",
    (pathname) => {
      expect(languageOfPath(pathname)).toBeUndefined();
    },
  );
});

describe("localizedPath", () => {
  it("builds the home page and the other pages of a language", () => {
    expect(localizedPath("en", "/")).toBe("/en");
    expect(localizedPath("fr", "/projects/wordeul")).toBe("/fr/projects/wordeul");
  });
});

describe("pathInLanguage", () => {
  it("keeps the same page in the other language", () => {
    expect(pathInLanguage("/fr/projects/wordeul", "en")).toBe("/en/projects/wordeul");
    expect(pathInLanguage("/en/contact", "fr")).toBe("/fr/contact");
    expect(pathInLanguage("/en", "fr")).toBe("/fr");
  });

  it("leads to the home page of the language when the path has none", () => {
    expect(pathInLanguage("/", "fr")).toBe("/fr");
    expect(pathInLanguage("/de/contact", "en")).toBe("/en");
  });
});
