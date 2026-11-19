import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/site/contract/json-ld";
import { BreadcrumbBar } from "@/components/site/sections/breadcrumb-bar";
import { ServicesIndexView } from "@/components/site/views/services-index-view";
import { themeConfig } from "@/config/theme";
import { getSiteQueries } from "@/server/container";
import { getServicesIndexModel } from "@/server/site/models/services";
import { getSiteContext } from "@/server/site/site-context";
import { getSiteEnv } from "@/server/site/site-env";

async function loadServicesModel() {
  const queries = getSiteQueries();
  const context = await getSiteContext(queries, getSiteEnv(), themeConfig);
  const model = await getServicesIndexModel(queries, context);
  if (!model) {
    notFound();
  }
  return model;
}

export async function generateMetadata(): Promise<Metadata> {
  const model = await loadServicesModel();
  return model.seo.metadata;
}

export default async function ServicesPage() {
  const model = await loadServicesModel();

  return (
    <>
      <JsonLd data={model.seo.jsonLd} />
      <BreadcrumbBar items={model.seo.breadcrumbs} />
      <ServicesIndexView model={model} />
    </>
  );
}
