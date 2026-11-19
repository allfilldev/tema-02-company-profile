import { describe, expect, it } from "vitest";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildOrganizationJsonLd,
  buildPersonJsonLd,
  buildPortfolioJsonLd,
  buildServiceJsonLd,
  buildWebSiteJsonLd,
  serializeJsonLd,
} from "@/lib/seo/json-ld";
import { buildTestPack } from "../../fixtures/content-pack";

const siteUrl = "https://nusakarya.id";

describe("buildOrganizationJsonLd", () => {
  it("builds the organization with contact point and publishing principles", () => {
    const { settings } = buildTestPack();
    const data = buildOrganizationJsonLd(settings, siteUrl);
    expect(data).toMatchObject({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Nusa Karya",
      url: "https://nusakarya.id/",
      logo: "https://nusakarya.id/demo/nusa-karya/logo.webp",
      foundingDate: "2015",
      publishingPrinciples: "https://nusakarya.id/kebijakan-editorial",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+62 21 5550 1234",
        email: "halo@nusakarya.example.com",
        contactType: "customer service",
        availableLanguage: "id",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Merdeka No. 10",
        addressLocality: "Bandung",
        addressRegion: "Jawa Barat",
        postalCode: "40111",
        addressCountry: "Indonesia",
      },
      sameAs: ["https://www.instagram.com/nusakarya", "https://www.linkedin.com/company/nusakarya"],
    });
  });

  it("omits sameAs when there are no social links", () => {
    const { settings } = buildTestPack();
    const data = buildOrganizationJsonLd({ ...settings, socialLinks: [] }, siteUrl);
    expect(data).not.toHaveProperty("sameAs");
  });

  it("omits postalCode when the stored value is a lone dash", () => {
    const { settings } = buildTestPack();
    const data = buildOrganizationJsonLd({ ...settings, address: { ...settings.address, postalCode: "-" } }, siteUrl);
    expect(data.address).not.toHaveProperty("postalCode");
  });

  it("omits foundingDate when the founded year is missing", () => {
    const { settings } = buildTestPack();
    const data = buildOrganizationJsonLd({ ...settings, foundedYear: null }, siteUrl);
    expect(data).not.toHaveProperty("foundingDate");
  });

  it("omits the logo key when the logo is missing", () => {
    const { settings } = buildTestPack();
    const data = buildOrganizationJsonLd({ ...settings, logo: null }, siteUrl);
    expect(data).not.toHaveProperty("logo");
  });

  it("uses the organization type from the settings", () => {
    const { settings } = buildTestPack();
    expect(buildOrganizationJsonLd({ ...settings, schemaType: "Organization" }, siteUrl)["@type"]).toBe(
      "Organization",
    );
  });
});

describe("buildWebSiteJsonLd", () => {
  it("builds the website without a search action", () => {
    const { settings } = buildTestPack();
    const data = buildWebSiteJsonLd(settings, siteUrl);
    expect(data).toMatchObject({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Nusa Karya",
      url: "https://nusakarya.id/",
      inLanguage: "id-ID",
    });
    expect(data).not.toHaveProperty("potentialAction");
  });
});

describe("buildBreadcrumbJsonLd", () => {
  it("numbers items from 1 and uses absolute urls", () => {
    const data = buildBreadcrumbJsonLd(
      [
        { name: "Beranda", path: "/" },
        { name: "Artikel", path: "/artikel" },
        { name: "Cara memilih jasa", path: "/artikel/cara-memilih-jasa-pembuatan-website" },
      ],
      siteUrl,
    );
    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Beranda", item: "https://nusakarya.id/" },
      { "@type": "ListItem", position: 2, name: "Artikel", item: "https://nusakarya.id/artikel" },
      {
        "@type": "ListItem",
        position: 3,
        name: "Cara memilih jasa",
        item: "https://nusakarya.id/artikel/cara-memilih-jasa-pembuatan-website",
      },
    ]);
  });
});

describe("buildServiceJsonLd", () => {
  it("builds the service with provider and image", () => {
    const pack = buildTestPack();
    const service = pack.services[0];
    const data = buildServiceJsonLd(service, pack.settings, siteUrl);
    expect(data).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      description: service.summary,
      url: `https://nusakarya.id/layanan/${service.slug}`,
      provider: { "@type": "LocalBusiness", name: "Nusa Karya", url: "https://nusakarya.id/" },
    });
    expect(data.image).toMatch(/^https:\/\/nusakarya\.id\//);
  });

  it("omits the image when the service has no cover", () => {
    const pack = buildTestPack();
    const data = buildServiceJsonLd({ ...pack.services[0], cover: null }, pack.settings, siteUrl);
    expect(data).not.toHaveProperty("image");
  });
});

