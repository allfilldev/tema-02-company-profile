import { beforeEach, describe, expect, it, vi } from "vitest";
import { ADMIN_MODULES, type AdminModule } from "@/core/domain/admin/records";
import { INITIAL_ADMIN_FORM_STATE } from "@/lib/admin/form-state";
import { buildTeamMemberRecord, createMemoryArticleCounts, createMemoryCollection } from "../../../fixtures/admin-repositories";

const mocks = vi.hoisted(() => ({
  getAdminDeps: vi.fn(),
  revalidate: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/server/admin/admin-deps", () => ({ getAdminDeps: mocks.getAdminDeps }));
vi.mock("@/server/data/revalidation", () => ({ revalidateAdminChange: mocks.revalidate }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect, notFound: mocks.notFound }));

import { deleteItem, moveItem, saveItem, setItemPublished } from "@/server/actions/admin/collections";

function formWith(entries: [string, string][]): FormData {
  const formData = new FormData();
  entries.forEach(([name, value]) => formData.append(name, value));
  return formData;
}

const VALID_SERVICE: [string, string][] = [
  ["slug", "penyusunan-sop"],
  ["title", "Penyusunan SOP"],
  ["summary", "Ringkasan"],
  ["bodyMd", "## Isi\n\nTeks."],
  ["metaTitle", "Penyusunan SOP Perusahaan Anda"],
  ["metaDescription", "Layanan penyusunan SOP untuk usaha kecil dan menengah yang ingin proses kerjanya rapi, terdokumentasi, dan mudah diajarkan ke karyawan baru di tim Anda."],
];

function buildDeps() {
  const collections = Object.fromEntries(
    ADMIN_MODULES.map((module) => [module, createMemoryCollection(module, module === "team" ? [buildTeamMemberRecord()] : [])]),
  ) as unknown as Record<AdminModule, ReturnType<typeof createMemoryCollection>>;
  return {
    session: { userId: "u1", email: "admin@contoh.id" },
    repos: {
      collections,
      articleAuthors: createMemoryArticleCounts(collections.articles as unknown as { records: never[] }),
      media: { findById: vi.fn(async () => null) },
    },
    siteName: async () => "Nusa Karya",
    enabledModules: ["services", "portfolio", "articles", "team", "stats", "testimonials", "partners", "vision"],
  };
}

beforeEach(() => {
  mocks.getAdminDeps.mockReset();
  mocks.revalidate.mockReset();
  mocks.redirect.mockClear();
  mocks.notFound.mockClear();
});

describe("saveItem", () => {
  it("does nothing when the session is not an admin", async () => {
    mocks.getAdminDeps.mockRejectedValue(new Error("NEXT_REDIRECT:/admin/login"));

    await expect(saveItem("services", null, INITIAL_ADMIN_FORM_STATE, formWith(VALID_SERVICE))).rejects.toThrow("NEXT_REDIRECT:/admin/login");
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });

  it("rejects an unknown module name", async () => {
    mocks.getAdminDeps.mockResolvedValue(buildDeps());

    await expect(saveItem("pengguna", null, INITIAL_ADMIN_FORM_STATE, formWith([]))).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("returns an invalid state that keeps what was typed and does not revalidate", async () => {
    const deps = buildDeps();
    mocks.getAdminDeps.mockResolvedValue(deps);

    const state = await saveItem("services", null, INITIAL_ADMIN_FORM_STATE, formWith([["slug", "Halo Dunia"], ["title", "Layanan"]]));

    expect(state.status).toBe("invalid");
    expect(state.fieldErrors.slug).toBeDefined();
    expect(state.values).toMatchObject({ slug: "Halo Dunia", title: "Layanan" });
    expect(mocks.revalidate).not.toHaveBeenCalled();
    expect(deps.repos.collections.services.records).toHaveLength(0);
  });

  it("creates the item, revalidates with the slug, and goes to the list", async () => {
    const deps = buildDeps();
    mocks.getAdminDeps.mockResolvedValue(deps);

    await expect(saveItem("services", null, INITIAL_ADMIN_FORM_STATE, formWith([...VALID_SERVICE, ["intent", "publish"]]))).rejects.toThrow("NEXT_REDIRECT:/admin/layanan");

    expect(deps.repos.collections.services.records).toHaveLength(1);
    expect(mocks.revalidate).toHaveBeenCalledWith({ kind: "collection", affected: { module: "services", slugs: ["penyusunan-sop"] } });
  });

  it("stays on the page after updating and reports that it saved", async () => {
    const deps = buildDeps();
    mocks.getAdminDeps.mockResolvedValue(deps);
    await expect(saveItem("services", null, INITIAL_ADMIN_FORM_STATE, formWith(VALID_SERVICE))).rejects.toThrow("NEXT_REDIRECT");
    const id = deps.repos.collections.services.records[0].id;

    const state = await saveItem("services", id, INITIAL_ADMIN_FORM_STATE, formWith([...VALID_SERVICE.filter(([name]) => name !== "title"), ["title", "Judul baru"]]));

    expect(state).toMatchObject({ status: "saved", message: "Perubahan tersimpan." });
    expect(mocks.revalidate).toHaveBeenCalledTimes(2);
  });

  it("turns a repository failure into a generic failed state without revalidating", async () => {
    const deps = buildDeps();
    deps.repos.collections.services.create = vi.fn(async () => {
      throw new Error("duplicate key");
    }) as never;
    mocks.getAdminDeps.mockResolvedValue(deps);
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const state = await saveItem("services", null, INITIAL_ADMIN_FORM_STATE, formWith(VALID_SERVICE));

    expect(state).toMatchObject({ status: "failed", message: "Gagal menyimpan. Coba lagi." });
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });
});

describe("deleteItem, moveItem, and setItemPublished", () => {
  it("deletes and revalidates, or explains why it could not", async () => {
    const deps = buildDeps();
    mocks.getAdminDeps.mockResolvedValue(deps);

    expect(await deleteItem("team", "team-1")).toEqual({ ok: true });
    expect(deps.repos.collections.team.records).toHaveLength(0);
    expect(mocks.revalidate).toHaveBeenCalledTimes(1);
    expect(await deleteItem("team", "team-1")).toEqual({ ok: false, message: "Data tidak ditemukan." });
  });

  it("changes the published state and reports validation problems", async () => {
    const deps = buildDeps();
    mocks.getAdminDeps.mockResolvedValue(deps);
    await expect(saveItem("services", null, INITIAL_ADMIN_FORM_STATE, formWith([["slug", "draf"], ["title", "Draf"]]))).rejects.toThrow("NEXT_REDIRECT");
    const id = deps.repos.collections.services.records[0].id;
    mocks.revalidate.mockClear();

    const blocked = await setItemPublished("services", id, true);

    expect(blocked.ok).toBe(false);
    expect(mocks.revalidate).not.toHaveBeenCalled();
    expect(await setItemPublished("team", "team-1", false)).toEqual({ ok: true });
    expect(mocks.revalidate).toHaveBeenCalledTimes(1);
  });

  it("moves an item and revalidates its module", async () => {
    const deps = buildDeps();
    mocks.getAdminDeps.mockResolvedValue(deps);

    expect(await moveItem("team", "team-1", "up")).toEqual({ ok: true });
    expect(mocks.revalidate).toHaveBeenCalledWith({ kind: "collection", affected: { module: "team", slugs: [] } });
    expect(await moveItem("articles", "a1", "up")).toMatchObject({ ok: false });
  });
});
