import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it } from "vitest";
import { AboutView } from "@/components/site/views/about-view";
import { ContactView } from "@/components/site/views/contact-view";
import { HomeView } from "@/components/site/views/home-view";
import { LegalView } from "@/components/site/views/legal-view";
import { LEGAL_SLUGS } from "@/core/domain/page/legal-page";
import { analyzeHeadings } from "@/lib/markdown/headings";
import { formatIndonesianDate } from "@/lib/text/format-date";
import { getAboutPageModel, type AboutPageModel } from "@/server/site/models/about";
import { getContactPageModel, type ContactPageModel } from "@/server/site/models/contact";
import { getHomePageModel, type HomePageModel } from "@/server/site/models/home";
import { getLegalPageModel, type LegalPageModel } from "@/server/site/models/legal";
import { buildTestPack } from "../../fixtures/content-pack";
import type { ModuleKey } from "@/core/domain/shared/module-key";
import { buildLinkedBlocksQueries, buildTestContext, buildTestQueries } from "../../fixtures/site";

type Heading = { level: number; text: string };

const ALL_BLOCKS_THEME = {
  contentBlocks: [
    { key: "how-we-work", label: "Cara kami bekerja", itemFields: ["title" as const, "description" as const, "icon" as const], minItems: 1, maxItems: 6 },
    { key: "why-choose-us", label: "Keunggulan", itemFields: ["title" as const, "description" as const, "icon" as const], minItems: 1, maxItems: 6 },
    { key: "home-faq", label: "FAQ beranda", itemFields: ["title" as const, "description" as const], minItems: 1, maxItems: 6 },
    { key: "cta-banner", label: "Banner ajakan", itemFields: ["link" as const], minItems: 1, maxItems: 2 },
  ],
};

let homeModel: HomePageModel;
let fullHomeModel: HomePageModel;
let bareHomeModel: HomePageModel;
let aboutModel: AboutPageModel;
let contactModel: ContactPageModel;
let legalModels: LegalPageModel[];

