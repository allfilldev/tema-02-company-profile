import type { NextConfig } from "next";
import { buildSecurityHeaders } from "./src/lib/security/headers";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
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
