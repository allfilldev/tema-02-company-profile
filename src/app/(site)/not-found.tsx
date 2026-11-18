import type { Metadata } from "next";
import { NotFoundView } from "@/components/site/views/not-found-view";
import { themeConfig } from "@/config/theme";
import { getSiteQueries } from "@/server/container";
import { buildNotFoundMetadata } from "@/server/site/models/not-found";
import { getSiteContext } from "@/server/site/site-context";
import { getSiteEnv } from "@/server/site/site-env";

export async function generateMetadata(): Promise<Metadata> {
  const context = await getSiteContext(getSiteQueries(), getSiteEnv(), themeConfig);
  return buildNotFoundMetadata(context.seoSite);
}

export default function SiteNotFound() {
  return <NotFoundView />;
}
