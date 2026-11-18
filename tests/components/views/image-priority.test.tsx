import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { Header } from "@/components/site/layout/header";
import { AboutView } from "@/components/site/views/about-view";
import { ArticleDetailView } from "@/components/site/views/article-detail-view";
import { ArticlesIndexView } from "@/components/site/views/articles-index-view";
import { ContactView } from "@/components/site/views/contact-view";
import { HomeView } from "@/components/site/views/home-view";
import { LegalView } from "@/components/site/views/legal-view";
import { PortfolioDetailView } from "@/components/site/views/portfolio-detail-view";
import { PortfolioIndexView } from "@/components/site/views/portfolio-index-view";
import { ServiceDetailView } from "@/components/site/views/service-detail-view";
import { ServicesIndexView } from "@/components/site/views/services-index-view";
import { CARD_GRID_MAX_COLUMNS } from "@/lib/ui/card-grid";
import type { SiteContext } from "@/server/site/site-context";
import type { SiteQueries } from "@/core/application/site/site-queries";
import { getAboutPageModel } from "@/server/site/models/about";
import { getArticleDetailModel, getArticlesIndexModel } from "@/server/site/models/articles";
import { getContactPageModel } from "@/server/site/models/contact";
import { getHomePageModel } from "@/server/site/models/home";
import { getLegalPageModel } from "@/server/site/models/legal";
import { getPortfolioDetailModel, getPortfolioIndexModel } from "@/server/site/models/portfolio";
import { getServiceDetailModel, getServicesIndexModel } from "@/server/site/models/services";
import { buildTestContext, buildTestQueries } from "../../fixtures/site";

type ImageMockProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading?: "eager" | "lazy";
  preload?: boolean;
};

vi.mock("next/image", () => ({
  default: ({ src, alt, width, height, loading, preload }: ImageMockProps) => (
    <img src={src} alt={alt} width={width} height={height} loading={loading} data-preload={preload ? "true" : undefined} />
  ),
}));

type ImageTag = { src: string; preload: boolean; loading: string | null };

function imageTags(markup: string): ImageTag[] {
  return [...markup.matchAll(/<img\b[^>]*>/g)].map(([tag]) => ({
    src: tag.match(/\ssrc="([^"]*)"/)?.[1] ?? "",
    preload: tag.includes('data-preload="true"'),
    loading: tag.match(/\sloading="([^"]*)"/)?.[1] ?? null,
  }));
}

function preloadedSources(markup: string): string[] {
  return imageTags(markup)
    .filter((tag) => tag.preload)
    .map((tag) => tag.src);
}

function expectFirstCardRowEager(markup: string, coversInOrder: (string | undefined)[]) {
  const present = (covers: (string | undefined)[]) => covers.filter((cover): cover is string => cover !== undefined);
  const tags = imageTags(markup);

  expect(preloadedSources(markup)).toEqual([]);
  expect(tags.filter((tag) => tag.loading === "eager").map((tag) => tag.src)).toEqual(present(coversInOrder.slice(0, CARD_GRID_MAX_COLUMNS)));
  expect(tags.filter((tag) => tag.loading === null).map((tag) => tag.src)).toEqual(present(coversInOrder.slice(CARD_GRID_MAX_COLUMNS)));
}

async function requireModel<Model>(model: Promise<Model | null>): Promise<Model> {
  const resolved = await model;
  if (!resolved) {
    throw new Error("Missing model");
  }
  return resolved;
}

let queries: SiteQueries;
let context: SiteContext;

beforeAll(async () => {
  queries = buildTestQueries();
  context = await buildTestContext();
});

describe("image mock positive control", () => {
  it("exposes preload and loading on the rendered tag", () => {
    expect(imageTags('<img src="/a.webp" data-preload="true"/><img src="/b.webp" loading="eager"/>')).toEqual([
      { src: "/a.webp", preload: true, loading: null },
      { src: "/b.webp", preload: false, loading: "eager" },
    ]);
  });
});

describe("header logo", () => {
  it("loads the logo eagerly without preloading it", () => {
    const markup = renderToStaticMarkup(
      <Header siteName={context.settings.siteName} logo={context.settings.logo} navigation={context.navigation} />,
    );

    expect(imageTags(markup)).toEqual([{ src: context.settings.logo?.url, preload: false, loading: "eager" }]);
  });
});

