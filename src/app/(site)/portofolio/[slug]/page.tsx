import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/contract/breadcrumbs";
import { JsonLd } from "@/components/site/contract/json-ld";
import { PortfolioDetailView } from "@/components/site/views/portfolio-detail-view";
import { Container } from "@/components/ui/container";
import { themeConfig } from "@/config/theme";
import { buildSlugStaticParams } from "@/lib/site/static-params";
import { getSiteQueries } from "@/server/container";
import { getPortfolioDetailModel, listPortfolioSlugs } from "@/server/site/models/portfolio";
import { getSiteContext } from "@/server/site/site-context";
import { getSiteEnv } from "@/server/site/site-env";

type PortfolioPageProps = {
  params: Promise<{ slug: string }>;
};

export const ensureStatic = "navigation";
export const instant = false;

async function loadPortfolioDetailModel(params: PortfolioPageProps["params"]) {
  const { slug } = await params;
  const queries = getSiteQueries();
  const context = await getSiteContext(queries, getSiteEnv(), themeConfig);
  const model = await getPortfolioDetailModel(queries, context, slug);
  if (!model) {
    notFound();
  }
  return model;
}

export async function generateStaticParams() {
  const slugs = await listPortfolioSlugs(getSiteQueries());
  return buildSlugStaticParams(slugs);
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const model = await loadPortfolioDetailModel(params);
  return model.seo.metadata;
}

export default async function PortfolioDetailPage({ params }: PortfolioPageProps) {
  const model = await loadPortfolioDetailModel(params);

  return (
    <>
      <JsonLd data={model.seo.jsonLd} />
      <Container className="pt-4">
        <Breadcrumbs items={model.seo.breadcrumbs} />
      </Container>
      <PortfolioDetailView model={model} />
    </>
  );
}
