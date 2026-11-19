export type RemoteImagePattern = {
  protocol: "http" | "https";
  hostname: string;
  port?: string;
  pathname: string;
};

const PUBLIC_MEDIA_PATHNAME = "/storage/v1/object/public/media/**";

export function buildSupabaseImagePatterns(supabaseUrl: string | undefined): RemoteImagePattern[] {
  if (!supabaseUrl) {
    return [];
  }

  try {
    const parsed = new URL(supabaseUrl);
    const protocol = parsed.protocol === "http:" ? "http" : "https";
    return [{ protocol, hostname: parsed.hostname, ...(parsed.port ? { port: parsed.port } : {}), pathname: PUBLIC_MEDIA_PATHNAME }];
  } catch {
    return [];
  }
}
