import { en } from "./en.ts";
import { fr } from "./fr.ts";
import type { Translations } from "./Translations.ts";

/**
 * Languages of the site, as ISO 639-1 codes, in the order of the language
 * switch. Each one is also the first part of the addresses in that language
 * (`/fr/…`, `/en/…`).
 */
export const LANGUAGES = ["fr", "en"] as const;

/** One of the site's languages. */
export type Language = (typeof LANGUAGES)[number];

/**
 * Texts of each language.
 *
 * Adding a language means adding its code to {@link LANGUAGES}, its file
 * (e.g. `nl.ts`) and one entry here: a language without texts, or with a
 * missing text, is a compile error.
 */
export const TRANSLATIONS: Readonly<Record<Language, Translations>> = { fr, en };

/**
 * Name of each language, written in that language, so that every visitor
 * recognizes their own whatever the language of the page.
 */
export const LANGUAGE_NAMES: Readonly<Record<Language, string>> = {
  fr: "Français",
  en: "English",
};

/**
 * Open Graph locale of each language (language and country), given to the
 * social networks that show a preview of a shared link.
 */
export const OPEN_GRAPH_LOCALES: Readonly<Record<Language, string>> = {
  fr: "fr_BE",
  en: "en_US",
};

/**
 * Tells whether a piece of text is one of the site's language codes.
 * @param value - Text to check, e.g. the first part of an address.
 * @returns `true`, with `value` narrowed to {@link Language}, if it is one.
 */
export function isLanguage(value: string | null | undefined): value is Language {
  return LANGUAGES.some((language) => language === value);
}
