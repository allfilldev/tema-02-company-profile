import { describe, expect, it } from "vitest";
import { checkMarkdownBody } from "@/lib/markdown/body-rules";

const ALL_MODULES = ["services", "portfolio", "articles", "team", "stats", "testimonials", "partners", "vision"] as const;
const WITHOUT_PORTFOLIO = ALL_MODULES.filter((module) => module !== "portfolio");

describe("checkMarkdownBody", () => {
  it("accepts plain markdown with no problems", () => {
    expect(checkMarkdownBody("Teks biasa dengan [tautan](https://contoh.id) dan [layanan](/layanan).", ALL_MODULES)).toEqual({
      blocking: [],
      warnings: [],
    });
  });

  it("blocks footnotes with an explanation", () => {
    const result = checkMarkdownBody("Klaim penting[^1].\n\n[^1]: Sumber.", ALL_MODULES);

    expect(result.blocking).toEqual(["Catatan kaki tidak didukung. Tulis sumbernya sebagai tautan di dalam kalimat."]);
  });

  it("blocks a link to a module the theme turned off, naming the link", () => {
    const result = checkMarkdownBody("Lihat [proyek kami](/portofolio/proyek-a).", WITHOUT_PORTFOLIO);

    expect(result.blocking).toEqual(["Tautan /portofolio/proyek-a mengarah ke modul yang dimatikan."]);
    expect(checkMarkdownBody("Lihat [proyek kami](/portofolio/proyek-a).", ALL_MODULES).blocking).toEqual([]);
  });

  it("warns about http links but does not block them", () => {
    const result = checkMarkdownBody("Baca [sumber](http://contoh.id/artikel).", ALL_MODULES);

    expect(result.blocking).toEqual([]);
    expect(result.warnings).toEqual(["Tautan http://contoh.id/artikel belum memakai https."]);
  });

  it("ignores everything inside fenced and inline code", () => {
    const markdown = ["```", "[^1] [x](/portofolio) [y](http://a.id)", "```", "Gunakan `[^2]` dan `[z](/portofolio)` di kode."].join("\n");

    expect(checkMarkdownBody(markdown, WITHOUT_PORTFOLIO)).toEqual({ blocking: [], warnings: [] });
  });

  it("reports each distinct problem once", () => {
    const markdown = "[a](/portofolio) dan [b](/portofolio) lagi.";

    expect(checkMarkdownBody(markdown, WITHOUT_PORTFOLIO).blocking).toHaveLength(1);
  });
});
