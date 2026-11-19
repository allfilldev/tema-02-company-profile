import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MediaUpload } from "@/components/admin/media/media-upload";
import { INITIAL_ADMIN_FORM_STATE, savedState } from "@/lib/admin/form-state";

const mocks = vi.hoisted(() => ({ downscaleImage: vi.fn() }));

vi.mock("@/lib/admin/downscale", () => ({ downscaleImage: mocks.downscaleImage }));

function photo() {
  return new File(["a-very-large-original"], "foto.jpg", { type: "image/jpeg" });
}

beforeEach(() => {
  mocks.downscaleImage.mockReset();
  mocks.downscaleImage.mockResolvedValue(new Blob(["tiny"], { type: "image/webp" }));
});

describe("media upload", () => {
  it("shows an alt error and sends nothing when the alt text is empty", async () => {
    const action = vi.fn(async () => INITIAL_ADMIN_FORM_STATE);
    render(<MediaUpload action={action} />);

    await userEvent.upload(screen.getByLabelText("Berkas gambar"), photo());
    await userEvent.click(screen.getByRole("button", { name: "Unggah" }));

    expect(screen.getByText("Isi teks alternatif gambar.")).toBeTruthy();
    expect(mocks.downscaleImage).not.toHaveBeenCalled();
    expect(action).not.toHaveBeenCalled();
  });

  it("asks for a file when none is chosen", async () => {
    const action = vi.fn(async () => INITIAL_ADMIN_FORM_STATE);
    render(<MediaUpload action={action} />);

    await userEvent.type(screen.getByLabelText(/Teks alternatif/), "Tim sedang rapat");
    await userEvent.click(screen.getByRole("button", { name: "Unggah" }));

    expect(screen.getByText("Pilih berkas gambar.")).toBeTruthy();
    expect(action).not.toHaveBeenCalled();
  });

  it("sends the downscaled blob instead of the original file, together with the kind and alt", async () => {
    const action = vi.fn(async () => savedState([], {}));
    render(<MediaUpload action={action} />);

    await userEvent.upload(screen.getByLabelText("Berkas gambar"), photo());
    await userEvent.selectOptions(screen.getByLabelText("Jenis gambar"), "logo");
    await userEvent.type(screen.getByLabelText(/Teks alternatif/), "Logo Nusa Karya");
    await userEvent.click(screen.getByRole("button", { name: "Unggah" }));

    await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
    const [, formData] = action.mock.calls[0] as unknown as [unknown, FormData];
    const sent = formData.get("file") as File;

    expect(mocks.downscaleImage).toHaveBeenCalledWith(expect.objectContaining({ name: "foto.jpg" }), "logo");
    expect(sent.size).toBe(4);
    expect(sent.type).toBe("image/webp");
    expect(formData.get("kind")).toBe("logo");
    expect(formData.get("alt")).toBe("Logo Nusa Karya");
    expect(await screen.findByText("Perubahan tersimpan.")).toBeTruthy();
  });
});
