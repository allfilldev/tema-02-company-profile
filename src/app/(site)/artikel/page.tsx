import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/contract/breadcrumbs";
import { JsonLd } from "@/components/site/contract/json-ld";
import { ArticlesIndexView } from "@/components/site/views/articles-index-view";
import { Container } from "@/components/ui/container";
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
      <Container className="pt-4">
        <Breadcrumbs items={model.seo.breadcrumbs} />
      </Container>
      <ArticlesIndexView model={model} />
    </>
  );
}
