import { describe, expect, it } from "vitest";
import { buildAdminMenu, isMenuItemActive } from "@/lib/admin/admin-menu";

const ALL = ["services", "portfolio", "articles", "team", "stats", "testimonials", "partners", "vision"] as const;

describe("buildAdminMenu", () => {
  it("lists every entry in the agreed order with the agreed labels and paths", () => {
    expect(buildAdminMenu(ALL)).toEqual([
      { label: "Dashboard", href: "/admin" },
      { label: "Layanan", href: "/admin/layanan" },
      { label: "Portofolio", href: "/admin/portofolio" },
      { label: "Tim", href: "/admin/tim" },
      { label: "Statistik", href: "/admin/statistik" },
      { label: "Testimoni", href: "/admin/testimoni" },
      { label: "Partner", href: "/admin/partner" },
      { label: "Artikel", href: "/admin/artikel" },
      { label: "Pesan masuk", href: "/admin/pesan" },
      { label: "Media", href: "/admin/media" },
      { label: "Pengaturan situs", href: "/admin/pengaturan" },
    ]);
  });

  it("hides the modules the theme turned off but never the fixed entries", () => {
    expect(buildAdminMenu(["services"]).map((item) => item.label)).toEqual(["Dashboard", "Layanan", "Pesan masuk", "Media", "Pengaturan situs"]);
  });

  it("keeps Tim when articles are on even if the team module is off, and drops it when both are off", () => {
    expect(buildAdminMenu(["articles"]).map((item) => item.label)).toContain("Tim");
    expect(buildAdminMenu(["services", "stats"]).map((item) => item.label)).not.toContain("Tim");
  });
});

describe("isMenuItemActive", () => {
  const dashboard = { label: "Dashboard", href: "/admin" };
  const services = { label: "Layanan", href: "/admin/layanan" };

  it("treats the dashboard as active only on its own path", () => {
    expect(isMenuItemActive(dashboard, "/admin")).toBe(true);
    expect(isMenuItemActive(dashboard, "/admin/layanan")).toBe(false);
  });

  it("treats a section as active on its list and below it, but not on look-alike paths", () => {
    expect(isMenuItemActive(services, "/admin/layanan")).toBe(true);
    expect(isMenuItemActive(services, "/admin/layanan/baru")).toBe(true);
    expect(isMenuItemActive(services, "/admin/layanan-lain")).toBe(false);
  });
});
