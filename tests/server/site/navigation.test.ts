import { describe, expect, it } from "vitest";
import { MODULE_KEYS } from "@/core/domain/shared/module-key";
import { LEGAL_LINKS, buildNavigation } from "@/server/site/navigation";

describe("buildNavigation", () => {
  it("lists every item in order when all modules are enabled", () => {
    expect(buildNavigation(MODULE_KEYS)).toEqual([
      { label: "Beranda", href: "/" },
      { label: "Tentang", href: "/tentang" },
      { label: "Layanan", href: "/layanan" },
      { label: "Portofolio", href: "/portofolio" },
      { label: "Artikel", href: "/artikel" },
      { label: "Kontak", href: "/kontak" },
    ]);
  });

  it("keeps only home, about, and contact when no module is enabled", () => {
    expect(buildNavigation([]).map((item) => item.label)).toEqual(["Beranda", "Tentang", "Kontak"]);
  });

  it("shows articles without services and portfolio when only articles is enabled", () => {
    const labels = buildNavigation(["articles"]).map((item) => item.label);
    expect(labels).toEqual(["Beranda", "Tentang", "Artikel", "Kontak"]);
    expect(labels).not.toContain("Layanan");
    expect(labels).not.toContain("Portofolio");
  });

  it("ignores modules that have no navigation entry", () => {
    expect(buildNavigation(["team", "stats", "testimonials", "partners", "vision"])).toHaveLength(3);
  });
});

describe("LEGAL_LINKS", () => {
  it("lists the three legal pages with exact labels, hrefs, and rel values", () => {
    expect(LEGAL_LINKS).toEqual([
      { slug: "privasi", label: "Kebijakan privasi", href: "/privasi", rel: "privacy-policy" },
      { slug: "syarat-ketentuan", label: "Syarat dan ketentuan", href: "/syarat-ketentuan", rel: "terms-of-service" },
      { slug: "kebijakan-editorial", label: "Kebijakan editorial", href: "/kebijakan-editorial", rel: null },
    ]);
  });
});
