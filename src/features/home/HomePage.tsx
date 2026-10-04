import { AUTHOR_NAME } from "../../data/author.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";
import { BubbleField } from "../bubbles/BubbleField.tsx";
import styles from "./HomePage.module.css";

/** Home page: the author's name and tagline, then one bubble per project. */
export function HomePage() {
  const texts = useTranslations();

  return (
    <main className={styles.page}>
      <title>{`${AUTHOR_NAME} — Portfolio`}</title>
      <header className={styles.header}>
        <h1 className={styles.name}>{AUTHOR_NAME}</h1>
        <p className={styles.tagline}>{texts.home.tagline}</p>
      </header>
      <BubbleField />
    </main>
  );
}
