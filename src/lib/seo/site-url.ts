const DEFAULT_SITE_URL = "http://localhost:3000";

export type SiteUrlOptions = {
  requireExplicit: boolean;
};

const LOOPBACK_HOSTNAMES = ["localhost", "127.0.0.1", "[::1]"];

function isLocalHostname(hostname: string): boolean {
  return LOOPBACK_HOSTNAMES.includes(hostname) || hostname.endsWith(".localhost");
}

export function shouldRequireExplicitSiteUrl(nodeEnv: string | undefined, indexingEnabled: boolean): boolean {
  return nodeEnv === "production" && indexingEnabled;
}

export function resolveSiteUrl(raw: string | undefined, options: SiteUrlOptions = { requireExplicit: false }): string {
  const value = raw?.trim();
  if (!value) {
    if (options.requireExplicit) {
      throw new Error("SITE_URL wajib diisi saat build produksi dengan SITE_INDEXING=on");
    }
    return DEFAULT_SITE_URL;
  }
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`SITE_URL bukan URL yang valid: ${value}`);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`SITE_URL harus memakai http atau https: ${value}`);
  }
  if (parsed.pathname !== "/" || value.includes("?") || value.includes("#")) {
    throw new Error(`SITE_URL tidak boleh memuat path, query, atau hash: ${value}`);
  }
  if (options.requireExplicit && isLocalHostname(parsed.hostname)) {
    throw new Error(`SITE_URL tidak boleh mengarah ke localhost saat build produksi dengan SITE_INDEXING=on: ${value}`);
  }
  return value.replace(/\/+$/, "");
}

export function resolveIndexing(raw: string | undefined): boolean {
  return raw === "on";
}

export function absoluteUrl(siteUrl: string, path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`Path harus diawali garis miring: ${path}`);
  }
  const base = siteUrl.replace(/\/+$/, "");
  if (path === "/") {
    return `${base}/`;
  }
  return `${base}${path.replace(/\/+$/, "")}`;
}

export function absoluteAssetUrl(siteUrl: string, url: string): string {
  if (/^https?:\/\//.test(url)) {
    return url;
  }
  return absoluteUrl(siteUrl, url);
}
