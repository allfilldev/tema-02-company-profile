import { describe, expect, it } from "vitest";
import { buildMetadata, type PageSeoInput, type SeoSite } from "@/lib/seo/metadata";

const site: SeoSite = {
  siteName: "Nusa Karya",
  siteUrl: "https://nusakarya.id",
  indexingEnabled: true,
  defaultOgImagePath: "/demo/nusa-karya/og-default.webp",
  defaultOgImageAlt: "Tim Nusa Karya sedang berdiskusi di kantor",
};

const pageInput: PageSeoInput = {
  path: "/layanan",
  title: "Layanan",
  description: "Daftar layanan Nusa Karya untuk bisnis Anda.",
  ogImagePath: "/demo/nusa-karya/service-branding.webp",
  ogImageAlt: "Contoh layanan branding",
  type: "website",
};

describe("buildMetadata", () => {
  it("builds the absolute title with the site name suffix", () => {
    const metadata = buildMetadata(pageInput, site);
    expect(metadata.title).toEqual({ absolute: "Layanan | Nusa Karya" });
    expect(metadata.description).toBe(pageInput.description);
  });

  it("builds an absolute canonical url", () => {
    expect(buildMetadata(pageInput, site).alternates?.canonical).toBe("https://nusakarya.id/layanan");
  });

  it("keeps the root canonical with a trailing slash", () => {
    expect(buildMetadata({ ...pageInput, path: "/" }, site).alternates?.canonical).toBe("https://nusakarya.id/");
  });

  it("blocks indexing for every input when indexing is disabled", () => {
    const closedSite = { ...site, indexingEnabled: false };
    expect(buildMetadata(pageInput, closedSite).robots).toEqual({ index: false, follow: false });
    expect(buildMetadata({ ...pageInput, forceNoIndex: false }, closedSite).robots).toEqual({
      index: false,
      follow: false,
    });
    expect(buildMetadata({ ...pageInput, type: "article" }, closedSite).robots).toEqual({
      index: false,
      follow: false,
    });
  });

  it("allows indexing when enabled", () => {
    expect(buildMetadata(pageInput, site).robots).toEqual({ index: true, follow: true });
  });

  it("lets forceNoIndex override enabled indexing", () => {
    expect(buildMetadata({ ...pageInput, forceNoIndex: true }, site).robots).toEqual({
      index: false,
      follow: false,
    });
  });

  it("fills the open graph block", () => {
    const openGraph = buildMetadata(pageInput, site).openGraph;
    expect(openGraph).toMatchObject({
      title: "Layanan | Nusa Karya",
      description: pageInput.description,
      url: "https://nusakarya.id/layanan",
      siteName: "Nusa Karya",
      locale: "id_ID",
      type: "website",
    });
    expect(openGraph?.images).toEqual([
      {
        url: "https://nusakarya.id/demo/nusa-karya/service-branding.webp",
        width: 1200,
        height: 630,
        alt: "Contoh layanan branding",
      },
    ]);
  });

  it("falls back to the default image when ogImagePath is null", () => {
    const metadata = buildMetadata({ ...pageInput, ogImagePath: null, ogImageAlt: null }, site);
    expect(metadata.openGraph?.images).toEqual([
      {
        url: "https://nusakarya.id/demo/nusa-karya/og-default.webp",
        width: 1200,
        height: 630,
        alt: "Tim Nusa Karya sedang berdiskusi di kantor",
      },
    ]);
    expect(metadata.twitter?.images).toEqual(["https://nusakarya.id/demo/nusa-karya/og-default.webp"]);
  });

  it("builds the twitter card", () => {
    expect(buildMetadata(pageInput, site).twitter).toMatchObject({
      card: "summary_large_image",
      title: "Layanan | Nusa Karya",
      description: pageInput.description,
      images: ["https://nusakarya.id/demo/nusa-karya/service-branding.webp"],
    });
  });

  it("adds article fields for article pages", () => {
    const openGraph = buildMetadata(
      {
        ...pageInput,
        path: "/artikel/cara-memilih-jasa-pembuatan-website",
        type: "article",
        publishedTime: "2026-11-05T08:00:00.000Z",
        modifiedTime: "2026-11-10T08:00:00.000Z",
        authorNames: ["Rina Wulandari"],
      },
      site,
    ).openGraph;
    expect(openGraph).toMatchObject({
      type: "article",
      publishedTime: "2026-11-05T08:00:00.000Z",
      modifiedTime: "2026-11-10T08:00:00.000Z",
      authors: ["Rina Wulandari"],
    });
  });

  it("does not add article fields to website pages", () => {
    const openGraph = buildMetadata(pageInput, site).openGraph as Record<string, unknown>;
    expect(openGraph).not.toHaveProperty("publishedTime");
    expect(openGraph).not.toHaveProperty("authors");
  });
});
