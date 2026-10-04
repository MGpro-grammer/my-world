import { List } from "lucide-react";
import { useSearchParams } from "react-router";
import { AUTHOR_NAME } from "../../data/author.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";
import { BubbleField } from "../bubbles/BubbleField.tsx";
import { IntroOverlay } from "../intro/IntroOverlay.tsx";
import { useIntro } from "../intro/useIntro.ts";
import { ProjectList } from "../project-list/ProjectList.tsx";
import styles from "./HomePage.module.css";

/** Address parameter that selects the plain list (`?view=list`). */
const VIEW_PARAM = "view";

/** Value of {@link VIEW_PARAM} for the plain list. */
const LIST_VIEW = "list";

/**
 * Home page: the author's name and tagline, then the projects, as bubbles or
 * as a plain list. The chosen view is kept in the address, so it survives a
 * visit to a project page and the browser's back button.
 * On the first visit, a welcome screen covers it for a few seconds.
 */
export function HomePage() {
  const texts = useTranslations();
  const intro = useIntro();
  const [searchParams, setSearchParams] = useSearchParams();
  const showList = searchParams.get(VIEW_PARAM) === LIST_VIEW;

  const toggleView = () => {
    setSearchParams(showList ? {} : { [VIEW_PARAM]: LIST_VIEW }, { replace: true });
  };

  return (
    <main className={styles.page}>
      <title>{`${AUTHOR_NAME} — Portfolio`}</title>
      <header className={styles.header}>
        <h1 className={styles.name}>{AUTHOR_NAME}</h1>
        <p className={styles.tagline}>{texts.home.tagline}</p>
      </header>
      {showList ? <ProjectList /> : <BubbleField />}
      <button
        type="button"
        className={styles.viewToggle}
        aria-pressed={showList}
        onClick={toggleView}
      >
        <List size={18} aria-hidden="true" />
        {texts.home.listView}
      </button>
      {intro.status !== "ready" && <IntroOverlay status={intro.status} onSkip={intro.skip} />}
    </main>
  );
}
