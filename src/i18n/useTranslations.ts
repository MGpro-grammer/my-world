import { TRANSLATIONS } from "./languages.ts";
import type { Translations } from "./Translations.ts";
import { useLanguage } from "./useLanguage.ts";

/**
 * Returns every text of the site in the language of the current page.
 *
 * Components only get their texts through this hook, so none of them
 * depends on a particular language.
 * @returns The texts of the current language.
 */
export function useTranslations(): Translations {
  return TRANSLATIONS[useLanguage()];
}
