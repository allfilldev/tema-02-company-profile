import type { Metadata } from "next";
import { JsonLd } from "@/components/site/contract/json-ld";
import { HomeView } from "@/components/site/views/home-view";
import { themeConfig } from "@/config/theme";
import { getSiteQueries } from "@/server/container";
import { getHomePageModel } from "@/server/site/models/home";
import { getSiteContext } from "@/server/site/site-context";
import { getSiteEnv } from "@/server/site/site-env";

async function loadHomeModel() {
  const queries = getSiteQueries();
  const context = await getSiteContext(queries, getSiteEnv(), themeConfig);
  return getHomePageModel(queries, context);
}

export async function generateMetadata(): Promise<Metadata> {
  const model = await loadHomeModel();
  return model.seo.metadata;
}

export default async function HomePage() {
  const model = await loadHomeModel();

  return (
    <>
      <JsonLd data={model.seo.jsonLd} />
      <HomeView model={model} />
    </>
  );
}
