import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/contract/breadcrumbs";
import { JsonLd } from "@/components/site/contract/json-ld";
import { ArticlesIndexView } from "@/components/site/views/articles-index-view";
import { Container } from "@/components/ui/container";
import { themeConfig } from "@/config/theme";
import { parseArticlePageParam } from "@/lib/site/article-pages";
import { getSiteQueries } from "@/server/container";
import { getArticlesIndexModel } from "@/server/site/models/articles";
import { getSiteContext } from "@/server/site/site-context";
import { getSiteEnv } from "@/server/site/site-env";

type ArticlePagesProps = {
  params: Promise<{ n: string }>;
};

export const instant = false;

const FIRST_PAGINATED_PAGE = 2;

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
  const pageCount = articlePage?.pageCount ?? 1;
  const pages = Array.from({ length: Math.max(pageCount - 1, 0) }, (_, index) => index + FIRST_PAGINATED_PAGE);
  return (pages.length > 0 ? pages : [FIRST_PAGINATED_PAGE]).map((page) => ({ n: String(page) }));
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
      <Container className="pt-4">
        <Breadcrumbs items={model.seo.breadcrumbs} />
      </Container>
      <ArticlesIndexView model={model} />
    </>
  );
}
