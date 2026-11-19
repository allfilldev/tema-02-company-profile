import { describe, expect, it } from "vitest";
import { paginatedDescription } from "@/lib/seo/description";

const BASE =
  "Kumpulan artikel praktis tentang penyusunan SOP, KPI, dan transformasi digital untuk UMKM yang ditulis berdasarkan pekerjaan nyata di lapangan.";

describe("paginatedDescription", () => {
  it("leaves the first page untouched", () => {
    expect(paginatedDescription(BASE, 1)).toBe(BASE);
  });

  it("prefixes the page number and stays within 120 to 155 characters", () => {
    const second = paginatedDescription(BASE, 2);

    expect(second.startsWith("Halaman 2: ")).toBe(true);
    expect(second.length).toBeGreaterThanOrEqual(120);
    expect(second.length).toBeLessThanOrEqual(155);
  });

  it("cuts at a word boundary when the prefix pushes it past 155 characters", () => {
    const long = `${BASE} ${"Tambahan kalimat yang cukup panjang. ".repeat(1)}`.slice(0, 154).trimEnd();
    const third = paginatedDescription(long, 3);

    const full = `Halaman 3: ${long}`;

    expect(third.length).toBeLessThanOrEqual(155);
    expect(full.startsWith(third)).toBe(true);
    expect(full[third.length]).toMatch(/[\s,;:\-–—]/);
  });

  it("gives every paginated page a different description", () => {
    expect(new Set([BASE, paginatedDescription(BASE, 2), paginatedDescription(BASE, 3)]).size).toBe(3);
  });
});
