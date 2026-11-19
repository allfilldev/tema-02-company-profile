import type { NextConfig } from "next";
import { buildSupabaseImagePatterns } from "./src/lib/images/remote-patterns";
import { buildSecurityHeaders } from "./src/lib/security/headers";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    serverActions: { bodySizeLimit: "4mb" },
  },
  images: {
    remotePatterns: buildSupabaseImagePatterns(process.env.SUPABASE_URL),
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/(.*)", headers: buildSecurityHeaders() }];
  },
};

export default nextConfig;
