import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it } from "vitest";
import { ArticleCard } from "@/components/site/sections/article-card";
import { Pagination } from "@/components/site/sections/pagination";
import { ArticleDetailView } from "@/components/site/views/article-detail-view";
import { ArticlesIndexView } from "@/components/site/views/articles-index-view";
import type { ModuleKey } from "@/core/domain/shared/module-key";
import { formatIndonesianDate } from "@/lib/text/format-date";
import {
  getArticleDetailModel,
  getArticlesIndexModel,
  type ArticleDetailModel,
  type ArticlesIndexModel,
} from "@/server/site/models/articles";
import {
  anchorTags,
  countOccurrences,
  expectCompleteImages,
  expectMeaningfulAnchors,
  expectValidHeadingOutline,
  headingsOf,
  hrefsOf,
} from "../../fixtures/markup";
import { buildTestPack } from "../../fixtures/content-pack";
import { buildTestContext, buildTestQueries } from "../../fixtures/site";

const [LATEST_ARTICLE, EARLIER_ARTICLE] = buildTestPack().articles;
const PAGE_HREFS = ["/artikel", "/artikel/halaman/2", "/artikel/halaman/3"];

let articlesIndex: ArticlesIndexModel;
let articleDetail: ArticleDetailModel;
let articleWithoutRelated: ArticleDetailModel;

async function requireModel<Model>(model: Promise<Model | null>): Promise<Model> {
  const resolved = await model;
  if (!resolved) {
    throw new Error("Missing model");
  }
  return resolved;
}

function renderPagination(page: number): string {
  return renderToStaticMarkup(<Pagination page={page} pageCount={PAGE_HREFS.length} pageHrefs={PAGE_HREFS} />);
}

function timeTagPattern(isoDate: string): RegExp {
  return new RegExp(`<time datetime="${isoDate}">${formatIndonesianDate(isoDate)}</time>`, "i");
}

function anchorWithHref(markup: string, href: string): string | undefined {
  return anchorTags(markup).find((tag) => tag.includes(`href="${href}"`));
}

beforeAll(async () => {
  const queries = buildTestQueries();
  const context = await buildTestContext();
  articlesIndex = await requireModel(getArticlesIndexModel(queries, context, 1));
  articleDetail = await requireModel(getArticleDetailModel(queries, context, LATEST_ARTICLE.slug));
  articleWithoutRelated = { ...articleDetail, related: [] };
});

describe("Pagination", () => {
  it("renders a labeled nav and marks only the active page with aria-current", () => {
    for (const page of [1, 2, 3]) {
      const markup = renderPagination(page);

      expect(markup).toMatch(/<nav\b[^>]*aria-label="Halaman artikel"/);
      expect(countOccurrences(markup, 'aria-current="page"')).toBe(1);
      expect(markup).toMatch(new RegExp(`<[a-z]+\\b[^>]*aria-current="page"[^>]*>${page}</[a-z]+>`));
    }
  });

  it("uses the hrefs from pageHrefs for every page link", () => {
    const markup = renderPagination(2);

    expect(hrefsOf(markup)).toEqual(expect.arrayContaining(["/artikel", "/artikel/halaman/3"]));
    expect(hrefsOf(markup)).not.toContain("/artikel/halaman/2");
    expect(anchorWithHref(markup, "/artikel/halaman/3")).toBeDefined();
  });

  it("has rel=next only when a next page exists and rel=prev only when a previous page exists", () => {
    const first = renderPagination(1);
    const middle = renderPagination(2);
    const last = renderPagination(3);

    expect(countOccurrences(first, 'rel="next"')).toBe(1);
    expect(countOccurrences(first, 'rel="prev"')).toBe(0);
    expect(countOccurrences(middle, 'rel="next"')).toBe(1);
    expect(countOccurrences(middle, 'rel="prev"')).toBe(1);
    expect(countOccurrences(last, 'rel="next"')).toBe(0);
    expect(countOccurrences(last, 'rel="prev"')).toBe(1);
  });

  it("points rel=prev and rel=next at the neighboring page hrefs", () => {
    const markup = renderPagination(2);
    const previous = anchorTags(markup).find((tag) => tag.includes('rel="prev"'));
    const next = anchorTags(markup).find((tag) => tag.includes('rel="next"'));

    expect(previous).toContain('href="/artikel"');
    expect(next).toContain('href="/artikel/halaman/3"');
  });

  it("renders nothing when there is a single page", () => {
    expect(renderToStaticMarkup(<Pagination page={1} pageCount={1} pageHrefs={["/artikel"]} />)).toBe("");
  });

  it("gives every link readable text", () => {
    const markup = renderPagination(2);

    expectMeaningfulAnchors(markup);
    for (const tag of anchorTags(markup)) {
      expect(tag).toMatch(/\bhref="\/artikel[^"]*"/);
    }
  });
});

