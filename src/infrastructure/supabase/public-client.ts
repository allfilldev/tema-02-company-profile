import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { DataClient } from "@/infrastructure/supabase/public-repositories";

export type PublicSupabaseConfig = {
  url: string;
  publishableKey: string;
};

export function createPublicSupabaseClient(config: PublicSupabaseConfig): DataClient {
  return createClient(config.url, config.publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  }) as unknown as DataClient;
}
