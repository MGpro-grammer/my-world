import { pageUrl } from "../components/PageHead/pageUrl.ts";
import { PROJECTS } from "../data/projects.ts";
import { localizedPath } from "../i18n/languagePaths.ts";
import { LANGUAGES, type Language } from "../i18n/languages.ts";

/** A page written as a ready-made HTML file when the site is built. */
export interface PrerenderedPage {
  /** Language of the page. */
  readonly language: Language;
  /** Path of the page without language, e.g. `"/"` or `"/projects/wordeul"`. */
  readonly path: string;
  /** Official address of the page, e.g. `"https://…/en/projects/wordeul/"`. */
  readonly url: string;
  /** File to write, relative to the build folder, e.g. `"en/projects/wordeul/index.html"`. */
  readonly file: string;
}

/**
 * Lists every page that has content of its own, in every language: the home
 * page, the contact page and one page per project.
 *
 * The bare address and the "page not found" page are not in the list: they
 * depend on the visitor (preferred language, mistyped address) and are drawn
 * in the browser only.
 * @returns The pages, language by language.
 */
export function prerenderedPages(): PrerenderedPage[] {
  const paths = ["/", "/contact", ...PROJECTS.map((project) => `/projects/${project.id}`)];
  return LANGUAGES.flatMap((language) =>
    paths.map((path) => ({
      language,
      path,
      url: pageUrl(language, path),
      file: `${localizedPath(language, path).slice(1)}/index.html`,
    })),
  );
}
