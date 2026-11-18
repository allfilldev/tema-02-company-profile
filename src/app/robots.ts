import type { MetadataRoute } from "next";
import { buildRobots } from "@/lib/seo/robots";
import { getSiteEnv } from "@/server/site/site-env";

export default function robots(): MetadataRoute.Robots {
  return buildRobots(getSiteEnv());
}
