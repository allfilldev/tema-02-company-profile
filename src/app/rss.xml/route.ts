import { themeConfig } from "@/config/theme";
import { getSiteQueries } from "@/server/container";
import { getSiteContext } from "@/server/site/site-context";
import { getSiteEnv } from "@/server/site/site-env";
import { getRssXml } from "@/server/site/technical";

export async function GET(): Promise<Response> {
  const queries = getSiteQueries();
  const context = await getSiteContext(queries, getSiteEnv(), themeConfig);
  const xml = await getRssXml(queries, context);

  if (xml === null) {
    return new Response(null, { status: 404 });
  }

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
