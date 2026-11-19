import { describe, expect, it } from "vitest";
import { findTitleImpacts } from "@/lib/seo/title-impact";

describe("findTitleImpacts", () => {
  const entries = [
    { label: "Beranda", title: "Konsultan Manajemen dan Transformasi Digital" },
    { label: "Tentang", title: "Tentang Kami dan Cara Kami Bekerja" },
    { label: "Artikel: SOP", title: "Cara Menyusun SOP Operasional untuk Usaha Kecil" },
  ];

  it("reports nothing when every title still fits", () => {
    expect(findTitleImpacts(entries, "Nusa")).toEqual([]);
  });

  it("flags titles that would be truncated by a longer site name", () => {
    const impacts = findTitleImpacts(entries, "Nusa Karya Konsultan");

    expect(impacts.filter((impact) => impact.result === "truncated").map((impact) => impact.label)).toEqual([
      "Beranda",
      "Artikel: SOP",
    ]);
  });

  it("flags titles that become shorter than 30 characters", () => {
    const impacts = findTitleImpacts([{ label: "Tentang", title: "Tentang" }], "Nusa");

    expect(impacts).toEqual([{ label: "Tentang", title: "Tentang", result: "too-short" }]);
  });
});
