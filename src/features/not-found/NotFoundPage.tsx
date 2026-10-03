import { Link } from "react-router";
import { AUTHOR_NAME } from "../../data/author.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";

/** Page shown for an address that matches no page and no project. */
export function NotFoundPage() {
  const texts = useTranslations();

  return (
    <main>
      <title>{`${texts.notFound.title} — ${AUTHOR_NAME}`}</title>
      <h1>{texts.notFound.title}</h1>
      <p>{texts.notFound.message}</p>
      <Link to="/">{texts.notFound.backHome}</Link>
    </main>
  );
}
