import { describe, expect, it } from "vitest";
import type { ModuleKey } from "@/core/domain/shared/module-key";
import { isHrefAvailable } from "@/lib/site/href-availability";

const ALL_MODULES: ModuleKey[] = ["services", "portfolio", "articles", "team", "stats", "testimonials", "partners", "vision"];

function without(module: ModuleKey): ModuleKey[] {
  return ALL_MODULES.filter((key) => key !== module);
}

const GATED_CASES: [string, ModuleKey][] = [
  ["/layanan", "services"],
  ["/layanan/", "services"],
  ["/layanan/penyusunan-sop", "services"],
  ["/layanan/penyusunan-sop/", "services"],
  ["/layanan?x=1", "services"],
  ["/layanan#bagian", "services"],
  ["/layanan/penyusunan-sop?x=1#a", "services"],
  ["/portofolio", "portfolio"],
  ["/portofolio/", "portfolio"],
  ["/portofolio/sistem-kpi", "portfolio"],
  ["/portofolio?x=1", "portfolio"],
  ["/artikel", "articles"],
  ["/artikel/", "articles"],
  ["/artikel/cara-menyusun-sop", "articles"],
  ["/artikel/halaman/2", "articles"],
  ["/artikel/halaman/2?x=1#a", "articles"],
  [" /artikel ", "articles"],
];

const ALWAYS_AVAILABLE = [
  "/",
  "/kontak",
  "/tentang",
  "/privasi",
  "/syarat-ketentuan",
  "/kebijakan-editorial",
  "/layanannya",
  "/artikelku/satu",
  "/portofolio-lama",
  "/kontak/layanan",
  "#layanan",
  "#",
  "https://example.com/layanan",
  "http://example.com/portofolio",
  "https://wa.me/6281234567890",
  "mailto:halo@example.com",
  "tel:+622150001234",
  "//example.com/layanan",
  "",
  "   ",
  "layanan",
  "not a url at all %%%",
];

describe("isHrefAvailable", () => {
  it.each(GATED_CASES)("treats %s as available only when the %s module is enabled", (href, module) => {
    expect(isHrefAvailable(href, ALL_MODULES)).toBe(true);
    expect(isHrefAvailable(href, [module])).toBe(true);
    expect(isHrefAvailable(href, without(module))).toBe(false);
    expect(isHrefAvailable(href, [])).toBe(false);
  });

  it("keeps a gated href available when only an unrelated module is disabled", () => {
    expect(isHrefAvailable("/layanan", without("portfolio"))).toBe(true);
    expect(isHrefAvailable("/portofolio", without("services"))).toBe(true);
    expect(isHrefAvailable("/artikel", without("services"))).toBe(true);
  });

  it.each(ALWAYS_AVAILABLE)("treats %j as always available", (href) => {
    expect(isHrefAvailable(href, [])).toBe(true);
    expect(isHrefAvailable(href, ALL_MODULES)).toBe(true);
  });

  it("never throws on odd input", () => {
    for (const href of ["/%E0%A4%A", "/\u0000", "/layanan/\uD800", "////", "/?", "/#", "http://", "https://[::1"]) {
      expect(() => isHrefAvailable(href, [])).not.toThrow();
    }
  });
});
