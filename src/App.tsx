import { useEffect } from "react";
import { Outlet } from "react-router";
import { WaveBackground } from "./components/WaveBackground/WaveBackground.tsx";
import { LanguageSwitch } from "./features/language/LanguageSwitch.tsx";
import { useLanguage } from "./i18n/useLanguage.ts";

/**
 * Layout shared by every page: the wave background, with the current page
 * drawn on top of it. The background is never unmounted when the page
 * changes, so the waves keep running. The language switch sits above every
 * page, and the `lang` attribute of the document follows the language of the
 * page.
 */
function App() {
  const language = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <>
      <WaveBackground />
      <LanguageSwitch />
      <Outlet />
    </>
  );
}

export default App;
