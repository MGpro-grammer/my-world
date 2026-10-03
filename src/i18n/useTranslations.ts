import { fr } from "./fr.ts";
import type { Translations } from "./Translations.ts";

/**
 * Returns every text of the site in the visitor's language.
 *
 * Components only get their texts through this hook. Until language
 * switching arrives (Phase 7), it always returns French; then only this
 * hook will change, not the components that call it.
 */
export function useTranslations(): Translations {
  return fr;
}
