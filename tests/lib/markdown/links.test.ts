import { describe, expect, it } from "vitest";
import { countLinks } from "@/lib/markdown/links";

describe("countLinks", () => {
  it("separates internal and external links and ignores images and other hrefs", () => {
    const markdown =
      "[a](/layanan/x) [b](https://bps.go.id) [c](/artikel/y) ![i](/demo/a.webp) [d](mailto:x@y.id) [e](#faq)";
    expect(countLinks(markdown)).toEqual({ internal: 2, external: 1 });
  });

  it("counts http links as external", () => {
    expect(countLinks("[a](http://contoh.id)")).toEqual({ internal: 0, external: 1 });
  });

  it("returns zeros for empty markdown", () => {
    expect(countLinks("")).toEqual({ internal: 0, external: 0 });
  });
});
