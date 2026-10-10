import { describe, expect, it } from "vitest";
import { prerenderedPages } from "./pages.ts";
import { sitemapXml } from "./sitemap.ts";

describe("sitemapXml", () => {
  const xml = sitemapXml(prerenderedPages());

  it("lists every prerendered page once", () => {
    expect(xml.match(/<loc>/g)).toHaveLength(prerenderedPages().length);
  });

  it("gives each page its address in every language", () => {
    expect(xml).toContain(
      [
        "    <loc>https://www.georges-mouratidis.be/fr/contact/</loc>",
        '    <xhtml:link rel="alternate" hreflang="fr" href="https://www.georges-mouratidis.be/fr/contact/"/>',
        '    <xhtml:link rel="alternate" hreflang="en" href="https://www.georges-mouratidis.be/en/contact/"/>',
      ].join("\n"),
    );
  });
});
