/**
 * Last step of `npm run build`: writes one ready-made HTML file per page, so
 * that visitors see the page before the JavaScript has loaded, and search
 * engines and link previews (LinkedIn, …) read its title and description.
 *
 * It uses the server build (`dist-server/entry-server.js`) to render each page
 * into the page template made by Vite (`dist/index.html`), then writes
 * `404.html` and `sitemap.xml`. The server build is deleted at the end: it is
 * only a tool, it is not published.
 */
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/** What the server build provides, as declared in `src/entry-server.tsx`. */
interface ServerEntry {
  render(url: string): Promise<string>;
  prerenderedPages(): {
    readonly language: string;
    readonly url: string;
    readonly file: string;
  }[];
  sitemapXml(pages: ReturnType<ServerEntry["prerenderedPages"]>): string;
  splitHead(html: string): { readonly head: string; readonly body: string };
}

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = join(projectRoot, "dist");
const serverDir = join(projectRoot, "dist-server");

const ROOT_ELEMENT = '<div id="root"></div>';
const TEMPLATE_TITLE = /<title>[^<]*<\/title>/;
const TEMPLATE_LANG = /<html lang="[^"]*">/;

const template = await readFile(join(clientDir, "index.html"), "utf8");
for (const marker of [ROOT_ELEMENT, TEMPLATE_TITLE, TEMPLATE_LANG]) {
  if (!(typeof marker === "string" ? template.includes(marker) : marker.test(template))) {
    throw new Error(`dist/index.html no longer contains ${String(marker)}`);
  }
}

const server = (await import(
  pathToFileURL(join(serverDir, "entry-server.js")).href
)) as ServerEntry;

// The template, with an empty root element, serves the addresses that have no
// file of its own: the bare address (index.html) and every other one (404.html,
// which GitHub Pages answers with). The browser draws those pages itself,
// title included, so the template title is removed to avoid a second one.
const shell = template.replace(TEMPLATE_TITLE, "");
await writeFile(join(clientDir, "index.html"), shell);
await writeFile(join(clientDir, "404.html"), shell);

const pages = server.prerenderedPages();
for (const page of pages) {
  const { head, body } = server.splitHead(await server.render(page.url));
  const html = template
    .replace(TEMPLATE_LANG, `<html lang="${page.language}">`)
    .replace(TEMPLATE_TITLE, head)
    .replace(ROOT_ELEMENT, `<div id="root">${body}</div>`);
  const file = join(clientDir, page.file);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

await writeFile(join(clientDir, "sitemap.xml"), server.sitemapXml(pages));
await rm(serverDir, { recursive: true, force: true });
console.log(`Prerendered ${pages.length} pages, 404.html and sitemap.xml.`);
