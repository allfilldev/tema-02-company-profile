import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FormNotice } from "@/components/admin/shared/form-notice";
import { INITIAL_ADMIN_FORM_STATE, type AdminFormState } from "@/lib/admin/form-state";

const base = INITIAL_ADMIN_FORM_STATE;

describe("FormNotice", () => {
  it("renders nothing before the first submit", () => {
    expect(renderToStaticMarkup(<FormNotice state={base} />)).toBe("");
  });

  it("announces a save politely and lists warnings as a status", () => {
    const state: AdminFormState = { ...base, status: "saved", message: "Perubahan tersimpan.", warnings: ["Tautan http://a.id belum memakai https."] };
    const markup = renderToStaticMarkup(<FormNotice state={state} />);

    expect(markup).toMatch(/role="status"[^>]*>[\s\S]*Perubahan tersimpan\./);
    expect(markup).toContain("Tautan http://a.id belum memakai https.");
    expect(markup).not.toContain('role="alert"');
  });

  it("raises an alert with the message and every blocking reason when invalid or failed", () => {
    const invalid: AdminFormState = { ...base, status: "invalid", message: "Periksa kembali isian yang ditandai.", blocking: ["Catatan kaki tidak didukung."] };
    const failed: AdminFormState = { ...base, status: "failed", message: "Gagal menyimpan. Coba lagi." };

    const invalidMarkup = renderToStaticMarkup(<FormNotice state={invalid} />);
    expect(invalidMarkup).toMatch(/role="alert"/);
    expect(invalidMarkup).toContain("Periksa kembali isian yang ditandai.");
    expect(invalidMarkup).toContain("Catatan kaki tidak didukung.");
    expect(renderToStaticMarkup(<FormNotice state={failed} />)).toContain("Gagal menyimpan. Coba lagi.");
  });
});
