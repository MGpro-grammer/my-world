import { Navigate } from "react-router";
import { localizedPath } from "../../i18n/languagePaths.ts";
import { preferredLanguage } from "../../i18n/languagePreference.ts";

/**
 * Page of the bare address (`/`): sends the visitor to the home page in their
 * preferred language, without adding a step to the browser history.
 */
export function LanguageRedirect() {
  return <Navigate to={localizedPath(preferredLanguage(), "/")} replace />;
}