function headingsOf(markup: string): Heading[] {
  return [...markup.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map((match) => ({
    level: Number(match[1]),
    text: match[2].replace(/<[^>]*>/g, "").trim(),
  }));
}

function expectValidHeadingOutline(markup: string): void {
  const headings = headingsOf(markup);
  const analysis = analyzeHeadings(headings.map(({ level, text }) => `${"#".repeat(level)} ${text}`).join("\n"));

  expect(analysis.h1Count).toBe(1);
  expect(analysis.skipsLevel).toBe(false);
  expect(analysis.deepCount).toBe(0);
  expect(headings[0].level).toBe(1);
  for (const heading of headings) {
    expect(heading.text.length, `empty h${heading.level}`).toBeGreaterThan(0);
  }
}

function countOccurrences(text: string, part: string): number {
  return text.split(part).length - 1;
}

function imageTags(markup: string): string[] {
  return [...markup.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
}

function hrefsOf(markup: string): string[] {
  return [...markup.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map((match) => match[1]);
}

function anchorTexts(markup: string): string[] {
  return [...markup.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)].map((match) => match[1].replace(/<[^>]*>/g, "").trim().toLowerCase());
}

beforeAll(async () => {
  homeModel = await getHomePageModel(buildTestQueries(), await buildTestContext());
  fullHomeModel = await getHomePageModel(buildTestQueries(ALL_BLOCKS_THEME), await buildTestContext({ theme: ALL_BLOCKS_THEME }));
  fullHomeModel.blocks = {
    ...fullHomeModel.blocks,
    "why-choose-us": {
      key: "why-choose-us",
      eyebrow: "Keunggulan",
      title: "Mengapa memilih Nusa Karya",
      description: "Tiga alasan utama.",
      items: [
        { title: "Berpengalaman", description: "Lebih dari sepuluh tahun.", icon: "award", media: null, link: null },
        { title: "Transparan", description: "Biaya jelas sejak awal.", icon: "shield-check", media: null, link: null },
      ],
    },
    "home-faq": {
      key: "home-faq",
      eyebrow: "FAQ",
      title: "Pertanyaan umum",
      description: null,
      items: [
        { title: "Berapa lama proses pembuatan?", description: "Rata-rata empat minggu.", icon: null, media: null, link: null },
        { title: "Apakah ada garansi?", description: "Ada masa perbaikan.", icon: null, media: null, link: null },
      ],
    },
    "cta-banner": {
      key: "cta-banner",
      eyebrow: null,
      title: "Siap memulai?",
      description: "Ceritakan kebutuhan Anda.",
      items: [
        { title: null, description: null, icon: null, media: null, link: { label: "Jadwalkan Konsultasi", href: "/kontak" } },
        { title: null, description: null, icon: null, media: null, link: { label: "Lihat Layanan", href: "/layanan" } },
      ],
    },
  };
  bareHomeModel = {
    ...homeModel,
    services: [],
    featuredPortfolio: [],
    team: [],
    stats: [],
    testimonials: [],
    partners: [],
    latestArticles: [],
    vision: null,
    blocks: {},
  };
  const queries = buildTestQueries();
  const context = await buildTestContext();
  aboutModel = await getAboutPageModel(queries, context);
  contactModel = await getContactPageModel(queries, context);
  legalModels = [];
  for (const slug of LEGAL_SLUGS) {
    const model = await getLegalPageModel(queries, context, slug);
    if (!model) {
      throw new Error(`Missing legal model for ${slug}`);
    }
    legalModels.push(model);
  }
});

describe("HomeView", () => {
  it("renders exactly one h1 with the hero title and an ordered outline", () => {
    const markup = renderToStaticMarkup(<HomeView model={fullHomeModel} />);

    expect(countOccurrences(markup, "<h1")).toBe(1);
    expect(headingsOf(markup)[0]).toEqual({ level: 1, text: fullHomeModel.hero.heroTitle });
    expectValidHeadingOutline(markup);
    expect(headingsOf(markup).filter(({ level }) => level === 2).length).toBeGreaterThanOrEqual(8);
  });

  it("renders the hero call to actions from the data as links", () => {
    const markup = renderToStaticMarkup(<HomeView model={homeModel} />);
    const { primaryCta, secondaryCta } = homeModel.hero;

    expect(primaryCta).not.toBeNull();
    expect(secondaryCta).not.toBeNull();
    expect(markup).toMatch(new RegExp(`<a\\b[^>]*href="${primaryCta?.href}"[^>]*>${primaryCta?.label}</a>`));
    expect(markup).toMatch(new RegExp(`<a\\b[^>]*href="${secondaryCta?.href}"[^>]*>${secondaryCta?.label}</a>`));
  });

  it("omits the hero actions and image when the data has none", () => {
    const model: HomePageModel = {
      ...bareHomeModel,
      intros: {},
      hero: { ...bareHomeModel.hero, primaryCta: null, secondaryCta: null, heroImage: null },
    };
    const markup = renderToStaticMarkup(<HomeView model={model} />);

    expect(markup).not.toContain("<a ");
    expect(markup).not.toContain("<img");
    expect(countOccurrences(markup, "<h1")).toBe(1);
  });

  it("renders every section in the home order", () => {
    const markup = renderToStaticMarkup(<HomeView model={fullHomeModel} />);
    const titles = [
      fullHomeModel.intros.stats?.title,
      fullHomeModel.intros.services?.title,
      fullHomeModel.blocks["how-we-work"]?.title,
      fullHomeModel.intros.portfolio?.title,
      fullHomeModel.blocks["why-choose-us"]?.title,
      fullHomeModel.intros.about?.title,
      fullHomeModel.intros.vision?.title,
      fullHomeModel.intros.team?.title,
      fullHomeModel.intros.testimonials?.title,
      fullHomeModel.intros.partners?.title,
      fullHomeModel.intros.articles?.title,
      fullHomeModel.blocks["home-faq"]?.title,
      fullHomeModel.blocks["cta-banner"]?.title,
    ];
    const h2Texts = headingsOf(markup)
      .filter(({ level }) => level === 2)
      .map(({ text }) => text);
    const present = titles.filter((title): title is string => Boolean(title));

    expect(present.length).toBeGreaterThanOrEqual(9);
    expect(h2Texts).toEqual(present);
  });

  it("links cards to the detail routes with meaningful link text", () => {
    const markup = renderToStaticMarkup(<HomeView model={homeModel} />);
    const hrefs = hrefsOf(markup);

    for (const service of homeModel.services) {
      expect(hrefs).toContain(`/layanan/${service.slug}`);
    }
    for (const item of homeModel.featuredPortfolio) {
      expect(hrefs).toContain(`/portofolio/${item.slug}`);
    }
    for (const article of homeModel.latestArticles) {
      expect(hrefs).toContain(`/artikel/${article.slug}`);
    }
    expect(hrefs).toContain("/tentang");
    expect(hrefs).toContain("/layanan");
    expect(hrefs).toContain("/portofolio");
    expect(hrefs).toContain("/artikel");
    const texts = anchorTexts(markup);
    expect(texts.length).toBeGreaterThan(0);
    for (const text of texts) {
      expect(text, "empty anchor text").not.toBe("");
      expect(text).not.toMatch(/klik di sini|click here/);
    }
  });

  it("gives every image a source, alt text, width, and height", () => {
    const images = imageTags(renderToStaticMarkup(<HomeView model={homeModel} />));

    expect(images.length).toBeGreaterThan(3);
    for (const image of images) {
      expect(image).toMatch(/\bsrc="[^"]+"/);
      expect(image).toMatch(/\balt="[^"]+"/);
      expect(image).toMatch(/\bwidth="\d+"/);
      expect(image).toMatch(/\bheight="\d+"/);
    }
  });

  it("renders nothing for a section whose data is empty, so there is no orphan heading", () => {
    const markup = renderToStaticMarkup(<HomeView model={bareHomeModel} />);

    expect(headingsOf(markup).map(({ level }) => level)).toEqual([1, 2]);
    expect(headingsOf(markup)[1].text).toBe(bareHomeModel.intros.about?.title);
    expect(countOccurrences(markup, "<section")).toBe(1);
    expect(renderToStaticMarkup(<HomeView model={{ ...bareHomeModel, intros: {} }} />)).not.toContain("<h2");
  });

  it("renders no section heading when the intro is missing even if the data exists", () => {
    const markup = renderToStaticMarkup(<HomeView model={{ ...homeModel, intros: {} }} />);

    expect(markup).not.toContain(homeModel.services[0].title);
    expectValidHeadingOutline(markup);
  });

  it("renders no services section when the services module is disabled", async () => {
    const theme = { enabledModules: [] };
    const model = await getHomePageModel(buildTestQueries(theme), await buildTestContext({ theme }));
    const markup = renderToStaticMarkup(<HomeView model={model} />);
    const serviceTitle = buildTestPack().services[0].title;

    expect(renderToStaticMarkup(<HomeView model={homeModel} />)).toContain(serviceTitle);
    expect(markup).not.toContain(serviceTitle);
    expect(markup).not.toContain("/layanan/");
    expect(markup).not.toContain("/portofolio/");
    expect(markup).not.toContain("/artikel/");
    expectValidHeadingOutline(markup);
    expect(countOccurrences(markup, "<h1")).toBe(1);
  });

  it("renders the content blocks only when the block exists", () => {
    const withBlocks = renderToStaticMarkup(<HomeView model={fullHomeModel} />);
    const withoutBlocks = renderToStaticMarkup(<HomeView model={{ ...homeModel, blocks: {} }} />);

    for (const title of ["Mengapa memilih Nusa Karya", "Pertanyaan umum", "Siap memulai?", "Bagaimana kami bekerja"]) {
      expect(withBlocks).toContain(title);
      expect(withoutBlocks).not.toContain(title);
    }
    expect(withBlocks).toContain("Berapa lama proses pembuatan?");
    expect(withBlocks).toMatch(/<h3[^>]*>Berapa lama proses pembuatan\?<\/h3>/);
    expect(withBlocks).toMatch(/<a\b[^>]*href="\/kontak"[^>]*>Jadwalkan Konsultasi<\/a>/);
  });

  it("renders a content block as nothing when it has no items", () => {
    const block = fullHomeModel.blocks["why-choose-us"];
    if (!block) {
      throw new Error("Missing why-choose-us block");
    }
    const markup = renderToStaticMarkup(<HomeView model={{ ...fullHomeModel, blocks: { "why-choose-us": { ...block, items: [] } } }} />);

    expect(block.items.length).toBeGreaterThan(0);
    expect(renderToStaticMarkup(<HomeView model={fullHomeModel} />)).toContain(block.title);
    expect(markup).not.toContain(block.title);
  });
});

describe("HomeView links to gated routes", () => {
  const GATED_SECTIONS = ["layanan", "portofolio", "artikel"];

  async function renderLinkedHome(enabledModules?: ModuleKey[]): Promise<string[]> {
    const theme = enabledModules ? { enabledModules } : undefined;
    const model = await getHomePageModel(buildLinkedBlocksQueries(theme), await buildTestContext({ theme }));
    return hrefsOf(renderToStaticMarkup(<HomeView model={model} />));
  }

  function expectNoLinkInto(hrefs: string[], section: string): void {
    expect(hrefs, section).not.toContain(`/${section}`);
    expect(hrefs.filter((href) => href.startsWith(`/${section}/`)), section).toEqual([]);
  }

  it("links the hero and banner to every gated section when all modules are enabled", async () => {
    const hrefs = await renderLinkedHome();

    for (const section of GATED_SECTIONS) {
      expect(hrefs, section).toContain(`/${section}`);
    }
    expect(hrefs).toContain("/kontak");
  });

  it("renders no link into any gated section when every module is disabled", async () => {
    const hrefs = await renderLinkedHome([]);

    for (const section of GATED_SECTIONS) {
      expectNoLinkInto(hrefs, section);
    }
    expect(hrefs).toContain("/kontak");
    expect(hrefs).toContain("/tentang");
  });

  it("keeps the markup free of the exact gated href attributes when every module is disabled", async () => {
    const model = await getHomePageModel(buildLinkedBlocksQueries({ enabledModules: [] }), await buildTestContext({ theme: { enabledModules: [] } }));
    const markup = renderToStaticMarkup(<HomeView model={model} />);

    for (const section of GATED_SECTIONS) {
      expect(markup).not.toContain(`href="/${section}"`);
      expect(markup).not.toContain(`href="/${section}/`);
    }
    expect(markup).toContain("Bagaimana kami bekerja");
    expect(markup).toContain("Siap memulai?");
    expect(markup).not.toContain("Lihat Portofolio");
    expect(markup).not.toContain("Lihat Layanan");
  });

  it("only removes the links of the disabled module in a mixed case", async () => {
    const hrefs = await renderLinkedHome(["portfolio", "articles"]);

    expectNoLinkInto(hrefs, "layanan");
    expect(hrefs).toContain("/portofolio");
    expect(hrefs).toContain("/artikel");
  });
});

describe("AboutView", () => {
  it("renders one h1, the profile markdown, the team, and the stats in order", () => {
    const markup = renderToStaticMarkup(<AboutView model={aboutModel} />);

    expect(countOccurrences(markup, "<h1")).toBe(1);
    expectValidHeadingOutline(markup);
    expect(markup).toContain("Kami berdiri sejak 2015");
    for (const member of aboutModel.team) {
      expect(markup).toContain(member.name);
      expect(markup).toContain(member.jobTitle);
    }
    for (const stat of aboutModel.stats) {
      expect(markup).toContain(stat.label);
    }
    expect(markup).toContain(aboutModel.vision?.vision ?? "missing vision");
    const profileIndex = markup.indexOf("Kami berdiri sejak 2015");
    const teamIndex = markup.indexOf(aboutModel.team[0].name);
    const statIndex = markup.indexOf(aboutModel.stats[0].label);
    expect(profileIndex).toBeLessThan(teamIndex);
    expect(teamIndex).toBeLessThan(statIndex);
  });

  it("uses the about intro for the hero heading", () => {
    const markup = renderToStaticMarkup(<AboutView model={aboutModel} />);

    expect(headingsOf(markup)[0]).toEqual({ level: 1, text: aboutModel.intros.about?.title });
  });

  it("falls back to the about content when the about intro is missing", () => {
    const markup = renderToStaticMarkup(<AboutView model={{ ...aboutModel, intros: { ...aboutModel.intros, about: undefined } }} />);

    expect(countOccurrences(markup, "<h1")).toBe(1);
    expect(headingsOf(markup)[0].text).toBe(aboutModel.about.metaTitle);
  });

  it("omits the team and stats sections when there is no data", () => {
    const markup = renderToStaticMarkup(<AboutView model={{ ...aboutModel, team: [], stats: [], vision: null }} />);

    expect(markup).not.toContain(aboutModel.team[0].name);
    expect(markup).not.toContain(aboutModel.stats[0].label);
    expect(markup).not.toContain(aboutModel.intros.team?.title ?? "missing");
    expectValidHeadingOutline(markup);
  });

  it("shows the profile image with alt text, width, and height", () => {
    const images = imageTags(renderToStaticMarkup(<AboutView model={aboutModel} />));

    expect(images.length).toBeGreaterThan(0);
    for (const image of images) {
      expect(image).toMatch(/\balt="[^"]+"/);
      expect(image).toMatch(/\bwidth="\d+"/);
      expect(image).toMatch(/\bheight="\d+"/);
    }
  });
});

describe("LegalView", () => {
  it("renders one h1, the intro, and every section as an h2 for each legal page", () => {
    expect(legalModels).toHaveLength(LEGAL_SLUGS.length);

    for (const model of legalModels) {
      const markup = renderToStaticMarkup(<LegalView model={model} />);

      expect(countOccurrences(markup, "<h1"), model.page.slug).toBe(1);
      expect(headingsOf(markup)[0]).toEqual({ level: 1, text: model.page.title });
      expectValidHeadingOutline(markup);
      expect(markup).toContain(model.page.intro);
      for (const section of model.page.sections) {
        expect(headingsOf(markup)).toContainEqual({ level: 2, text: section.heading });
        expect(markup).toContain(section.bodyMd);
      }
    }
  });

  it("shows the last updated date with a machine readable time element", () => {
    for (const model of legalModels) {
      const markup = renderToStaticMarkup(<LegalView model={model} />);

      expect(markup).toContain("Diperbarui terakhir");
      expect(markup).toMatch(new RegExp(`<time datetime="${model.page.updatedAt}">`, "i"));
      expect(markup).toContain(formatIndonesianDate(model.page.updatedAt));
    }
  });

  it("demotes headings written inside a section body so the outline never skips", () => {
    const [model] = legalModels;
    const withHeadings: LegalPageModel = {
      ...model,
      page: { ...model.page, sections: [{ heading: "Bagian Satu", bodyMd: "# Judul Besar\n\nIsi.\n\n### Sub Bagian\n\nIsi lagi." }] },
    };
    const markup = renderToStaticMarkup(<LegalView model={withHeadings} />);

    expect(countOccurrences(markup, "<h1")).toBe(1);
    expectValidHeadingOutline(markup);
  });
});

describe("ContactView", () => {
  it("renders one h1 from the contact intro, the form with labels, and the address details", () => {
    const markup = renderToStaticMarkup(<ContactView model={contactModel} />);
    const { settings } = contactModel;

    expect(countOccurrences(markup, "<h1")).toBe(1);
    expect(headingsOf(markup)[0]).toEqual({ level: 1, text: contactModel.intro.title });
    expectValidHeadingOutline(markup);
    expect(markup).toContain("<form");
    for (const id of ["kontak-nama", "kontak-email", "kontak-telepon", "kontak-pesan"]) {
      expect(markup).toContain(`for="${id}"`);
    }
    expect(markup).toContain(settings.address.street);
    expect(markup).toContain(settings.address.city);
    expect(markup).toContain(`href="mailto:${settings.email}"`);
    expect(markup).toContain(`href="tel:${settings.phone.replace(/\s+/g, "")}"`);
    expect(markup).toContain(`href="${contactModel.whatsappUrl}"`);
  });

  it("shows the opening hours only when they are set", () => {
    const hours = contactModel.settings.openingHours ?? "missing hours";
    const withHours = renderToStaticMarkup(<ContactView model={contactModel} />);
    const withoutHours = renderToStaticMarkup(
      <ContactView model={{ ...contactModel, settings: { ...contactModel.settings, openingHours: null } }} />,
    );

    expect(withHours).toContain(hours);
    expect(withoutHours).not.toContain(hours);
  });

  it("renders a lazy titled map iframe only when mapsEmbedUrl is set", () => {
    const mapUrl = contactModel.settings.mapsEmbedUrl;
    const withMap = renderToStaticMarkup(<ContactView model={contactModel} />);
    const withoutMap = renderToStaticMarkup(
      <ContactView model={{ ...contactModel, settings: { ...contactModel.settings, mapsEmbedUrl: null } }} />,
    );

    expect(mapUrl).toBeTruthy();
    const iframe = withMap.match(/<iframe\b[^>]*>/)?.[0] ?? "";
    expect(iframe).toContain(`src="${mapUrl}"`);
    expect(iframe).toContain('loading="lazy"');
    expect(iframe).toMatch(/\btitle="[^"]+"/);
    expectValidHeadingOutline(withMap);
    expect(withoutMap).not.toContain("<iframe");
    expectValidHeadingOutline(withoutMap);
  });

  it("keeps the demo form free of a network action", () => {
    const markup = renderToStaticMarkup(<ContactView model={contactModel} />);

    expect(markup).not.toMatch(/<form\b[^>]*\baction=/);
  });

  it("enables the send button outside demo mode because the view wires the contact action", () => {
    const markup = renderToStaticMarkup(<ContactView model={{ ...contactModel, isDemo: false }} />);

    expect(markup.match(/<button\b[^>]*type="submit"[^>]*>/)?.[0]).not.toContain('disabled=""');
  });
});
