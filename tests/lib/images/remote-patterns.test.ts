import { describe, expect, it } from "vitest";
import { buildSupabaseImagePatterns } from "@/lib/images/remote-patterns";

describe("buildSupabaseImagePatterns", () => {
  it("allows only the public media path of the project host", () => {
    expect(buildSupabaseImagePatterns("https://abcdef.supabase.co")).toEqual([
      { protocol: "https", hostname: "abcdef.supabase.co", pathname: "/storage/v1/object/public/media/**" },
    ]);
  });

  it("keeps the port and http protocol of a local project", () => {
    expect(buildSupabaseImagePatterns("http://localhost:54321")).toEqual([
      { protocol: "http", hostname: "localhost", port: "54321", pathname: "/storage/v1/object/public/media/**" },
    ]);
  });

  it("returns no patterns when the url is missing or invalid", () => {
    expect(buildSupabaseImagePatterns(undefined)).toEqual([]);
    expect(buildSupabaseImagePatterns("")).toEqual([]);
    expect(buildSupabaseImagePatterns("not a url")).toEqual([]);
  });
});
