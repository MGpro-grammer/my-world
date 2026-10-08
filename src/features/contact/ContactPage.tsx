import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { AUTHOR_NAME } from "../../data/author.ts";
import { useLocalizedPath } from "../../i18n/useLanguage.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";
import styles from "./ContactPage.module.css";

/** Contact page: the ways to reach the author, around the page title. */
export function ContactPage() {
  const texts = useTranslations();
  const localize = useLocalizedPath();

  return (
    <main className={styles.page}>
      <title>{`${texts.contact.title} — ${AUTHOR_NAME}`}</title>
      <Link to={localize("/")} className={styles.back}>
        <ArrowLeft size={18} aria-hidden="true" />
        {texts.contact.back}
      </Link>
      <div className={styles.center}>
        <h1 className={styles.title}>{texts.contact.title}</h1>
        <p className={styles.intro}>{texts.contact.intro}</p>
      </div>
    </main>
  );
}
