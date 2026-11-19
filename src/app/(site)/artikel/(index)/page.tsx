import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/site/contract/json-ld";
import { BreadcrumbBar } from "@/components/site/sections/breadcrumb-bar";
import { ArticlesIndexView } from "@/components/site/views/articles-index-view";
import { themeConfig } from "@/config/theme";
import { getSiteQueries } from "@/server/container";
import { getArticlesIndexModel } from "@/server/site/models/articles";
import { getSiteContext } from "@/server/site/site-context";
import { getSiteEnv } from "@/server/site/site-env";

const FIRST_PAGE = 1;

async function loadArticlesModel() {
  const queries = getSiteQueries();
  const context = await getSiteContext(queries, getSiteEnv(), themeConfig);
  const model = await getArticlesIndexModel(queries, context, FIRST_PAGE);
  if (!model) {
    notFound();
  }
  return model;
}

export async function generateMetadata(): Promise<Metadata> {
  const model = await loadArticlesModel();
  return model.seo.metadata;
}

export default async function ArticlesPage() {
  const model = await loadArticlesModel();

  return (
    <>
      <JsonLd data={model.seo.jsonLd} />
      <BreadcrumbBar items={model.seo.breadcrumbs} />
      <ArticlesIndexView model={model} />
    </>
  );
}
