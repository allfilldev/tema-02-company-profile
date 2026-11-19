import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ADMIN_MODULES } from "@/core/domain/admin/records";
import { ADMIN_MODULE_PATHS } from "@/lib/site/routes";

const PANEL_DIR = path.join(process.cwd(), "src", "app", "admin", "(panel)");

describe.each(ADMIN_MODULES)("%s admin routes", (module) => {
  const segment = ADMIN_MODULE_PATHS[module].replace("/admin/", "");

  it.each(["page.tsx", path.join("baru", "page.tsx"), path.join("[id]", "page.tsx")])("has %s", (file) => {
    expect(existsSync(path.join(PANEL_DIR, segment, file))).toBe(true);
  });
});

describe.each(["media", "pesan", "pengaturan"])("%s admin route", (segment) => {
  it("has page.tsx", () => {
    expect(existsSync(path.join(PANEL_DIR, segment, "page.tsx"))).toBe(true);
  });
});
