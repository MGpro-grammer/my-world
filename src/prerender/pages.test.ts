import { matchRoutes } from "react-router";
import { describe, expect, it } from "vitest";
import { PROJECTS } from "../data/projects.ts";
import { LANGUAGES } from "../i18n/languages.ts";
import { routes } from "../routes.ts";
import { prerenderedPages } from "./pages.ts";

describe("prerenderedPages", () => {
  const pages = prerenderedPages();

  it("lists the home page, the contact page and every project, in every language", () => {
    expect(pages).toHaveLength(LANGUAGES.length * (2 + PROJECTS.length));
  });

  it("only lists addresses that lead to a real page, not to the 'page not found' one", () => {
    for (const page of pages) {
      const matches = matchRoutes(routes, new URL(page.url).pathname) ?? [];
      expect(matches.at(-1)?.route.path, page.file).not.toBe("*");
    }
  });

  it("writes each page in the folder of its address", () => {
    expect(pages).toContainEqual({
      language: "en",
      path: "/projects/wordeul",
      url: "https://www.georges-mouratidis.be/en/projects/wordeul/",
      file: "en/projects/wordeul/index.html",
    });
  });
});
