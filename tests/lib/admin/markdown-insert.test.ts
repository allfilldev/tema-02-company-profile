import { describe, expect, it } from "vitest";
import { insertImageMarkdown } from "@/lib/admin/markdown-insert";

const asset = { id: "m1", url: "/demo/a.webp", alt: "Tim rapat", width: 800, height: 600 };

describe("insertImageMarkdown", () => {
  it("inserts the image markdown with a caption at the cursor and reports the new cursor", () => {
    const result = insertImageMarkdown("Awal  akhir", 5, 5, asset, "Rapat tim");

    expect(result.value).toBe('Awal ![Tim rapat](/demo/a.webp "Rapat tim") akhir');
    expect(result.cursor).toBe(5 + '![Tim rapat](/demo/a.webp "Rapat tim")'.length);
  });

  it("leaves out the title when the caption is empty or blank", () => {
    expect(insertImageMarkdown("", 0, 0, asset, "").value).toBe("![Tim rapat](/demo/a.webp)");
    expect(insertImageMarkdown("", 0, 0, asset, "   ").value).toBe("![Tim rapat](/demo/a.webp)");
  });

  it("replaces a selection", () => {
    expect(insertImageMarkdown("ganti ini saja", 6, 9, asset, "").value).toBe("ganti ![Tim rapat](/demo/a.webp) saja");
  });

  it("keeps brackets out of the alt text and quotes out of the caption", () => {
    const tricky = { ...asset, alt: "Foto [lama] tim" };

    expect(insertImageMarkdown("", 0, 0, tricky, 'Kata "bijak"').value).toBe("![Foto lama tim](/demo/a.webp \"Kata 'bijak'\")");
  });
});
