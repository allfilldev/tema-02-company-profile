import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getSupabasePublicEnv } from "@/server/supabase/supabase-env";

describe("getSupabasePublicEnv", () => {
  beforeEach(() => {
    vi.stubEnv("SUPABASE_URL", "https://abc.supabase.co");
    vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "sb_publishable_key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns the url and the publishable key", () => {
    expect(getSupabasePublicEnv()).toEqual({ url: "https://abc.supabase.co", publishableKey: "sb_publishable_key" });
  });

  it("accepts a localhost http url", () => {
    vi.stubEnv("SUPABASE_URL", "http://localhost:54321");

    expect(getSupabasePublicEnv().url).toBe("http://localhost:54321");
  });

  it("names the missing url variable", () => {
    vi.stubEnv("SUPABASE_URL", "");

    expect(() => getSupabasePublicEnv()).toThrow(/SUPABASE_URL/);
  });

  it("names the missing key variable", () => {
    vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "");

    expect(() => getSupabasePublicEnv()).toThrow(/SUPABASE_PUBLISHABLE_KEY/);
  });

  it.each(["ftp://abc.supabase.co", "http://abc.supabase.co", "not a url"])("rejects the url %s", (url) => {
    vi.stubEnv("SUPABASE_URL", url);

    expect(() => getSupabasePublicEnv()).toThrow(/SUPABASE_URL/);
  });
});
