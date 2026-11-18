const DEFAULT_SITE_URL = "http://localhost:3000";

export function resolveSiteUrl(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) {
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
