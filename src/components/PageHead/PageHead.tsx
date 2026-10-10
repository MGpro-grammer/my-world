import { AUTHOR_NAME } from "../../data/author.ts";
import { SITE_URL, SOCIAL_IMAGE } from "../../data/site.ts";
import { LANGUAGES, OPEN_GRAPH_LOCALES } from "../../i18n/languages.ts";
import { useLanguage } from "../../i18n/useLanguage.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";
import { LANGUAGE_CHOICE_URL, pageUrl } from "./pageUrl.ts";

/** What a page tells the browser, search engines and social networks about itself. */
interface PageHeadProps {
  /** Text of the browser tab, also the title of a shared link. */
  readonly title: string;
  /** Summary shown under the title in search results and shared links. */
  readonly description?: string;
  /**
   * Path of the page without language (e.g. `"/contact"`). Without it, the
   * page asks search engines not to list it: used for "page not found".
   */
  readonly path?: string;
}

/**
 * Head of a page: title, description, official address, the same page in
 * every language, and the preview shown when its link is shared.
 *
 * React places these tags in the `<head>` of the document, and removes them
 * when the page changes. This component is the only place that writes them,
 * so every page follows the same rules.
 */
export function PageHead({ title, description, path }: PageHeadProps) {
  const language = useLanguage();
  const texts = useTranslations();

  if (path === undefined) {
    return (
      <>
        <title>{title}</title>
        <meta name="robots" content="noindex" />
      </>
    );
  }

  const url = pageUrl(language, path);
  return (
    <>
      <title>{title}</title>
      {description !== undefined && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      {LANGUAGES.map((other) => (
        <link key={other} rel="alternate" hrefLang={other} href={pageUrl(other, path)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={LANGUAGE_CHOICE_URL} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={AUTHOR_NAME} />
      <meta property="og:title" content={title} />
      {description !== undefined && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={OPEN_GRAPH_LOCALES[language]} />
      <meta property="og:image" content={`${SITE_URL}${SOCIAL_IMAGE.path}`} />
      <meta property="og:image:width" content={String(SOCIAL_IMAGE.width)} />
      <meta property="og:image:height" content={String(SOCIAL_IMAGE.height)} />
      <meta property="og:image:alt" content={texts.common.socialImageDescription} />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
