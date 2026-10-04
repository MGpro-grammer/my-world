import { AUTHOR_NAME } from "../../data/author.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";
import { BubbleField } from "../bubbles/BubbleField.tsx";
import { IntroOverlay } from "../intro/IntroOverlay.tsx";
import { useIntro } from "../intro/useIntro.ts";
import styles from "./HomePage.module.css";

/**
 * Home page: the author's name and tagline, then one bubble per project.
 * On the first visit, a welcome screen covers it for a few seconds.
 */
export function HomePage() {
  const texts = useTranslations();
  const intro = useIntro();

  return (
    <main className={styles.page}>
      <title>{`${AUTHOR_NAME} — Portfolio`}</title>
      <header className={styles.header}>
        <h1 className={styles.name}>{AUTHOR_NAME}</h1>
        <p className={styles.tagline}>{texts.home.tagline}</p>
      </header>
      <BubbleField />
      {intro.status !== "ready" && <IntroOverlay status={intro.status} onSkip={intro.skip} />}
    </main>
  );
}
