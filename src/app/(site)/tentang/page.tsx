import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/contract/breadcrumbs";
import { JsonLd } from "@/components/site/contract/json-ld";
import { AboutView } from "@/components/site/views/about-view";
import { Container } from "@/components/ui/container";
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
        <Container className="pt-4">
          <Breadcrumbs items={model.seo.breadcrumbs} />
        </Container>
      ) : null}
      <AboutView model={model} />
    </>
  );
}
