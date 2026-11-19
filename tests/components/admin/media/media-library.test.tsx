import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MediaLibrary } from "@/components/admin/media/media-library";
import type { MediaRecord } from "@/core/domain/admin/records";

const records: MediaRecord[] = [
  { id: "m1", url: "https://files.example/a.webp", alt: "Tim sedang rapat", width: 1920, height: 1440, sizeBytes: 84_000, storagePath: "uploads/a.webp", createdAt: "2026-11-20T03:00:00.000Z" },
  { id: "m2", url: "/demo/general/logo.webp", alt: "Logo", width: 600, height: 160, sizeBytes: 4_100, storagePath: null, createdAt: "2026-11-19T03:00:00.000Z" },
];

const actions = {
  updateAlt: async () => ({ ok: true as const }),
  remove: async () => ({ ok: true as const }),
};

describe("media library", () => {
  it("shows every image with its alt, dimensions, and size", () => {
    const markup = renderToStaticMarkup(<MediaLibrary media={records} actions={actions} />);

    expect(markup).toContain("1920 × 1440");
    expect(markup).toContain("82 KB");
    expect(markup).toContain("600 × 160");
    expect(markup).toContain('value="Tim sedang rapat"');
    expect(markup.match(/<img /g)).toHaveLength(2);
  });

  it("offers one delete button and one alt field per image", () => {
    const markup = renderToStaticMarkup(<MediaLibrary media={records} actions={actions} />);

    expect(markup.match(/>Hapus</g)).toHaveLength(2);
    expect(markup.match(/>Simpan teks alternatif</g)).toHaveLength(2);
  });

  it("shows a message when the library is empty", () => {
    const markup = renderToStaticMarkup(<MediaLibrary media={[]} actions={actions} />);

    expect(markup).toContain("Pustaka media masih kosong.");
  });
});
