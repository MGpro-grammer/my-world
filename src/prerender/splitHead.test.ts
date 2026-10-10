import { describe, expect, it } from "vitest";
import { splitHead } from "./splitHead.ts";

describe("splitHead", () => {
  it("moves the leading title, meta and link tags to the head", () => {
    const html =
      '<title>Contact</title><meta name="description" content="a &gt; b"/>' +
      '<link rel="canonical" href="https://example.com/"/><main><p>Hi</p></main>';
    expect(splitHead(html)).toEqual({
      head:
        '<title>Contact</title><meta name="description" content="a &gt; b"/>' +
        '<link rel="canonical" href="https://example.com/"/>',
      body: "<main><p>Hi</p></main>",
    });
  });

  it("leaves the tags that come after the page content in the body", () => {
    expect(splitHead('<main></main><link rel="x"/>')).toEqual({
      head: "",
      body: '<main></main><link rel="x"/>',
    });
  });
});
