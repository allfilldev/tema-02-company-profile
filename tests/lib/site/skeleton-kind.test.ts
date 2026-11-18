import { describe, expect, it } from "vitest";
import { SKELETON_KINDS, skeletonKindForPath } from "@/lib/site/skeleton-kind";

describe("skeletonKindForPath", () => {
  it.each([
    ["/", "home"],
    ["/tentang", "about"],
    ["/layanan", "services-index"],
    ["/layanan/konsultasi-strategi", "service-detail"],
    ["/portofolio", "portfolio-index"],
    ["/portofolio/transformasi-digital", "portfolio-detail"],
    ["/artikel", "articles-index"],
    ["/artikel/halaman/2", "articles-index"],
    ["/artikel/halaman/10", "articles-index"],
    ["/artikel/cara-menyusun-sop-umkm", "article-detail"],
    ["/kontak", "contact"],
    ["/privasi", "legal"],
    ["/syarat-ketentuan", "legal"],
    ["/kebijakan-editorial", "legal"],
  ] as const)("maps %s to %s", (path, kind) => {
    expect(skeletonKindForPath(path)).toBe(kind);
  });

  it.each([
    ["/layanan/", "services-index"],
    ["/tentang/", "about"],
    ["/artikel/halaman/2?x=1#a", "articles-index"],
    ["/artikel/halaman/2/", "articles-index"],
    ["/artikel?halaman=2", "articles-index"],
    ["/kontak#form", "contact"],
    ["/layanan/konsultasi-strategi/?utm=1", "service-detail"],
    ["/portofolio///", "portfolio-index"],
    ["?q=1", "home"],
    ["#top", "home"],
  ] as const)("ignores query, hash and trailing slash in %s", (path, kind) => {
    expect(skeletonKindForPath(path)).toBe(kind);
  });

  it.each([
    ["https://nusakarya.example/layanan/konsultasi-strategi?x=1#a", "service-detail"],
    ["http://localhost:3000/artikel/halaman/3", "articles-index"],
    ["https://nusakarya.example", "home"],
    ["https://nusakarya.example/kontak/", "contact"],
  ] as const)("reads only the pathname of the absolute url %s", (path, kind) => {
    expect(skeletonKindForPath(path)).toBe(kind);
  });

  it.each([
    "/tidak-ada",
    "/admin",
    "/layanan/a/b",
    "/portofolio/a/b",
    "/artikel/halaman",
    "/artikel/halaman/2/3",
    "/artikel/a/b",
    "/kontak/terima-kasih",
    "/privasi/lainnya",
    "/sitemap.xml",
    "/Tentang",
  ])("falls back to home for the unknown path %s", (path) => {
    expect(skeletonKindForPath(path)).toBe("home");
  });

  it.each(["", "/", "//", "///", "http://", "http:///tentang", "https://%", "/%E0%A4%A", "/layanan/日本語", "/日本語", "   ", "\u0000"])(
    "never throws on odd input %j",
    (path) => {
      expect(() => skeletonKindForPath(path)).not.toThrow();
      expect(SKELETON_KINDS).toContain(skeletonKindForPath(path));
    },
  );

  it("treats unicode slugs as detail pages of their section", () => {
    expect(skeletonKindForPath("/layanan/日本語")).toBe("service-detail");
    expect(skeletonKindForPath("/artikel/日本語")).toBe("article-detail");
  });

  it("lists every kind exactly once", () => {
    expect([...SKELETON_KINDS].sort()).toEqual(
      [
        "about",
        "article-detail",
        "articles-index",
        "contact",
        "home",
        "legal",
        "portfolio-detail",
        "portfolio-index",
        "service-detail",
        "services-index",
      ].sort(),
    );
  });
});
