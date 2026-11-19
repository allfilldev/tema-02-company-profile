import { beforeEach, describe, expect, it, vi } from "vitest";
import { INITIAL_ADMIN_FORM_STATE } from "@/lib/admin/form-state";
import { buildTestPack } from "../../../fixtures/content-pack";

const mocks = vi.hoisted(() => ({ getAdminDeps: vi.fn(), revalidate: vi.fn(), revalidatePath: vi.fn(), getSiteQueries: vi.fn() }));

vi.mock("@/server/admin/admin-deps", () => ({ getAdminDeps: mocks.getAdminDeps }));
vi.mock("@/server/data/revalidation", () => ({ revalidateAdminChange: mocks.revalidate }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/server/container", () => ({ getSiteQueries: mocks.getSiteQueries }));

import { markMessageAsRead, removeMessage } from "@/server/actions/admin/messages";
import { previewSettingsImpacts, saveSettings } from "@/server/actions/admin/settings";

const current = buildTestPack().settings;

function settingsForm(overrides: Record<string, string> = {}): FormData {
  const values: Record<string, string> = {
    siteName: "Nusa Karya Baru",
    tagline: current.tagline,
    email: current.email,
    phone: current.phone,
    whatsappNumber: current.whatsappNumber,
    whatsappMessage: current.whatsappMessage,
    addressStreet: current.address.street,
    addressCity: current.address.city,
    addressRegion: current.address.region,
    postalCode: current.address.postalCode,
    addressCountry: current.address.country,
    schemaType: current.schemaType,
    ...overrides,
  };
  const formData = new FormData();
  Object.entries(values).forEach(([name, value]) => formData.append(name, value));
  return formData;
}

function depsWith(settingsUpdate = vi.fn(async (settings) => settings)) {
  return {
    repos: {
      settings: { get: vi.fn(async () => current), update: settingsUpdate },
      media: { findById: vi.fn(async () => null) },
      messages: { markRead: vi.fn(async () => undefined), remove: vi.fn(async () => undefined) },
    },
    siteName: async () => current.siteName,
    enabledModules: [],
  };
}

beforeEach(() => {
  mocks.getAdminDeps.mockReset();
  mocks.revalidate.mockReset();
  mocks.revalidatePath.mockReset();
  mocks.getSiteQueries.mockReset();
});

describe("saveSettings", () => {
  it("saves and refreshes every public tag", async () => {
    const deps = depsWith();
    mocks.getAdminDeps.mockResolvedValue(deps);

    const state = await saveSettings(INITIAL_ADMIN_FORM_STATE, settingsForm());

    expect(state).toMatchObject({ status: "saved", message: "Perubahan tersimpan." });
    expect(deps.repos.settings.update).toHaveBeenCalledTimes(1);
    expect(mocks.revalidate).toHaveBeenCalledWith({ kind: "settings" });
  });

  it("returns field errors and keeps the typed values without saving", async () => {
    const deps = depsWith();
    mocks.getAdminDeps.mockResolvedValue(deps);

    const state = await saveSettings(INITIAL_ADMIN_FORM_STATE, settingsForm({ email: "bukan-email" }));

    expect(state.status).toBe("invalid");
    expect(state.fieldErrors.email).toBeDefined();
    expect(state.values).toMatchObject({ email: "bukan-email" });
    expect(deps.repos.settings.update).not.toHaveBeenCalled();
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });

  it("turns a database failure into a generic failed state", async () => {
    mocks.getAdminDeps.mockResolvedValue(depsWith(vi.fn(async () => { throw new Error("boom"); })));
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const state = await saveSettings(INITIAL_ADMIN_FORM_STATE, settingsForm());

    expect(state).toMatchObject({ status: "failed", message: "Gagal menyimpan. Coba lagi." });
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });
});

describe("previewSettingsImpacts", () => {
  it("requires an admin and reports the titles a new name would truncate", async () => {
    mocks.getAdminDeps.mockResolvedValue(depsWith());
    const { buildTestQueries } = await import("../../../fixtures/site");
    mocks.getSiteQueries.mockReturnValue(buildTestQueries());

    const impacts = await previewSettingsImpacts("Nusa Karya Konsultan Manajemen Indonesia");

    expect(impacts.length).toBeGreaterThan(0);
    expect(mocks.getAdminDeps).toHaveBeenCalledTimes(1);
  });
});

describe("message actions", () => {
  it("marks a message read and deletes one, each behind an admin check", async () => {
    const deps = depsWith();
    mocks.getAdminDeps.mockResolvedValue(deps);

    expect(await markMessageAsRead("c1")).toEqual({ ok: true });
    expect(await removeMessage("c1")).toEqual({ ok: true });
    expect(deps.repos.messages.markRead).toHaveBeenCalledWith("c1");
    expect(deps.repos.messages.remove).toHaveBeenCalledWith("c1");
    expect(mocks.getAdminDeps).toHaveBeenCalledTimes(2);
    expect(mocks.revalidatePath).toHaveBeenCalledTimes(2);
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/pesan");
  });

  it("reports a failure without throwing", async () => {
    const deps = depsWith();
    deps.repos.messages.remove = vi.fn(async () => { throw new Error("boom"); });
    mocks.getAdminDeps.mockResolvedValue(deps);
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(await removeMessage("c1")).toEqual({ ok: false, message: "Gagal menghapus. Coba lagi." });
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
