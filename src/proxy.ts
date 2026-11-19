import { NextResponse, type NextRequest } from "next/server";
import { themeConfig } from "@/config/theme";
import { decideAdminAccess } from "@/lib/site/admin-access";
import { isSitePathAvailable, NOT_FOUND_REWRITE_PATH } from "@/lib/site/route-availability";
import { ADMIN_ROUTES, isUnderRoute } from "@/lib/site/routes";
import { getSiteQueries } from "@/server/container";
import { getSiteRouteCatalog } from "@/server/site/route-catalog";
import { resolvePathAvailability } from "@/server/site/resolve-availability";
import { isDemoDataSource } from "@/server/site/site-env";
import { getSupabaseRouteCatalogMemo } from "@/server/site/supabase-route-catalog";
import { updateAdminSession } from "@/server/supabase/proxy-session";

function notFoundResponse(request: NextRequest): NextResponse {
  return NextResponse.rewrite(new URL(NOT_FOUND_REWRITE_PATH, request.url));
}

async function guardAdmin(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;

  if (decideAdminAccess({ pathname, isDemo: isDemoDataSource(), hasSession: false }) === "not-found") {
    return notFoundResponse(request);
  }

  try {
    const { response, hasSession } = await updateAdminSession(request);
    const access = decideAdminAccess({ pathname, isDemo: false, hasSession });

    if (access === "login") {
      return NextResponse.redirect(new URL(ADMIN_ROUTES.login, request.url));
    }
    return response;
  } catch {
    return notFoundResponse(request);
  }
}

async function isSlugPathAvailable(pathname: string): Promise<boolean> {
  if (isDemoDataSource()) {
    return isSitePathAvailable(pathname, await getSiteRouteCatalog(getSiteQueries(), themeConfig));
  }
  return resolvePathAvailability(pathname, getSupabaseRouteCatalogMemo());
}

async function guardSlugs(request: NextRequest): Promise<NextResponse> {
  try {
    if (await isSlugPathAvailable(request.nextUrl.pathname)) {
      return NextResponse.next();
    }
    return notFoundResponse(request);
  } catch {
    return NextResponse.next();
  }
}

export async function proxy(request: NextRequest) {
  if (isUnderRoute(request.nextUrl.pathname, ADMIN_ROUTES.root)) {
    return guardAdmin(request);
  }
  return guardSlugs(request);
}

export const config = {
  matcher: ["/layanan/:path*", "/portofolio/:path*", "/artikel/:path*", "/admin/:path*"],
};
