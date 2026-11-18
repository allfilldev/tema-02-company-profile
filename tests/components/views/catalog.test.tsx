import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it } from "vitest";
import { PortfolioDetailView } from "@/components/site/views/portfolio-detail-view";
import { PortfolioIndexView } from "@/components/site/views/portfolio-index-view";
import { ServiceDetailView } from "@/components/site/views/service-detail-view";
import { ServicesIndexView } from "@/components/site/views/services-index-view";
import type { ModuleKey } from "@/core/domain/shared/module-key";
import { formatIndonesianDate } from "@/lib/text/format-date";
import {
  getPortfolioDetailModel,
  getPortfolioIndexModel,
  type PortfolioDetailModel,
  type PortfolioIndexModel,
} from "@/server/site/models/portfolio";
import {
  getServiceDetailModel,
  getServicesIndexModel,
  type ServiceDetailModel,
  type ServicesIndexModel,
} from "@/server/site/models/services";
import {
  countOccurrences,
  expectCompleteImages,
  expectMeaningfulAnchors,
  expectValidHeadingOutline,
  headingsOf,
  hrefsOf,
} from "../../fixtures/markup";
import { buildTestPack } from "../../fixtures/content-pack";
import { buildTestContext, buildTestQueries } from "../../fixtures/site";

const [WEBSITE_SERVICE, BRANDING_SERVICE] = buildTestPack().services;
const [COFFEE_ITEM, CLINIC_ITEM] = buildTestPack().portfolio;

let servicesIndex: ServicesIndexModel;
let serviceDetail: ServiceDetailModel;
let serviceWithoutFaq: ServiceDetailModel;
let portfolioIndex: PortfolioIndexModel;
let portfolioWithGallery: PortfolioDetailModel;
let portfolioWithoutGallery: PortfolioDetailModel;

async function requireModel<Model>(model: Promise<Model | null>): Promise<Model> {
  const resolved = await model;
  if (!resolved) {
    throw new Error("Missing model");
  }
  return resolved;
}

async function loadModels(enabledModules?: ModuleKey[]) {
  const theme = enabledModules ? { enabledModules } : undefined;
  return { queries: buildTestQueries(theme), context: await buildTestContext({ theme }) };
}

beforeAll(async () => {
  const { queries, context } = await loadModels();
  servicesIndex = await requireModel(getServicesIndexModel(queries, context));
  serviceDetail = await requireModel(getServiceDetailModel(queries, context, WEBSITE_SERVICE.slug));
  serviceWithoutFaq = await requireModel(getServiceDetailModel(queries, context, BRANDING_SERVICE.slug));
  portfolioIndex = await requireModel(getPortfolioIndexModel(queries, context));
  portfolioWithGallery = await requireModel(getPortfolioDetailModel(queries, context, COFFEE_ITEM.slug));
  portfolioWithoutGallery = await requireModel(getPortfolioDetailModel(queries, context, CLINIC_ITEM.slug));
});

describe("ServicesIndexView", () => {
  it("renders exactly one h1 from the intro, an h2 for the list, and an h3 for every service", () => {
    const markup = renderToStaticMarkup(<ServicesIndexView model={servicesIndex} />);
    const headings = headingsOf(markup);

    expect(countOccurrences(markup, "<h1")).toBe(1);
    expect(headings[0]).toEqual({ level: 1, text: servicesIndex.intro.title });
    expectValidHeadingOutline(markup);
    expect(headings.filter(({ level }) => level === 2)).toHaveLength(1);
    expect(headings.filter(({ level }) => level === 3).map(({ text }) => text)).toEqual(
      servicesIndex.services.map((service) => service.title),
    );
  });

  it("links every service card to its detail route with meaningful text and complete images", () => {
    const markup = renderToStaticMarkup(<ServicesIndexView model={servicesIndex} />);

    expect(servicesIndex.services.length).toBeGreaterThan(1);
    expect(hrefsOf(markup)).toEqual(servicesIndex.services.map((service) => `/layanan/${service.slug}`));
    expectMeaningfulAnchors(markup);
    expectCompleteImages(markup);
  });

  it("renders only the hero when there are no services", () => {
    const markup = renderToStaticMarkup(<ServicesIndexView model={{ ...servicesIndex, services: [] }} />);

    expect(headingsOf(markup).map(({ level }) => level)).toEqual([1]);
    expect(hrefsOf(markup)).toEqual([]);
  });
});