describe("buildPortfolioJsonLd", () => {
  it("builds the creative work with the completion date", () => {
    const pack = buildTestPack();
    const item = { ...pack.portfolio[0], completedOn: "2026-03-15" };
    const data = buildPortfolioJsonLd(item, pack.settings, siteUrl);
    expect(data).toMatchObject({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: item.title,
      description: item.summary,
      dateCreated: "2026-03-15",
      url: `https://nusakarya.id/portofolio/${item.slug}`,
      creator: { "@type": "LocalBusiness", name: "Nusa Karya" },
    });
  });

  it("omits dateCreated and image when they are missing", () => {
    const pack = buildTestPack();
    const item = { ...pack.portfolio[0], completedOn: null, cover: null };
    const data = buildPortfolioJsonLd(item, pack.settings, siteUrl);
    expect(data).not.toHaveProperty("dateCreated");
    expect(data).not.toHaveProperty("image");
  });
});

describe("buildArticleJsonLd", () => {
  it("builds the blog posting with author, dates, and publisher logo", () => {
    const pack = buildTestPack();
    const article = pack.articles[0];
    const author = pack.team.find((member) => member.id === article.authorId)!;
    const data = buildArticleJsonLd({ ...article, author }, pack.settings, siteUrl);
    expect(data).toMatchObject({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.title,
      description: article.metaDescription,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      mainEntityOfPage: `https://nusakarya.id/artikel/${article.slug}`,
      author: {
        "@type": "Person",
        name: "Rina Wulandari",
        jobTitle: "Direktur Kreatif",
        url: "https://nusakarya.id/tentang",
        worksFor: { "@type": "LocalBusiness", name: "Nusa Karya" },
        sameAs: ["https://www.linkedin.com/in/rina-wulandari"],
      },
      publisher: {
        "@type": "LocalBusiness",
        name: "Nusa Karya",
        logo: { "@type": "ImageObject", url: "https://nusakarya.id/demo/nusa-karya/logo.webp" },
      },
    });
    expect(data.image).toMatch(/^https:\/\/nusakarya\.id\//);
  });

  it("omits author sameAs when the author has no profiles", () => {
    const pack = buildTestPack();
    const article = pack.articles[0];
    const author = { ...pack.team[1] };
    const data = buildArticleJsonLd({ ...article, author }, pack.settings, siteUrl);
    expect(data.author).not.toHaveProperty("sameAs");
  });

  it("omits image and publisher logo when they are missing", () => {
    const pack = buildTestPack();
    const article = { ...pack.articles[0], cover: null };
    const author = pack.team[0];
    const data = buildArticleJsonLd({ ...article, author }, { ...pack.settings, logo: null }, siteUrl);
    expect(data).not.toHaveProperty("image");
    expect(data.publisher).not.toHaveProperty("logo");
  });
});

describe("buildPersonJsonLd", () => {
  it("includes sameAs when the member has profiles", () => {
    const pack = buildTestPack();
    const data = buildPersonJsonLd(pack.team[0], pack.settings, siteUrl);
    expect(data).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Rina Wulandari",
      jobTitle: "Direktur Kreatif",
      worksFor: { "@type": "LocalBusiness", name: "Nusa Karya", url: "https://nusakarya.id/" },
      sameAs: ["https://www.linkedin.com/in/rina-wulandari"],
      image: "https://nusakarya.id/demo/nusa-karya/team-rina.webp",
    });
  });

  it("has no sameAs or image key when the member has no profiles and no photo", () => {
    const pack = buildTestPack();
    const data = buildPersonJsonLd(pack.team[1], pack.settings, siteUrl);
    expect(Object.keys(data)).not.toContain("sameAs");
    expect(Object.keys(data)).not.toContain("image");
  });
});

describe("buildFaqJsonLd", () => {
  it("returns null for an empty list", () => {
    expect(buildFaqJsonLd([])).toBeNull();
  });

  it("builds the FAQPage", () => {
    const data = buildFaqJsonLd([{ question: "Apa itu SEO?", answer: "Optimasi mesin pencari." }]);
    expect(data).toEqual({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Apa itu SEO?",
          acceptedAnswer: { "@type": "Answer", text: "Optimasi mesin pencari." },
        },
      ],
    });
  });
});

describe("serializeJsonLd", () => {
  it("escapes script-closing sequences and stays parseable", () => {
    const original = { name: "a</script><script>alert(1)" };
    const output = serializeJsonLd(original);
    expect(output).not.toContain("</script>");
    expect(output).not.toContain("<");
    expect(JSON.parse(output)).toEqual(original);
  });

  it("escapes line and paragraph separators", () => {
    const original = { text: "satu\u2028dua\u2029tiga" };
    const output = serializeJsonLd(original);
    expect(output).not.toContain("\u2028");
    expect(output).not.toContain("\u2029");
    expect(output).toContain("\\u2028");
    expect(output).toContain("\\u2029");
    expect(JSON.parse(output)).toEqual(original);
  });

  it("accepts an array", () => {
    const original = [{ a: 1 }, { b: "<b>" }];
    expect(JSON.parse(serializeJsonLd(original))).toEqual(original);
  });
});
