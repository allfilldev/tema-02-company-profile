import type { Metadata } from "next";
import { JsonLd } from "@/components/site/contract/json-ld";
import { BreadcrumbBar } from "@/components/site/sections/breadcrumb-bar";
import { AboutView } from "@/components/site/views/about-view";
import { themeConfig } from "@/config/theme";
import { getSiteQueries } from "@/server/container";
import { getAboutPageModel } from "@/server/site/models/about";
import { getSiteContext } from "@/server/site/site-context";
import { getSiteEnv } from "@/server/site/site-env";

async function loadAboutModel() {
  const queries = getSiteQueries();
  const context = await getSiteContext(queries, getSiteEnv(), themeConfig);
  return getAboutPageModel(queries, context);
}

export async function generateMetadata(): Promise<Metadata> {
  const model = await loadAboutModel();
  return model.seo.metadata;
}

export default async function AboutPage() {
  const model = await loadAboutModel();

  return (
    <>
      <JsonLd data={model.seo.jsonLd} />
      {model.seo.breadcrumbs.length > 1 ? (
        <BreadcrumbBar items={model.seo.breadcrumbs} />
      ) : null}
      <AboutView model={model} />
    </>
  );
}
