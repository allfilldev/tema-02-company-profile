import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  rpc: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
}));

vi.mock("next/navigation", () => ({ notFound: mocks.notFound, redirect: mocks.redirect }));
vi.mock("@/server/supabase/session-client", () => ({
  createSessionSupabaseClient: async () => ({ auth: { getUser: mocks.getUser }, rpc: mocks.rpc }),
}));

import { getAdminSession, requireAdmin } from "@/server/admin/admin-session";

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.stubEnv("DATA_SOURCE", "supabase");
  mocks.getUser.mockReset();
  mocks.rpc.mockReset();
  mocks.notFound.mockClear();
  mocks.redirect.mockClear();
});

describe("getAdminSession", () => {
  it("returns null without a user", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });

    expect(await getAdminSession()).toBeNull();
  });

  it("returns null for a user who is not an admin", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: "u1", email: "a@b.id" } }, error: null });
    mocks.rpc.mockResolvedValue({ data: false, error: null });

    expect(await getAdminSession()).toBeNull();
  });

  it("returns the admin session", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: "u1", email: "a@b.id" } }, error: null });
    mocks.rpc.mockResolvedValue({ data: true, error: null });

    expect(await getAdminSession()).toEqual({ userId: "u1", email: "a@b.id" });
    expect(mocks.rpc).toHaveBeenCalledWith("is_admin");
  });
});

describe("requireAdmin", () => {
  it("is not found in demo mode without reading the session", async () => {
    vi.stubEnv("DATA_SOURCE", "demo");

    await expect(requireAdmin()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mocks.getUser).not.toHaveBeenCalled();
  });

  it("redirects an anonymous visitor to the login page", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });

    await expect(requireAdmin()).rejects.toThrow("NEXT_REDIRECT:/admin/login");
  });

  it("is not found for a signed in user who is not an admin", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: "u1", email: "a@b.id" } }, error: null });
    mocks.rpc.mockResolvedValue({ data: false, error: null });

    await expect(requireAdmin()).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("returns the session for an admin", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: "u1", email: "a@b.id" } }, error: null });
    mocks.rpc.mockResolvedValue({ data: true, error: null });

    expect(await requireAdmin()).toEqual({ userId: "u1", email: "a@b.id" });
  });
});