describe("ServiceDetailView", () => {
  it("renders exactly one h1 with the service title and an ordered outline", () => {
    const markup = renderToStaticMarkup(<ServiceDetailView model={serviceDetail} />);

    expect(countOccurrences(markup, "<h1")).toBe(1);
    expect(headingsOf(markup)[0]).toEqual({ level: 1, text: WEBSITE_SERVICE.title });
    expectValidHeadingOutline(markup);
    expect(markup).toContain(WEBSITE_SERVICE.bodyMd);
  });

  it("demotes a markdown h1 in the body so the page keeps a single h1", () => {
    const bodyMd = "# Judul di dalam isi\n\n## Bagian pertama\n\nIsi bagian pertama.";
    const markup = renderToStaticMarkup(
      <ServiceDetailView model={{ ...serviceDetail, service: { ...serviceDetail.service, bodyMd } }} />,
    );
    const headings = headingsOf(markup);

    expect(countOccurrences(markup, "<h1")).toBe(1);
    expect(headings.find(({ text }) => text === "Judul di dalam isi")?.level).toBe(2);
    expectValidHeadingOutline(markup);
  });

  it("renders the faq as an h2 with one h3 per question, and nothing when the service has no faq", () => {
    const withFaq = headingsOf(renderToStaticMarkup(<ServiceDetailView model={serviceDetail} />));
    const withoutFaq = headingsOf(renderToStaticMarkup(<ServiceDetailView model={serviceWithoutFaq} />));
    const questions = WEBSITE_SERVICE.faq.map((item) => item.question);

    expect(questions.length).toBeGreaterThan(0);
    expect(withFaq.filter(({ level }) => level === 3).map(({ text }) => text)).toEqual(
      expect.arrayContaining(questions),
    );
    expect(withFaq.some(({ level, text }) => level === 2 && text === "Pertanyaan yang sering diajukan")).toBe(true);
    expect(BRANDING_SERVICE.faq).toEqual([]);
    expect(withoutFaq.some(({ text }) => text === "Pertanyaan yang sering diajukan")).toBe(false);
  });

  it("lists the other services as links whose text is the service title", () => {
    const markup = renderToStaticMarkup(<ServiceDetailView model={serviceDetail} />);
    const headings = headingsOf(markup);

    expect(serviceDetail.others.length).toBeGreaterThan(0);
    expect(headings.some(({ level, text }) => level === 2 && text === "Layanan lainnya")).toBe(true);
    for (const other of serviceDetail.others) {
      expect(markup).toMatch(new RegExp(`<a\\b[^>]*href="/layanan/${other.slug}"[^>]*>${other.title}</a>`));
    }
    expect(hrefsOf(markup)).not.toContain(`/layanan/${WEBSITE_SERVICE.slug}`);
    expectMeaningfulAnchors(markup);
  });

  it("renders no other-services section when there are none", () => {
    const markup = renderToStaticMarkup(<ServiceDetailView model={{ ...serviceDetail, others: [] }} />);

    expect(markup).not.toContain("Layanan lainnya");
    expect(hrefsOf(markup)).toEqual([]);
    expectValidHeadingOutline(markup);
  });

  it("gives every image a source, alt text, width, and height", () => {
    expectCompleteImages(renderToStaticMarkup(<ServiceDetailView model={serviceDetail} />));
  });
});

describe("PortfolioIndexView", () => {
  it("renders exactly one h1 from the intro and an h3 for every item", () => {
    const markup = renderToStaticMarkup(<PortfolioIndexView model={portfolioIndex} />);
    const headings = headingsOf(markup);

    expect(countOccurrences(markup, "<h1")).toBe(1);
    expect(headings[0]).toEqual({ level: 1, text: portfolioIndex.intro.title });
    expectValidHeadingOutline(markup);
    expect(headings.filter(({ level }) => level === 3).map(({ text }) => text)).toEqual(
      portfolioIndex.items.map((item) => item.title),
    );
  });

  it("links every card to its detail route with meaningful text and complete images", () => {
    const markup = renderToStaticMarkup(<PortfolioIndexView model={portfolioIndex} />);

    expect(hrefsOf(markup)).toEqual(portfolioIndex.items.map((item) => `/portofolio/${item.slug}`));
    expectMeaningfulAnchors(markup);
    expectCompleteImages(markup);
  });
});

