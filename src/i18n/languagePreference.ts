import { isLanguage, type Language } from "./languages.ts";

/** Key under which the visitor's last language choice is kept in the browser. */
const STORAGE_KEY = "my-world:language";

/** Language for visitors whose browser languages match none of the site's. */
const UNMATCHED_LANGUAGE: Language = "en";

/**
 * Chooses a language for a visitor who arrives without one in the address.
 * Pure function: the browser is read by {@link preferredLanguage}.
 * @param savedLanguage - Language the visitor chose on an earlier visit, if any.
 * @param browserLanguages - Languages of the browser, by order of preference
 *   (e.g. `["nl-BE", "fr", "en"]`).
 * @returns The saved choice, else the first browser language the site has,
 *   else English.
 */
export function pickLanguage(
  savedLanguage: string | null,
  browserLanguages: readonly string[],
): Language {
  if (isLanguage(savedLanguage)) {
    return savedLanguage;
  }
  for (const tag of browserLanguages) {
    const code = tag.toLowerCase().split("-")[0];
    if (isLanguage(code)) {
      return code;
    }
  }
  return UNMATCHED_LANGUAGE;
}

/**
 * Language the visitor most likely wants, from their last choice and their
 * browser settings.
 * @returns One of the site's languages.
 */
export function preferredLanguage(): Language {
  const browserLanguages =
    navigator.languages.length > 0 ? navigator.languages : [navigator.language];
  return pickLanguage(readSavedLanguage(), browserLanguages);
}

/**
 * Remembers the language the visitor chose, for their next visit to the bare
 * address. Does nothing if the browser blocks storage.
 * @param language - Language chosen.
 */
export function saveLanguage(language: Language): void {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Storage blocked: the choice is simply not remembered.
  }
}

/**
 * Reads the last language choice, if the browser allows storage.
 * @returns The saved value, or `null` if none or if storage is blocked.
 */
function readSavedLanguage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
