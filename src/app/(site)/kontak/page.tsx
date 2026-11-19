import type { Metadata } from "next";
import { JsonLd } from "@/components/site/contract/json-ld";
import { BreadcrumbBar } from "@/components/site/sections/breadcrumb-bar";
import { ContactView } from "@/components/site/views/contact-view";
import { themeConfig } from "@/config/theme";
import { getSiteQueries } from "@/server/container";
import { getContactPageModel } from "@/server/site/models/contact";
import { getSiteContext } from "@/server/site/site-context";
import { getSiteEnv } from "@/server/site/site-env";

async function loadContactModel() {
  const queries = getSiteQueries();
  const context = await getSiteContext(queries, getSiteEnv(), themeConfig);
  return getContactPageModel(queries, context);
}

export async function generateMetadata(): Promise<Metadata> {
  const model = await loadContactModel();
  return model.seo.metadata;
}

export default async function ContactPage() {
  const model = await loadContactModel();

  return (
    <>
      <JsonLd data={model.seo.jsonLd} />
      {model.seo.breadcrumbs.length > 1 ? (
        <BreadcrumbBar items={model.seo.breadcrumbs} />
      ) : null}
      <ContactView model={model} />
    </>
  );
}
