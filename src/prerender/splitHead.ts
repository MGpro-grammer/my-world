/** Rendered page, cut in two: what goes in `<head>`, and the page itself. */
export interface SplitPage {
  /** The `<title>`, `<meta>` and `<link>` tags of the page. */
  readonly head: string;
  /** The rest of the HTML, which goes in the root element. */
  readonly body: string;
}

/**
 * Leading `<title>…</title>`, `<meta …>` and `<link …>` tags. React writes the
 * tags that belong in `<head>` before the rest of the page.
 */
const LEADING_HEAD_TAGS = /^(?:<title>[^<]*<\/title>|<meta\b[^>]*>|<link\b[^>]*>)+/;

/**
 * Separates the tags React wrote for `<head>` from the page.
 * @param html - Output of the server rendering of one page.
 * @returns Its head tags and its body; `head` is empty if there are none.
 */
export function splitHead(html: string): SplitPage {
  const head = LEADING_HEAD_TAGS.exec(html)?.[0] ?? "";
  return { head, body: html.slice(head.length) };
}
