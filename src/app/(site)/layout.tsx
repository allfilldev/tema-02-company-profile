import type { ReactNode } from "react";
import { JsonLd } from "@/components/site/contract/json-ld";
import { SiteShell } from "@/components/site/layout/site-shell";
import { themeConfig } from "@/config/theme";
import { getSiteQueries } from "@/server/container";
import { getSiteContext } from "@/server/site/site-context";
import { getSiteEnv } from "@/server/site/site-env";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const context = await getSiteContext(getSiteQueries(), getSiteEnv(), themeConfig);

  return (
    <>
      <JsonLd data={context.organizationJsonLd} />
      <JsonLd data={context.webSiteJsonLd} />
      <SiteShell context={context}>{children}</SiteShell>
    </>
  );
}
