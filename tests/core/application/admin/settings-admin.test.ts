import { describe, expect, it, vi } from "vitest";
import { previewTitleImpacts, updateSiteSettings } from "@/core/application/admin/settings-admin";
import { buildTestPack } from "../../../fixtures/content-pack";
import { buildTestQueries } from "../../../fixtures/site";

const current = buildTestPack().settings;

function repository() {
  return { get: vi.fn(async () => current), update: vi.fn(async (settings) => settings) };
}

describe("updateSiteSettings", () => {
  it("saves valid settings and reports a settings change", async () => {
    const repo = repository();
    const { updatedAt: _ignored, ...values } = { ...current, siteName: "Nusa Karya Baru" };

    const result = await updateSiteSettings({ repository: repo }, values);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.affected).toEqual({ kind: "settings" });
      expect(result.value.siteName).toBe("Nusa Karya Baru");
      expect(result.value.updatedAt).toBe(current.updatedAt);
    }
    expect(repo.update).toHaveBeenCalledTimes(1);
  });

  it("rejects an invalid email and a malformed whatsapp number with field errors", async () => {
    const repo = repository();
    const { updatedAt: _ignored, ...values } = { ...current, email: "bukan-email", whatsappNumber: "0812" };

    const result = await updateSiteSettings({ repository: repo }, values);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.fieldErrors).sort()).toEqual(["email", "whatsappNumber"]);
      expect(result.fieldErrors.email).toBe("Alamat email tidak valid.");
    }
    expect(repo.update).not.toHaveBeenCalled();
  });
});

describe("previewTitleImpacts", () => {
  it("flags the titles a longer site name would truncate, with readable labels", async () => {
    const queries = buildTestQueries();

    const impacts = await previewTitleImpacts({ queries }, "Nusa Karya Konsultan Manajemen Indonesia");

    expect(impacts.length).toBeGreaterThan(0);
    expect(impacts.every((impact) => impact.result === "truncated" || impact.result === "too-short")).toBe(true);
    expect(impacts.map((impact) => impact.label)).toContain("Beranda");
  });

  it("reports no truncated title when the name stays short", async () => {
    const impacts = await previewTitleImpacts({ queries: buildTestQueries() }, "Nusa");

    expect(impacts.filter((impact) => impact.result === "truncated")).toEqual([]);
  });
});
