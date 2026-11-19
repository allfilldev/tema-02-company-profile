import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ rpc: vi.fn(), headers: vi.fn() }));

vi.mock("next/headers", () => ({ headers: mocks.headers }));
vi.mock("@/infrastructure/supabase/public-client", () => ({
  createPublicSupabaseClient: () => ({ rpc: mocks.rpc }),
}));

import { submitContactMessage } from "@/server/actions/site/contact";
import { hashIp } from "@/lib/site/ip-hash";

const VALUES = { name: "Rina Wulandari", email: "rina@contoh.id", phone: "", message: "Saya ingin berkonsultasi tentang SOP." };

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.stubEnv("DATA_SOURCE", "supabase");
  vi.stubEnv("SUPABASE_URL", "https://abc.supabase.co");
  vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "sb_publishable_key");
  vi.stubEnv("CONTACT_IP_SALT", "garam");
  mocks.rpc.mockReset();
  mocks.headers.mockReset();
  mocks.headers.mockResolvedValue(new Headers({ "x-forwarded-for": "203.0.113.7" }));
});

describe("submitContactMessage", () => {
  it("stores the message with a hashed ip and reports sent", async () => {
    mocks.rpc.mockResolvedValue({ data: "sent", error: null });

    expect(await submitContactMessage(VALUES)).toBe("sent");
    expect(mocks.rpc).toHaveBeenCalledWith("submit_contact_message", {
      p_name: "Rina Wulandari",
      p_email: "rina@contoh.id",
      p_phone: null,
      p_message: "Saya ingin berkonsultasi tentang SOP.",
      p_ip_hash: hashIp("203.0.113.7", "garam"),
    });
    expect(JSON.stringify(mocks.rpc.mock.calls)).not.toContain("203.0.113.7");
  });

  it("maps the rate limit", async () => {
    mocks.rpc.mockResolvedValue({ data: "rate_limited", error: null });

    expect(await submitContactMessage(VALUES)).toBe("rate-limited");
  });

  it.each([
    ["an rpc error", { data: null, error: { message: "boom" } }],
    ["an unknown result", { data: "weird", error: null }],
  ])("reports failed for %s", async (_label, result) => {
    mocks.rpc.mockResolvedValue(result);

    expect(await submitContactMessage(VALUES)).toBe("failed");
  });

  it("reports failed without calling supabase for invalid values", async () => {
    expect(await submitContactMessage({ ...VALUES, email: "bukan-email" })).toBe("failed");
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it("reports failed in demo mode and without a salt", async () => {
    vi.stubEnv("DATA_SOURCE", "demo");
    expect(await submitContactMessage(VALUES)).toBe("failed");

    vi.stubEnv("DATA_SOURCE", "supabase");
    vi.stubEnv("CONTACT_IP_SALT", "");
    expect(await submitContactMessage(VALUES)).toBe("failed");
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
});
