import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { AUTHOR_NAME } from "../../data/author.ts";
import { useLocalizedPath } from "../../i18n/useLanguage.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";
import styles from "./NotFoundPage.module.css";

/** Page shown for an address that matches no page and no project. */
export function NotFoundPage() {
  const texts = useTranslations();
  const localize = useLocalizedPath();

  return (
    <main className={styles.page}>
      <title>{`${texts.notFound.title} — ${AUTHOR_NAME}`}</title>
      <div className={styles.card}>
        <h1 className={styles.title}>{texts.notFound.title}</h1>
        <p className={styles.message}>{texts.notFound.message}</p>
        <Link to={localize("/")} className={styles.home}>
          <ArrowLeft size={18} aria-hidden="true" />
          {texts.notFound.backHome}
        </Link>
      </div>
    </main>
  );
}
