import { NextResponse, type NextRequest } from "next/server";
import { themeConfig } from "@/config/theme";
import { isSitePathAvailable, NOT_FOUND_REWRITE_PATH } from "@/lib/site/route-availability";
import { getSiteQueries } from "@/server/container";
import { getSiteRouteCatalog } from "@/server/site/route-catalog";

export async function proxy(request: NextRequest) {
  const catalog = await getSiteRouteCatalog(getSiteQueries(), themeConfig);

  if (isSitePathAvailable(request.nextUrl.pathname, catalog)) {
    return NextResponse.next();
  }
  return NextResponse.rewrite(new URL(NOT_FOUND_REWRITE_PATH, request.url));
}

export const config = {
  matcher: ["/layanan/:path*", "/portofolio/:path*", "/artikel/:path*"],
};
