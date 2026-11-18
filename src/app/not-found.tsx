import type { Metadata } from "next";
import { RouteShellGuard } from "@/components/site/layout/route-guard";
import { SiteShell } from "@/components/site/layout/site-shell";
import { NotFoundView } from "@/components/site/views/not-found-view";
import { themeConfig } from "@/config/theme";
import { getSiteQueries } from "@/server/container";
import { buildNotFoundMetadata } from "@/server/site/models/not-found";
import { getSiteContext } from "@/server/site/site-context";
import { getSiteEnv } from "@/server/site/site-env";

async function loadContext() {
  return getSiteContext(getSiteQueries(), getSiteEnv(), themeConfig);
}

export async function generateMetadata(): Promise<Metadata> {
  const context = await loadContext();
  return buildNotFoundMetadata(context.seoSite);
}

export default async function RootNotFound() {
  const context = await loadContext();

  return (
    <RouteShellGuard>
      <SiteShell context={context}>
        <NotFoundView />
      </SiteShell>
    </RouteShellGuard>
  );
}
