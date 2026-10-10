import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";
import { routes } from "./routes.ts";

export { prerenderedPages } from "./prerender/pages.ts";
export { sitemapXml } from "./prerender/sitemap.ts";
export { splitHead } from "./prerender/splitHead.ts";

/**
 * Renders one page of the site to HTML, as the browser would draw it on the
 * first visit. Used once per page when the site is built (`scripts/prerender.ts`).
 * @param url - Full address of the page.
 * @returns Its HTML: first the tags of `<head>`, then the page.
 * @throws {Error} If the address leads to a redirection instead of a page.
 */
export async function render(url: string): Promise<string> {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(url));
  if (context instanceof Response) {
    throw new Error(`${url} redirects instead of showing a page`);
  }
  const router = createStaticRouter(handler.dataRoutes, context);
  return renderToString(
    <StrictMode>
      {/* No hydration data: the pages load nothing, the browser rebuilds the same state. */}
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </StrictMode>,
  );
}
