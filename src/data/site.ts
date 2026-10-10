/**
 * Address of the published site, without a trailing slash. Used to build
 * the full addresses that search engines and social networks need.
 */
export const SITE_URL = "https://www.georges-mouratidis.be";

/**
 * Picture shown when a link to the site is shared (LinkedIn, messaging apps),
 * served from `public/`. 1200 × 630 is the size these sites expect.
 */
export const SOCIAL_IMAGE = {
  path: "/social-preview.png",
  width: 1200,
  height: 630,
} as const;