describe("at most one preloaded image per page", () => {
  it("preloads only the hero image on the home page", async () => {
    const model = await getHomePageModel(queries, context);
    const markup = renderToStaticMarkup(<HomeView model={model} />);

    expect(imageTags(markup).length).toBeGreaterThan(5);
    expect(preloadedSources(markup)).toEqual([model.hero.heroImage?.url]);
  });

  it("preloads only the profile image on the about page", async () => {
    const model = await getAboutPageModel(queries, context);
    const markup = renderToStaticMarkup(<AboutView model={model} />);

    expect(imageTags(markup).length).toBeGreaterThan(1);
    expect(preloadedSources(markup)).toEqual([model.about.image?.url]);
  });

  it("preloads nothing on the services index and loads the first card row eagerly", async () => {
    const model = await requireModel(getServicesIndexModel(queries, context));
    const services = [...model.services, ...model.services.map((service) => ({ ...service, id: `${service.id}-b`, slug: `${service.slug}-b` }))];
    const markup = renderToStaticMarkup(<ServicesIndexView model={{ ...model, services }} />);

    expect(services.length).toBeGreaterThan(CARD_GRID_MAX_COLUMNS);
    expectFirstCardRowEager(markup, services.map((service) => service.cover?.url));
  });

  it("preloads nothing on the portfolio index and loads the first card row eagerly", async () => {
    const model = await requireModel(getPortfolioIndexModel(queries, context));
    const items = [...model.items, ...model.items.map((item) => ({ ...item, id: `${item.id}-b`, slug: `${item.slug}-b` }))];
    const markup = renderToStaticMarkup(<PortfolioIndexView model={{ ...model, items }} />);

    expect(items.length).toBeGreaterThan(CARD_GRID_MAX_COLUMNS);
    expectFirstCardRowEager(markup, items.map((item) => item.cover?.url));
  });

  it("preloads nothing on the articles index and loads the first card row eagerly, skipping missing covers", async () => {
    const model = await requireModel(getArticlesIndexModel(queries, context, 1));
    const withoutCover = model.items.filter((item) => item.article.cover === null);
    const copies = model.items.map((item) => ({ ...item, article: { ...item.article, id: `${item.article.id}-b`, slug: `${item.article.slug}-b` } }));
    const items = [...withoutCover, ...model.items.filter((item) => item.article.cover !== null), ...copies];
    const markup = renderToStaticMarkup(<ArticlesIndexView model={{ ...model, items }} />);

    expect(withoutCover.length).toBeGreaterThan(0);
    expect(items.length).toBeGreaterThan(CARD_GRID_MAX_COLUMNS);
    expectFirstCardRowEager(markup, items.map((item) => item.article.cover?.url));
  });

  it("preloads only the cover on the detail pages", async () => {
    const [service] = await queries.listServices();
    const [item] = await queries.listPortfolio();
    const articles = await queries.listAllArticles();
    const article = articles.find((candidate) => candidate.cover);
    const serviceModel = await requireModel(getServiceDetailModel(queries, context, service.slug));
    const portfolioModel = await requireModel(getPortfolioDetailModel(queries, context, item.slug));
    const articleModel = await requireModel(getArticleDetailModel(queries, context, article?.slug ?? ""));

    expect(preloadedSources(renderToStaticMarkup(<ServiceDetailView model={serviceModel} />))).toEqual([service.cover?.url]);
    expect(preloadedSources(renderToStaticMarkup(<PortfolioDetailView model={portfolioModel} />))).toEqual([item.cover?.url]);
    expect(preloadedSources(renderToStaticMarkup(<ArticleDetailView model={articleModel} />))).toEqual([article?.cover?.url]);
  });

  it("preloads nothing on pages without a page image", async () => {
    const contactModel = await getContactPageModel(queries, context);
    const legalModel = await requireModel(getLegalPageModel(queries, context, "privasi"));

    expect(preloadedSources(renderToStaticMarkup(<ContactView model={contactModel} />))).toEqual([]);
    expect(preloadedSources(renderToStaticMarkup(<LegalView model={legalModel} />))).toEqual([]);
  });

  it("never marks an image inside a view as eager", async () => {
    const model = await getHomePageModel(queries, context);

    expect(imageTags(renderToStaticMarkup(<HomeView model={model} />)).filter((tag) => tag.loading === "eager")).toEqual([]);
  });
});
