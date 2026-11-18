import { describe, expect, it } from "vitest";
import { absoluteAssetUrl, absoluteUrl, resolveIndexing, resolveSiteUrl } from "@/lib/seo/site-url";

describe("resolveSiteUrl", () => {
  it("defaults to localhost when the value is missing", () => {
    expect(resolveSiteUrl(undefined)).toBe("http://localhost:3000");
  });

  it("removes the trailing slash", () => {
    expect(resolveSiteUrl("https://arunika.id/")).toBe("https://arunika.id");
  });

  it("keeps a clean url unchanged", () => {
    expect(resolveSiteUrl("https://arunika.id")).toBe("https://arunika.id");
  });

  it("throws for a non http url", () => {
    expect(() => resolveSiteUrl("ftp://x")).toThrow();
  });

  it("throws for a value that is not a url", () => {
    expect(() => resolveSiteUrl("bukan url")).toThrow();
  });
});

describe("resolveIndexing", () => {
  it("is true only for the exact string on", () => {
    expect(resolveIndexing("on")).toBe(true);
  });

  it.each(["ON", "off", "", undefined, "true"])("is false for %s", (value) => {
    expect(resolveIndexing(value)).toBe(false);
  });
});

describe("absoluteUrl", () => {
  it("keeps the root path with a slash", () => {
    expect(absoluteUrl("https://a.id", "/")).toBe("https://a.id/");
  });

  it("joins a path", () => {
    expect(absoluteUrl("https://a.id", "/layanan")).toBe("https://a.id/layanan");
  });

  it("removes the trailing slash from a path", () => {
    expect(absoluteUrl("https://a.id", "/layanan/")).toBe("https://a.id/layanan");
  });

  it("throws when the path does not start with a slash", () => {
    expect(() => absoluteUrl("https://a.id", "layanan")).toThrow();
  });
});

describe("absoluteAssetUrl", () => {
  it("prefixes a relative asset path", () => {
    expect(absoluteAssetUrl("https://a.id", "/demo/logo.webp")).toBe("https://a.id/demo/logo.webp");
  });

  it("keeps an absolute asset url", () => {
    expect(absoluteAssetUrl("https://a.id", "https://cdn.example.com/logo.webp")).toBe(
      "https://cdn.example.com/logo.webp",
    );
  });
});
