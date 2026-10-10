import { SITE_URL } from "../../data/site.ts";
import { localizedPath } from "../../i18n/languagePaths.ts";
import type { Language } from "../../i18n/languages.ts";

/**
 * Builds the full, official address of a page in a language.
 *
 * It ends with a slash because each page is published as a folder
 * (`fr/contact/index.html`): GitHub Pages answers `…/contact/` directly and
 * redirects `…/contact` to it, so the official address must be the first one.
 * @param language - Language of the page.
 * @param path - Path of the page without language, starting with `/`
 *   (e.g. `"/"` or `"/projects/wordeul"`).
 * @returns E.g. `"https://www.georges-mouratidis.be/en/projects/wordeul/"`.
 */
export function pageUrl(language: Language, path: string): string {
  return `${SITE_URL}${localizedPath(language, path)}/`;
}

/** Full address of the bare site, which sends each visitor to their language. */
export const LANGUAGE_CHOICE_URL = `${SITE_URL}/`;
