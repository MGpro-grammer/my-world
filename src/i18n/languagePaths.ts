import { isLanguage, type Language } from "./languages.ts";

/**
 * Reads the language at the start of an address.
 * @param pathname - Path of the address, e.g. `"/en/projects/wordeul"`.
 * @returns Its language (`"en"`), or `undefined` if it does not start with one.
 */
export function languageOfPath(pathname: string): Language | undefined {
  const firstSegment = pathname.split("/")[1];
  return isLanguage(firstSegment) ? firstSegment : undefined;
}

/**
 * Builds the address of the same page in another language.
 * @param pathname - Path of the current page, e.g. `"/fr/projects/wordeul"`.
 * @param language - Language wanted.
 * @returns E.g. `"/en/projects/wordeul"`; the home page of that language if
 *   the current path has no language.
 */
export function pathInLanguage(pathname: string, language: Language): string {
  const currentLanguage = languageOfPath(pathname);
  if (currentLanguage === undefined) {
    return localizedPath(language, "/");
  }
  return `/${language}${pathname.slice(currentLanguage.length + 1)}`;
}

/**
 * Builds the address of a page in a language.
 * @param language - Language of the page.
 * @param path - Path of the page without language, starting with `/`
 *   (e.g. `"/"` or `"/projects/wordeul"`).
 * @returns The full path, e.g. `"/en"` or `"/en/projects/wordeul"`.
 */
export function localizedPath(language: Language, path: string): string {
  return path === "/" ? `/${language}` : `/${language}${path}`;
}