describe("PortfolioDetailView", () => {
  it("renders exactly one h1 with the item title and an ordered outline", () => {
    const markup = renderToStaticMarkup(<PortfolioDetailView model={portfolioWithGallery} />);

    expect(countOccurrences(markup, "<h1")).toBe(1);
    expect(headingsOf(markup)[0]).toEqual({ level: 1, text: COFFEE_ITEM.title });
    expectValidHeadingOutline(markup);
    expect(markup).toContain(COFFEE_ITEM.bodyMd);
  });

  it("shows the client, the category, and the formatted completion date", () => {
    const markup = renderToStaticMarkup(<PortfolioDetailView model={portfolioWithGallery} />);

    expect(markup).toMatch(new RegExp(`<dt[^>]*>Klien</dt>\\s*<dd[^>]*>${COFFEE_ITEM.clientName}</dd>`));
    expect(markup).toMatch(new RegExp(`<dt[^>]*>Kategori</dt>\\s*<dd[^>]*>${COFFEE_ITEM.category}</dd>`));
    expect(markup).toMatch(
      new RegExp(
        `<dt[^>]*>Selesai</dt>\\s*<dd[^>]*><time datetime="${COFFEE_ITEM.completedOn}"[^>]*>${formatIndonesianDate(COFFEE_ITEM.completedOn ?? "")}</time></dd>`,
        "i",
      ),
    );
  });

  it("omits the completion date when the item has none", () => {
    const markup = renderToStaticMarkup(<PortfolioDetailView model={portfolioWithoutGallery} />);

    expect(CLINIC_ITEM.completedOn).toBeNull();
    expect(markup).not.toMatch(/<dt[^>]*>Selesai<\/dt>/);
    expect(markup).not.toContain("<time");
    expect(markup).toContain(CLINIC_ITEM.clientName);
  });

  it("renders the gallery heading and images only when the item has gallery media", () => {
    const withGallery = renderToStaticMarkup(<PortfolioDetailView model={portfolioWithGallery} />);
    const withoutGallery = renderToStaticMarkup(<PortfolioDetailView model={portfolioWithoutGallery} />);
    const galleryAlt = COFFEE_ITEM.gallery[0].alt;

    expect(headingsOf(withGallery).some(({ level, text }) => level === 2 && text === "Galeri proyek")).toBe(true);
    expect(withGallery).toContain(`alt="${galleryAlt}"`);
    expectValidHeadingOutline(withGallery);
    expect(CLINIC_ITEM.gallery).toEqual([]);
    expect(withoutGallery).not.toContain("Galeri proyek");
    expect(withoutGallery).not.toContain("<figure");
    expectValidHeadingOutline(withoutGallery);
  });

  it("lists the other items as links whose text is the item title", () => {
    const markup = renderToStaticMarkup(<PortfolioDetailView model={portfolioWithGallery} />);

    expect(portfolioWithGallery.others.length).toBeGreaterThan(0);
    expect(headingsOf(markup).some(({ level, text }) => level === 2 && text === "Portofolio lainnya")).toBe(true);
    for (const other of portfolioWithGallery.others) {
      expect(markup).toMatch(new RegExp(`<a\\b[^>]*href="/portofolio/${other.slug}"[^>]*>${other.title}</a>`));
    }
    expectMeaningfulAnchors(markup);
    expect(renderToStaticMarkup(<PortfolioDetailView model={{ ...portfolioWithGallery, others: [] }} />)).not.toContain(
      "Portofolio lainnya",
    );
  });

  it("gives every image a source, alt text, width, and height", () => {
    expectCompleteImages(renderToStaticMarkup(<PortfolioDetailView model={portfolioWithGallery} />));
  });
});

describe("catalog views and disabled modules", () => {
  it("has no model for a disabled module", async () => {
    const { queries, context } = await loadModels(["articles"]);

    expect(await getServicesIndexModel(queries, context)).toBeNull();
    expect(await getServiceDetailModel(queries, context, WEBSITE_SERVICE.slug)).toBeNull();
    expect(await getPortfolioIndexModel(queries, context)).toBeNull();
    expect(await getPortfolioDetailModel(queries, context, COFFEE_ITEM.slug)).toBeNull();
  });

  it("links only to routes that come from the model, never to another section", async () => {
    const { queries, context } = await loadModels(["services", "portfolio"]);
    const services = await requireModel(getServicesIndexModel(queries, context));
    const serviceOne = await requireModel(getServiceDetailModel(queries, context, WEBSITE_SERVICE.slug));
    const portfolio = await requireModel(getPortfolioIndexModel(queries, context));
    const portfolioOne = await requireModel(getPortfolioDetailModel(queries, context, COFFEE_ITEM.slug));

    const serviceHrefs = [
      ...hrefsOf(renderToStaticMarkup(<ServicesIndexView model={services} />)),
      ...hrefsOf(renderToStaticMarkup(<ServiceDetailView model={serviceOne} />)),
    ];
    const portfolioHrefs = [
      ...hrefsOf(renderToStaticMarkup(<PortfolioIndexView model={portfolio} />)),
      ...hrefsOf(renderToStaticMarkup(<PortfolioDetailView model={portfolioOne} />)),
    ];

    expect(serviceHrefs.length).toBeGreaterThan(0);
    expect(new Set(serviceHrefs)).toEqual(new Set(services.services.map((service) => `/layanan/${service.slug}`)));
    expect(portfolioHrefs.length).toBeGreaterThan(0);
    expect(new Set(portfolioHrefs)).toEqual(new Set(portfolio.items.map((item) => `/portofolio/${item.slug}`)));
  });

  it("renders a link into another section only when the content itself carries it", () => {
    const bodyMd = "Lihat juga [studi kasus kami](/portofolio) untuk contoh hasil kerja.";
    const markup = renderToStaticMarkup(
      <ServiceDetailView model={{ ...serviceDetail, service: { ...serviceDetail.service, bodyMd } }} />,
    );

    expect(hrefsOf(markup)).toContain("/portofolio");
    expect(hrefsOf(renderToStaticMarkup(<ServiceDetailView model={serviceDetail} />))).not.toContain("/portofolio");
  });
});
