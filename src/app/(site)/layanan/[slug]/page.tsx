import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/contract/breadcrumbs";
import { JsonLd } from "@/components/site/contract/json-ld";
import { ServiceDetailView } from "@/components/site/views/service-detail-view";
import { Container } from "@/components/ui/container";
import { themeConfig } from "@/config/theme";
import { buildSlugStaticParams } from "@/lib/site/static-params";
import { getSiteQueries } from "@/server/container";
import { getServiceDetailModel, listServiceSlugs } from "@/server/site/models/services";
import { getSiteContext } from "@/server/site/site-context";
import { getSiteEnv } from "@/server/site/site-env";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export const ensureStatic = "navigation";
export const instant = false;

async function loadServiceModel(params: ServicePageProps["params"]) {
  const { slug } = await params;
  const queries = getSiteQueries();
  const context = await getSiteContext(queries, getSiteEnv(), themeConfig);
  const model = await getServiceDetailModel(queries, context, slug);
  if (!model) {
    notFound();
  }
  return model;
}

export async function generateStaticParams() {
  const slugs = await listServiceSlugs(getSiteQueries());
  return buildSlugStaticParams(slugs);
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const model = await loadServiceModel(params);
  return model.seo.metadata;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const model = await loadServiceModel(params);

  return (
    <>
      <JsonLd data={model.seo.jsonLd} />
      <Container className="pt-4">
        <Breadcrumbs items={model.seo.breadcrumbs} />
      </Container>
      <ServiceDetailView model={model} />
    </>
  );
}