describe("ArticleCard", () => {
  const item = { article: LATEST_ARTICLE, author: buildTestPack().team[0] };

  it("shows the cover, the title as an h3 link, the lead, the author name, and the date", () => {
    const markup = renderToStaticMarkup(<ArticleCard item={item} />);

    expect(markup).toMatch(
      new RegExp(`<h3[^>]*><a\\b[^>]*href="/artikel/${LATEST_ARTICLE.slug}"[^>]*>${LATEST_ARTICLE.title}</a></h3>`),
    );
    expect(markup).toContain(LATEST_ARTICLE.lead);
    expect(markup).toContain(item.author.name);
    expect(markup).toMatch(timeTagPattern(LATEST_ARTICLE.publishedAt));
    expectCompleteImages(markup);
  });

  it("omits the image when the article has no cover", () => {
    const markup = renderToStaticMarkup(<ArticleCard item={{ ...item, article: { ...EARLIER_ARTICLE } }} />);

    expect(EARLIER_ARTICLE.cover).toBeNull();
    expect(markup).not.toContain("<img");
    expect(markup).toContain(EARLIER_ARTICLE.title);
  });
});

describe("ArticlesIndexView", () => {
  it("renders exactly one h1 from the intro, an h2 for the list, and an h3 per article", () => {
    const markup = renderToStaticMarkup(<ArticlesIndexView model={articlesIndex} />);
    const headings = headingsOf(markup);

    expect(countOccurrences(markup, "<h1")).toBe(1);
    expect(headings[0]).toEqual({ level: 1, text: articlesIndex.intro.title });
    expectValidHeadingOutline(markup);
    expect(headings.filter(({ level }) => level === 3).map(({ text }) => text)).toEqual(
      articlesIndex.items.map(({ article }) => article.title),
    );
  });

  it("links every card to the article, shows the author name and the date", () => {
    const markup = renderToStaticMarkup(<ArticlesIndexView model={articlesIndex} />);

    expect(articlesIndex.items.length).toBeGreaterThan(1);
    for (const { article, author } of articlesIndex.items) {
      expect(hrefsOf(markup)).toContain(`/artikel/${article.slug}`);
      expect(markup).toContain(author.name);
      expect(markup).toMatch(timeTagPattern(article.publishedAt));
    }
    expectMeaningfulAnchors(markup);
  });

  it("renders no pagination for a single page", () => {
    const markup = renderToStaticMarkup(<ArticlesIndexView model={articlesIndex} />);

    expect(articlesIndex.pageCount).toBe(1);
    expect(markup).not.toContain("<nav");
  });

  it("renders the pagination from the model when there are several pages", () => {
    const model: ArticlesIndexModel = { ...articlesIndex, page: 2, pageCount: 3, pageHrefs: PAGE_HREFS };
    const markup = renderToStaticMarkup(<ArticlesIndexView model={model} />);

    expect(markup).toMatch(/<nav\b[^>]*aria-label="Halaman artikel"/);
    expect(countOccurrences(markup, 'aria-current="page"')).toBe(1);
    expect(countOccurrences(markup, 'rel="next"')).toBe(1);
    expect(countOccurrences(markup, 'rel="prev"')).toBe(1);
    expectValidHeadingOutline(markup);
  });

  it("renders only the hero when there are no articles", () => {
    const markup = renderToStaticMarkup(<ArticlesIndexView model={{ ...articlesIndex, items: [] }} />);

    expect(headingsOf(markup).map(({ level }) => level)).toEqual([1]);
  });
});

