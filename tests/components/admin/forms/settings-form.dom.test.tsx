import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SettingsForm } from "@/components/admin/forms/settings-form";
import { generalPack } from "@/content/packs/general";
import { INITIAL_ADMIN_FORM_STATE } from "@/lib/admin/form-state";
import { readSettingsForm } from "@/lib/admin/form-data";
import type { TitleImpact } from "@/lib/seo/title-impact";
import { buildMediaAsset } from "../../../fixtures/admin-records";

const settings = generalPack.settings;
const action = async () => INITIAL_ADMIN_FORM_STATE;

function renderForm(previewImpacts: (siteName: string) => Promise<TitleImpact[]>) {
  return render(<SettingsForm settings={settings} media={[buildMediaAsset()]} action={action} previewImpacts={previewImpacts} />);
}

describe("settings form", () => {
  it("gives every visible control a label and posts every field readSettingsForm reads", () => {
    const { container } = renderForm(async () => []);
    const controls = [...container.querySelectorAll<HTMLElement>("input:not([type=hidden]), select, textarea")].filter((element) => element.getAttribute("name") !== "intent");

    for (const control of controls) {
      expect(control.id, control.outerHTML).not.toBe("");
      expect(container.querySelector(`label[for="${control.id}"]`), control.outerHTML).not.toBeNull();
    }

    const names = new Set([...container.querySelectorAll("[name]")].map((element) => element.getAttribute("name")));
    const expected = readSettingsForm(new FormData());
    const flatNames = ["siteName", "tagline", "email", "phone", "whatsappNumber", "whatsappMessage", "addressStreet", "addressCity", "addressRegion", "postalCode", "addressCountry", "mapsEmbedUrl", "openingHours", "schemaType", "foundedYear", "googleSiteVerification", "gaMeasurementId"];
    for (const name of [...flatNames, ...Object.keys(expected.mediaIds)]) {
      expect(names.has(name), name).toBe(true);
    }
  });

  it("does not ask the server about title impacts until the site name changes", async () => {
    const previewImpacts = vi.fn(async () => []);
    renderForm(previewImpacts);

    await new Promise((resolve) => setTimeout(resolve, 400));

    expect(previewImpacts).not.toHaveBeenCalled();
  });

  it("warns which titles will be truncated or become too short after the site name changes", async () => {
    const previewImpacts = vi.fn(async (): Promise<TitleImpact[]> => [
      { label: "Layanan: Penyusunan SOP", title: "Penyusunan SOP Perusahaan Anda", result: "truncated" },
      { label: "Beranda", title: "Beranda", result: "too-short" },
    ]);
    renderForm(previewImpacts);

    await userEvent.type(screen.getByLabelText(/Nama situs/), " Konsultan Manajemen Terpadu");

    await waitFor(() => expect(previewImpacts).toHaveBeenCalled());
    expect(previewImpacts.mock.calls.at(-1)?.[0]).toBe(`${settings.siteName} Konsultan Manajemen Terpadu`);
    expect(await screen.findByText("Judul berikut akan dipotong:")).toBeTruthy();
    expect(screen.getByText(/Layanan: Penyusunan SOP/)).toBeTruthy();
    expect(screen.getByText("Judul berikut terlalu pendek:")).toBeTruthy();
    expect(screen.getByText(/Beranda/)).toBeTruthy();
  });

  it("shows no warning when the new site name affects no title", async () => {
    renderForm(async () => []);

    await userEvent.type(screen.getByLabelText(/Nama situs/), "x");

    await waitFor(() => expect(screen.queryByText("Judul berikut akan dipotong:")).toBeNull());
    expect(screen.queryByText("Judul berikut terlalu pendek:")).toBeNull();
  });

  it("adds and removes social link rows with sequential input names", async () => {
    const { container } = renderForm(async () => []);
    const socialInputs = () => [...container.querySelectorAll("[name]")].filter((element) => element.getAttribute("name")?.startsWith("social[")).length;
    const before = socialInputs();

    await userEvent.click(screen.getByRole("button", { name: "Tambah tautan sosial" }));

    expect(socialInputs()).toBe(before + 2);

    await userEvent.click(screen.getByRole("button", { name: `Hapus tautan sosial ${before / 2 + 1}` }));

    expect(socialInputs()).toBe(before);
  });
});
