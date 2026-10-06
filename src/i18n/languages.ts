import { en } from "./en.ts";
import { fr } from "./fr.ts";
import type { Translations } from "./Translations.ts";

/** Languages of the site, as ISO 639-1 codes; also the first part of every address. */
export type Language = "fr" | "en";

/**
 * Texts of each language.
 *
 * Adding a language means adding its code to {@link Language}, its file
 * (e.g. `nl.ts`) and one entry here: a language without texts, or with a
 * missing text, is a compile error.
 */
export const TRANSLATIONS: Readonly<Record<Language, Translations>> = { fr, en };
