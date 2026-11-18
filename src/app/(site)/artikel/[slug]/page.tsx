import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/contract/breadcrumbs";
import { JsonLd } from "@/components/site/contract/json-ld";
import { ArticleDetailView } from "@/components/site/views/article-detail-view";
import { Container } from "@/components/ui/container";
import { themeConfig } from "@/config/theme";
import { buildSlugStaticParams } from "@/lib/site/static-params";
import { getSiteQueries } from "@/server/container";
import { getArticleDetailModel, listArticleSlugs } from "@/server/site/models/articles";
import { getSiteContext } from "@/server/site/site-context";
import { getSiteEnv } from "@/server/site/site-env";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export const ensureStatic = "navigation";
export const instant = false;

async function loadArticleModel(params: ArticlePageProps["params"]) {
  const { slug } = await params;
  const queries = getSiteQueries();
  const context = await getSiteContext(queries, getSiteEnv(), themeConfig);
  const model = await getArticleDetailModel(queries, context, slug);
  if (!model) {
    notFound();
  }
  return model;
}

export async function generateStaticParams() {
  const slugs = await listArticleSlugs(getSiteQueries());
  return buildSlugStaticParams(slugs);
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const model = await loadArticleModel(params);
  return model.seo.metadata;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const model = await loadArticleModel(params);

  return (
    <>
      <JsonLd data={model.seo.jsonLd} />
      <Container className="pt-4">
        <Breadcrumbs items={model.seo.breadcrumbs} />
      </Container>
      <ArticleDetailView model={model} />
    </>
  );
}
