import { createBrowserRouter, type RouteObject } from "react-router";
import App from "./App.tsx";
import { HomePage } from "./features/home/HomePage.tsx";
import { LanguageRedirect } from "./features/language/LanguageRedirect.tsx";
import { NotFoundPage } from "./features/not-found/NotFoundPage.tsx";
import { ProjectPage } from "./features/project-page/ProjectPage.tsx";
import { LANGUAGES } from "./i18n/languages.ts";

/**
 * Pages that exist in every language, with their path after the language.
 * @returns A new list each time, as each language needs its own route objects.
 */
function pagesOfOneLanguage(): RouteObject[] {
  return [
    { index: true, Component: HomePage },
    { path: "projects/:projectId", Component: ProjectPage },
    { path: "*", Component: NotFoundPage },
  ];
}

/**
 * Every page of the site and its address.
 * `App` is the shared layout: its wave background stays in place while the
 * pages change inside it. Each language has its own branch (`/fr/…`,
 * `/en/…`); the bare address `/` sends the visitor to one of them, and an
 * address with an unknown language shows the "page not found" page.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: LanguageRedirect },
      ...LANGUAGES.map((language) => ({ path: language, children: pagesOfOneLanguage() })),
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
