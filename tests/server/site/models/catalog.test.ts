import { describe, expect, it } from "vitest";
import {
  getPortfolioDetailModel,
  getPortfolioIndexModel,
  listPortfolioSlugs,
} from "@/server/site/models/portfolio";
import { getServiceDetailModel, getServicesIndexModel, listServiceSlugs } from "@/server/site/models/services";
import type { PageSeoResult } from "@/server/site/models/page-seo";
import { buildTestContext, buildTestQueries } from "../../../fixtures/site";

function jsonLdTypes(seo: PageSeoResult): unknown[] {
  return seo.jsonLd.map((entry) => entry["@type"]);
}

function expectSeoLimits(seo: PageSeoResult): void {
  const title = (seo.metadata.title as { absolute: string }).absolute;
  expect(title.length).toBeGreaterThanOrEqual(30);
  expect(title.length).toBeLessThanOrEqual(60);
  const description = seo.metadata.description as string;
  expect(description.length).toBeGreaterThanOrEqual(120);
  expect(description.length).toBeLessThanOrEqual(155);
}

describe("services models", () => {
  it("assembles the services index", async () => {
    const queries = buildTestQueries();
    const model = await getServicesIndexModel(queries, await buildTestContext());

    expect(model).not.toBeNull();
    expectSeoLimits(model!.seo);
    expect(model!.seo.metadata.alternates?.canonical).toBe("https://nusakarya.example/layanan");
    expect(model!.intro.key).toBe("services");
    expect(model!.services).toEqual(await queries.listServices());
    expect(model!.seo.breadcrumbs).toEqual([
      { name: "Beranda", path: "/" },
      { name: "Layanan", path: "/layanan" },
    ]);
  });

  it("lists service slugs", async () => {
    const queries = buildTestQueries();
    const slugs = await listServiceSlugs(queries);
    expect(slugs).toEqual((await queries.listServices()).map((service) => service.slug));
    expect(slugs.length).toBeGreaterThan(0);
  });

  it("assembles a service detail with service, faq, and breadcrumb json-ld", async () => {
    const queries = buildTestQueries();
    const [service] = await queries.listServices();
    const model = await getServiceDetailModel(queries, await buildTestContext(), service.slug);

    expect(model).not.toBeNull();
    expectSeoLimits(model!.seo);
    expect(model!.seo.metadata.alternates?.canonical).toBe(`https://nusakarya.example/layanan/${service.slug}`);
    expect(model!.service.slug).toBe(service.slug);
    expect(jsonLdTypes(model!.seo)).toEqual(["Service", "FAQPage", "BreadcrumbList"]);
    expect(model!.seo.breadcrumbs).toHaveLength(3);
    expect(model!.seo.breadcrumbs[1]).toEqual({ name: "Layanan", path: "/layanan" });
    expect(model!.seo.breadcrumbs[2]).toEqual({ name: service.title, path: `/layanan/${service.slug}` });
  });

  it("uses the service opengraph image route", async () => {
    const queries = buildTestQueries();
    const [service] = await queries.listServices();
    const model = await getServiceDetailModel(queries, await buildTestContext(), service.slug);
    expect(model!.seo.metadata.openGraph?.images).toEqual([
      expect.objectContaining({
        url: `https://nusakarya.example/layanan/${service.slug}/opengraph-image`,
        alt: service.title,
      }),
    ]);
  });

  it("omits FAQPage json-ld when the service has no faq", async () => {
    const queries = buildTestQueries();
    const [service] = await queries.listServices();
    const withoutFaq = { ...service, faq: [] };
    const stubbed = { ...queries, getService: async () => withoutFaq };
    const model = await getServiceDetailModel(stubbed, await buildTestContext(), service.slug);
    expect(jsonLdTypes(model!.seo)).toEqual(["Service", "BreadcrumbList"]);
  });

  it("lists at most 3 other services in order, excluding the open one", async () => {
    const queries = buildTestQueries();
    const services = await queries.listServices();
    const [service] = services;
    const model = await getServiceDetailModel(queries, await buildTestContext(), service.slug);

    expect(model!.others.length).toBeLessThanOrEqual(3);
    expect(model!.others.some((other) => other.slug === service.slug)).toBe(false);
    expect(model!.others).toEqual(services.filter((other) => other.slug !== service.slug).slice(0, 3));
  });

  it("caps others at 3 when there are more services", async () => {
    const queries = buildTestQueries();
    const [service] = await queries.listServices();
    const many = Array.from({ length: 6 }, (_, index) => ({ ...service, id: `s${index}`, slug: `layanan-${index}` }));
    const stubbed = { ...queries, listServices: async () => many, getService: async () => many[0] };
    const model = await getServiceDetailModel(stubbed, await buildTestContext(), "layanan-0");
    expect(model!.others.map((other) => other.slug)).toEqual(["layanan-1", "layanan-2", "layanan-3"]);
  });

  it("returns null for an unknown slug", async () => {
    expect(await getServiceDetailModel(buildTestQueries(), await buildTestContext(), "tidak-ada")).toBeNull();
  });

  it("returns null and no slugs when the services module is disabled", async () => {
    const theme = { enabledModules: [] };
    const queries = buildTestQueries(theme);
    const context = await buildTestContext({ theme });
    const [service] = await buildTestQueries().listServices();

    expect(await getServicesIndexModel(queries, context)).toBeNull();
    expect(await getServiceDetailModel(queries, context, service.slug)).toBeNull();
    expect(await listServiceSlugs(queries)).toEqual([]);
  });

  it("throws when the services intro is missing", async () => {
    const queries = { ...buildTestQueries(), getSectionIntro: async () => null };
    await expect(getServicesIndexModel(queries, await buildTestContext())).rejects.toThrow(Error);
  });
});

