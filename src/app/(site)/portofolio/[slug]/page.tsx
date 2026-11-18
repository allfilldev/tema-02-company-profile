import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/contract/breadcrumbs";
import { JsonLd } from "@/components/site/contract/json-ld";
import { PortfolioDetailView } from "@/components/site/views/portfolio-detail-view";
import { Container } from "@/components/ui/container";
import { themeConfig } from "@/config/theme";
import { getSiteQueries } from "@/server/container";
import { getPortfolioDetailModel, listPortfolioSlugs } from "@/server/site/models/portfolio";
import { getSiteContext } from "@/server/site/site-context";
import { getSiteEnv } from "@/server/site/site-env";

type PortfolioPageProps = {
  params: Promise<{ slug: string }>;
};

export const instant = false;

const PLACEHOLDER_SLUG = "tidak-ditemukan";

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
  return (slugs.length > 0 ? slugs : [PLACEHOLDER_SLUG]).map((slug) => ({ slug }));
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
