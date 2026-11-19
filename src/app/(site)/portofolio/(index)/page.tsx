import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/site/contract/json-ld";
import { BreadcrumbBar } from "@/components/site/sections/breadcrumb-bar";
import { PortfolioIndexView } from "@/components/site/views/portfolio-index-view";
import { themeConfig } from "@/config/theme";
import { getSiteQueries } from "@/server/container";
import { getPortfolioIndexModel } from "@/server/site/models/portfolio";
import { getSiteContext } from "@/server/site/site-context";
import { getSiteEnv } from "@/server/site/site-env";

async function loadPortfolioModel() {
  const queries = getSiteQueries();
  const context = await getSiteContext(queries, getSiteEnv(), themeConfig);
  const model = await getPortfolioIndexModel(queries, context);
  if (!model) {
    notFound();
  }
  return model;
}

export async function generateMetadata(): Promise<Metadata> {
  const model = await loadPortfolioModel();
  return model.seo.metadata;
}

export default async function PortfolioPage() {
  const model = await loadPortfolioModel();

  return (
    <>
      <JsonLd data={model.seo.jsonLd} />
      <BreadcrumbBar items={model.seo.breadcrumbs} />
      <PortfolioIndexView model={model} />
    </>
  );
}
