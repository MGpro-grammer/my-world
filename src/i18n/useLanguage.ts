import { useLocation } from "react-router";
import { languageOfPath, localizedPath } from "./languagePaths.ts";
import { preferredLanguage } from "./languagePreference.ts";
import type { Language } from "./languages.ts";

/**
 * Returns the language of the current page.
 *
 * The address is the only source of truth: `/en/…` is English, `/fr/…` is
 * French. An address without a language (the root, or an unknown page) uses
 * the visitor's preferred language.
 * @returns The current language.
 */
export function useLanguage(): Language {
  const { pathname } = useLocation();
  return languageOfPath(pathname) ?? preferredLanguage();
}

/**
 * Returns a function that turns a path without language into the address of
 * that page in the current language, so that internal links never leave it.
 * @returns E.g. `"/projects/wordeul"` → `"/en/projects/wordeul"` on an English page.
 */
export function useLocalizedPath(): (path: string) => string {
  const language = useLanguage();
  return (path) => localizedPath(language, path);
}