describe("ArticleDetailView", () => {
  it("renders exactly one h1 with the article title and an ordered outline", () => {
    const markup = renderToStaticMarkup(<ArticleDetailView model={articleDetail} />);

    expect(countOccurrences(markup, "<h1")).toBe(1);
    expect(headingsOf(markup)[0]).toEqual({ level: 1, text: LATEST_ARTICLE.title });
    expectValidHeadingOutline(markup);
    expect(headingsOf(markup).some(({ level, text }) => level === 2 && text === "Apa yang perlu dilihat dari portofolio?")).toBe(
      true,
    );
  });

  it("shows the author byline with rel=author and the author box with the bio id", () => {
    const markup = renderToStaticMarkup(<ArticleDetailView model={articleDetail} />);
    const byline = anchorTags(markup).find((tag) => tag.includes('rel="author"'));

    expect(countOccurrences(markup, 'rel="author"')).toBe(1);
    expect(byline).toContain('href="/tentang"');
    expect(countOccurrences(markup, 'id="author-bio"')).toBe(1);
    expect(headingsOf(markup).some(({ level, text }) => level === 2 && text === "Tentang penulis")).toBe(true);
    expect(markup).toContain(articleDetail.article.author.bio);
  });

  it("links the author box to the editorial policy", () => {
    const markup = renderToStaticMarkup(<ArticleDetailView model={articleDetail} />);
    const box = markup.slice(markup.indexOf('id="author-bio"'));

    expect(hrefsOf(box)).toContain("/kebijakan-editorial");
  });

  it("shows the published and the updated date as two time elements with datetime", () => {
    const markup = renderToStaticMarkup(<ArticleDetailView model={articleDetail} />);

    expect(countOccurrences(markup, "<time")).toBe(2);
    expect(markup).toMatch(timeTagPattern(LATEST_ARTICLE.publishedAt));
    expect(markup).toMatch(timeTagPattern(LATEST_ARTICLE.updatedAt));
  });

  it("does not add an h1 when the markdown body starts with one", () => {
    const bodyMd = "# Judul di dalam isi\n\n## Bagian pertama\n\nIsi bagian pertama.";
    const markup = renderToStaticMarkup(
      <ArticleDetailView model={{ ...articleDetail, article: { ...articleDetail.article, bodyMd } }} />,
    );

    expect(countOccurrences(markup, "<h1")).toBe(1);
    expect(headingsOf(markup).find(({ text }) => text === "Judul di dalam isi")?.level).toBe(2);
    expectValidHeadingOutline(markup);
  });

  it("renders the faq as an h2 with one h3 per question", () => {
    const headings = headingsOf(renderToStaticMarkup(<ArticleDetailView model={articleDetail} />));
    const questions = LATEST_ARTICLE.faq.map((item) => item.question);

    expect(questions.length).toBeGreaterThan(0);
    expect(headings.some(({ level, text }) => level === 2 && text === "Pertanyaan yang sering diajukan")).toBe(true);
    expect(headings.filter(({ level }) => level === 3).map(({ text }) => text)).toEqual(
      expect.arrayContaining(questions),
    );
    const withoutFaq = renderToStaticMarkup(
      <ArticleDetailView model={{ ...articleDetail, article: { ...articleDetail.article, faq: [] } }} />,
    );
    expect(withoutFaq).not.toContain("Pertanyaan yang sering diajukan");
    expectValidHeadingOutline(withoutFaq);
  });

  it("lists the related articles as links whose text is the article title", () => {
    const markup = renderToStaticMarkup(<ArticleDetailView model={articleDetail} />);

    expect(articleDetail.related.length).toBeGreaterThan(0);
    expect(headingsOf(markup).some(({ level, text }) => level === 2 && text === "Artikel terkait")).toBe(true);
    for (const related of articleDetail.related) {
      expect(markup).toMatch(new RegExp(`<a\\b[^>]*href="/artikel/${related.slug}"[^>]*>${related.title}</a>`));
    }
    expect(hrefsOf(markup)).not.toContain(`/artikel/${LATEST_ARTICLE.slug}`);
    expectMeaningfulAnchors(markup);
  });

  it("renders no related section when there are no related articles", () => {
    const markup = renderToStaticMarkup(<ArticleDetailView model={articleWithoutRelated} />);

    expect(markup).not.toContain("Artikel terkait");
    expectValidHeadingOutline(markup);
  });

  it("places the author box after the article element so it sits below the article on small screens", () => {
    const markup = renderToStaticMarkup(<ArticleDetailView model={articleDetail} />);

    const bodyHeading = markup.indexOf("Apa yang perlu dilihat dari portofolio?");

    expect(countOccurrences(markup, "<article")).toBe(1);
    expect(markup.indexOf("<article")).toBeLessThan(bodyHeading);
    expect(bodyHeading).toBeLessThan(markup.indexOf("</article>"));
    expect(markup.indexOf("</article>")).toBeLessThan(markup.indexOf('id="author-bio"'));
  });

  it("gives every image a source, alt text, width, and height", () => {
    expectCompleteImages(renderToStaticMarkup(<ArticleDetailView model={articleDetail} />));
  });
});

describe("article views and disabled modules", () => {
  async function loadArticleModels(enabledModules: ModuleKey[]) {
    const theme = { enabledModules };
    const queries = buildTestQueries(theme);
    const context = await buildTestContext({ theme });
    return {
      index: await getArticlesIndexModel(queries, context, 1),
      detail: await getArticleDetailModel(queries, context, LATEST_ARTICLE.slug),
    };
  }

  it("has no model when the articles module is disabled", async () => {
    const { index, detail } = await loadArticleModels(["services", "portfolio"]);

    expect(index).toBeNull();
    expect(detail).toBeNull();
  });

  it("links only to article routes from the model and to the always-on trust pages", async () => {
    const { index, detail } = await loadArticleModels(["articles"]);
    if (!index || !detail) {
      throw new Error("Missing article models");
    }
    const hrefs = [
      ...hrefsOf(renderToStaticMarkup(<ArticlesIndexView model={index} />)),
      ...hrefsOf(renderToStaticMarkup(<ArticleDetailView model={detail} />)),
    ];
    const allowed = new Set([
      ...index.items.map(({ article }) => `/artikel/${article.slug}`),
      ...detail.related.map((article) => `/artikel/${article.slug}`),
      "/tentang",
      "/kontak",
      "/kebijakan-editorial",
    ]);

    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs.filter((href) => href.startsWith("/artikel/")).length).toBeGreaterThan(0);
    expect(hrefs.filter((href) => !allowed.has(href))).toEqual([]);
    expect(hrefs.filter((href) => href.startsWith("/layanan") || href.startsWith("/portofolio"))).toEqual([]);
  });
});
