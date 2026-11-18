import { themeConfig } from "@/config/theme";
import { getSiteQueries } from "@/server/container";
import { getSiteContext } from "@/server/site/site-context";
import { getSiteEnv } from "@/server/site/site-env";
import { getLlmsTxt } from "@/server/site/technical";

export async function GET(): Promise<Response> {
  const queries = getSiteQueries();
  const context = await getSiteContext(queries, getSiteEnv(), themeConfig);
  const text = await getLlmsTxt(queries, context);

  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