describe("portfolio models", () => {
  it("assembles the portfolio index", async () => {
    const queries = buildTestQueries();
    const model = await getPortfolioIndexModel(queries, await buildTestContext());

    expect(model).not.toBeNull();
    expectSeoLimits(model!.seo);
    expect(model!.seo.metadata.alternates?.canonical).toBe("https://nusakarya.example/portofolio");
    expect(model!.intro.key).toBe("portfolio");
    expect(model!.items).toEqual(await queries.listPortfolio());
    expect(model!.seo.breadcrumbs).toEqual([
      { name: "Beranda", path: "/" },
      { name: "Portofolio", path: "/portofolio" },
    ]);
  });

  it("lists portfolio slugs", async () => {
    const queries = buildTestQueries();
    const slugs = await listPortfolioSlugs(queries);
    expect(slugs).toEqual((await queries.listPortfolio()).map((item) => item.slug));
    expect(slugs.length).toBeGreaterThan(0);
  });

  it("assembles a portfolio detail with creative work and breadcrumb json-ld", async () => {
    const queries = buildTestQueries();
    const [item] = await queries.listPortfolio();
    const model = await getPortfolioDetailModel(queries, await buildTestContext(), item.slug);

    expect(model).not.toBeNull();
    expectSeoLimits(model!.seo);
    expect(model!.seo.metadata.alternates?.canonical).toBe(`https://nusakarya.example/portofolio/${item.slug}`);
    expect(jsonLdTypes(model!.seo)).toEqual(["CreativeWork", "BreadcrumbList"]);
    expect(model!.seo.breadcrumbs).toHaveLength(3);
    expect(model!.seo.metadata.openGraph?.images).toEqual([
      expect.objectContaining({
        url: `https://nusakarya.example/portofolio/${item.slug}/opengraph-image`,
        alt: item.title,
      }),
    ]);
  });

  it("lists at most 3 other items, excluding the open one", async () => {
    const queries = buildTestQueries();
    const [item] = await queries.listPortfolio();
    const many = Array.from({ length: 6 }, (_, index) => ({ ...item, id: `p${index}`, slug: `proyek-${index}` }));
    const stubbed = { ...queries, listPortfolio: async () => many, getPortfolioItem: async () => many[2] };
    const model = await getPortfolioDetailModel(stubbed, await buildTestContext(), "proyek-2");
    expect(model!.others.map((other) => other.slug)).toEqual(["proyek-0", "proyek-1", "proyek-3"]);
  });

  it("returns null for an unknown slug", async () => {
    expect(await getPortfolioDetailModel(buildTestQueries(), await buildTestContext(), "tidak-ada")).toBeNull();
  });

  it("returns null and no slugs when the portfolio module is disabled", async () => {
    const theme = { enabledModules: [] };
    const queries = buildTestQueries(theme);
    const context = await buildTestContext({ theme });
    const [item] = await buildTestQueries().listPortfolio();

    expect(await getPortfolioIndexModel(queries, context)).toBeNull();
    expect(await getPortfolioDetailModel(queries, context, item.slug)).toBeNull();
    expect(await listPortfolioSlugs(queries)).toEqual([]);
  });
});
