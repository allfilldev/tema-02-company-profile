import "server-only";

export type SupabasePublicEnv = {
  url: string;
  publishableKey: string;
};

function isAllowedUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    if (parsed.protocol === "https:") {
      return true;
    }
    return parsed.protocol === "http:" && (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1");
  } catch {
    return false;
  }
}

export function getSupabasePublicEnv(): SupabasePublicEnv {
  const url = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !isAllowedUrl(url)) {
    throw new Error("SUPABASE_URL must be set to an https url (or http://localhost)");
  }
  if (!publishableKey) {
    throw new Error("SUPABASE_PUBLISHABLE_KEY must be set");
  }

  return { url, publishableKey };
}
