import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";
import { buildSecurityHeaders } from "@/lib/security/headers";

const EXPECTED_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
];

function valueOf(headers: { key: string; value: string }[], key: string): string | undefined {
  return headers.find((header) => header.key === key)?.value;
}

describe("buildSecurityHeaders", () => {
  it("returns exactly the five security headers with their exact values", () => {
    expect(buildSecurityHeaders()).toEqual(EXPECTED_HEADERS);
  });

  it("sets a strict transport security max-age of at least one year", () => {
    const hsts = valueOf(buildSecurityHeaders(), "Strict-Transport-Security");
    const maxAge = Number(/max-age=(\d+)/.exec(hsts ?? "")?.[1]);

    expect(maxAge).toBeGreaterThanOrEqual(31536000);
  });

  it("does not declare preload", () => {
    expect(valueOf(buildSecurityHeaders(), "Strict-Transport-Security")).not.toMatch(/preload/i);
  });

  it("never repeats a header key", () => {
    const keys = buildSecurityHeaders().map((header) => header.key.toLowerCase());

    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(["a", "b", "a"]).size).not.toBe(3);
  });

  it("only restricts framing in the content security policy so maps, analytics and json-ld keep working", () => {
    const policy = valueOf(buildSecurityHeaders(), "Content-Security-Policy");

    expect(policy).toBe("frame-ancestors 'self'");
    expect(policy).not.toMatch(/script-src|default-src|frame-src|connect-src/);
  });
});

describe("next.config headers", () => {
  it("applies the security headers to every route", async () => {
    const rules = (await nextConfig.headers?.()) ?? [];
    const rule = rules.find((entry) => entry.source === "/(.*)");

    expect(rule).toBeDefined();
    expect(rule?.headers).toEqual(buildSecurityHeaders());
  });

  it("keeps cache components, partial prefetching, and the turbopack css rule", () => {
    expect(nextConfig.cacheComponents).toBe(true);
    expect(nextConfig.partialPrefetching).toBe(true);
    expect(nextConfig.turbopack?.rules?.["*.css"]).toEqual({
      loaders: ["@tailwindcss/turbopack"],
      as: "*.css",
    });
  });
});
