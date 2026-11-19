import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/site/contract/json-ld";
import { BreadcrumbBar } from "@/components/site/sections/breadcrumb-bar";
import { ArticlesIndexView } from "@/components/site/views/articles-index-view";
import { themeConfig } from "@/config/theme";
import { parseArticlePageParam } from "@/lib/site/article-pages";
import { buildArticlePageStaticParams } from "@/lib/site/static-params";
import { getSiteQueries } from "@/server/container";
import { getArticlesIndexModel } from "@/server/site/models/articles";
import { getSiteContext } from "@/server/site/site-context";
import { getSiteEnv } from "@/server/site/site-env";

type ArticlePagesProps = {
  params: Promise<{ n: string }>;
};

export const ensureStatic = "navigation";
export const instant = false;

async function loadArticlesPageModel(params: ArticlePagesProps["params"]) {
  const { n } = await params;
  const page = parseArticlePageParam(n);
  if (page === null) {
    notFound();
  }
  const queries = getSiteQueries();
  const context = await getSiteContext(queries, getSiteEnv(), themeConfig);
  const model = await getArticlesIndexModel(queries, context, page);
  if (!model) {
    notFound();
  }
  return model;
}

export async function generateStaticParams() {
  const articlePage = await getSiteQueries().listArticles(1);
  return buildArticlePageStaticParams(articlePage?.pageCount ?? 1);
}

export async function generateMetadata({ params }: ArticlePagesProps): Promise<Metadata> {
  const model = await loadArticlesPageModel(params);
  return model.seo.metadata;
}

export default async function ArticlesPaginatedPage({ params }: ArticlePagesProps) {
  const model = await loadArticlesPageModel(params);

  return (
    <>
      <JsonLd data={model.seo.jsonLd} />
      <BreadcrumbBar items={model.seo.breadcrumbs} />
      <ArticlesIndexView model={model} />
    </>
  );
}
