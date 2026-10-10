import { pageUrl } from "../components/PageHead/pageUrl.ts";
import { LANGUAGES } from "../i18n/languages.ts";
import type { PrerenderedPage } from "./pages.ts";

/**
 * Writes the sitemap of the site: the list of its pages for search engines,
 * each one with the address of the same page in every language.
 * @param pages - Pages to list.
 * @returns The content of `sitemap.xml`.
 */
export function sitemapXml(pages: readonly PrerenderedPage[]): string {
  const entries = pages.map((page) => {
    const alternates = LANGUAGES.map(
      (language) =>
        `    <xhtml:link rel="alternate" hreflang="${language}" href="${pageUrl(language, page.path)}"/>`,
    );
    return ["  <url>", `    <loc>${page.url}</loc>`, ...alternates, "  </url>"].join("\n");
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");
}
