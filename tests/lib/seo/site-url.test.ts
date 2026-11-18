import { describe, expect, it } from "vitest";
import {
  absoluteAssetUrl,
  absoluteUrl,
  resolveIndexing,
  resolveSiteUrl,
  shouldRequireExplicitSiteUrl,
} from "@/lib/seo/site-url";

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

describe("resolveSiteUrl with a path, query, or hash", () => {
  it.each(["https://a.id/blog", "https://a.id/blog/", "https://a.id?utm=1", "https://a.id/?utm=1", "https://a.id#top", "https://a.id/#top"])(
    "throws for %s",
    (value) => {
      expect(() => resolveSiteUrl(value)).toThrow("path, query, atau hash");
    },
  );

  it("accepts a url with a port and a bare trailing slash", () => {
    expect(resolveSiteUrl("https://a.id:8443/")).toBe("https://a.id:8443");
  });
});

describe("resolveSiteUrl when an explicit url is required", () => {
  const required = { requireExplicit: true };

  it.each([undefined, "", "   "])("throws when the value is %j", (value) => {
    expect(() => resolveSiteUrl(value, required)).toThrow("SITE_URL wajib diisi");
  });

  it.each([
    "http://localhost:3000",
    "https://localhost",
    "http://127.0.0.1:3000",
    "http://[::1]:3000",
    "https://app.localhost",
    "https://a.b.localhost:3000",
  ])("throws for the local url %s", (value) => {
    expect(() => resolveSiteUrl(value, required)).toThrow("localhost");
  });

  it("accepts a real domain", () => {
    expect(resolveSiteUrl("https://arunika.id/", required)).toBe("https://arunika.id");
  });

  it("accepts a domain that only contains the word localhost", () => {
    expect(resolveSiteUrl("https://localhost.example.com", required)).toBe("https://localhost.example.com");
    expect(resolveSiteUrl("https://notlocalhost.id", required)).toBe("https://notlocalhost.id");
  });

  it("still rejects a path or a non http protocol", () => {
    expect(() => resolveSiteUrl("https://arunika.id/blog", required)).toThrow();
    expect(() => resolveSiteUrl("ftp://arunika.id", required)).toThrow();
  });
});

describe("resolveSiteUrl when an explicit url is not required", () => {
  it.each([undefined, ""])("falls back to localhost for %j", (value) => {
    expect(resolveSiteUrl(value, { requireExplicit: false })).toBe("http://localhost:3000");
  });

  it("accepts a localhost url", () => {
    expect(resolveSiteUrl("http://localhost:4000", { requireExplicit: false })).toBe("http://localhost:4000");
  });
});

describe("shouldRequireExplicitSiteUrl", () => {
  it("is true only for production with indexing on", () => {
    expect(shouldRequireExplicitSiteUrl("production", true)).toBe(true);
  });

  it.each([
    ["production", false],
    ["development", true],
    ["test", true],
    [undefined, true],
  ])("is false for %s with indexing %s", (nodeEnv, indexingEnabled) => {
    expect(shouldRequireExplicitSiteUrl(nodeEnv, indexingEnabled)).toBe(false);
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
