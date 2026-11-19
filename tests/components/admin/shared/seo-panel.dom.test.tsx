import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SeoPanel } from "@/components/admin/shared/seo-panel";

function renderForm(kind: "service" | "article" = "service") {
  return render(
    <form>
      <input aria-label="Slug" name="slug" defaultValue="penyusunan-sop" />
      <input aria-label="Meta title" name="metaTitle" defaultValue="Penyusunan SOP Perusahaan Anda" />
      <textarea aria-label="Meta description" name="metaDescription" defaultValue="" />
      <textarea aria-label="Isi" name="bodyMd" defaultValue="## Isi" />
      <SeoPanel kind={kind} siteName="Nusa Karya" />
    </form>,
  );
}

describe("SeoPanel", () => {
  it("marks a short meta description as a failed required check and passes it once it is long enough", async () => {
    renderForm();

    const required = screen.getByRole("list", { name: "Pemeriksaan wajib" });
    expect(required.textContent).toContain("Meta description harus 120–155 karakter.");
    expect(required.querySelector("[data-check='meta-description-length']")?.getAttribute("data-passed")).toBe("false");

    await userEvent.type(screen.getByLabelText("Meta description"), "x".repeat(130));

    expect(required.querySelector("[data-check='meta-description-length']")?.getAttribute("data-passed")).toBe("true");
  });

  it("announces the state in text so it does not rely on color", () => {
    renderForm();

    const item = screen.getByRole("list", { name: "Pemeriksaan wajib" }).querySelector("[data-check='meta-description-length']")!;

    expect(item.textContent).toContain("Perlu diperbaiki");
  });

  it("lists article-only suggestions only for articles", () => {
    const { unmount } = renderForm("service");
    expect(screen.queryByText(/Lead sebaiknya/)).toBeNull();
    unmount();

    renderForm("article");
    expect(screen.getByRole("list", { name: "Saran" }).textContent).toContain("Lead sebaiknya");
  });
});
