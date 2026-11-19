import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MediaPicker } from "@/components/admin/shared/media-picker";

const media = [
  { id: "m1", url: "/demo/a.webp", alt: "Tim sedang rapat", width: 800, height: 600 },
  { id: "m2", url: "/demo/b.webp", alt: "Laptop di meja", width: 800, height: 600 },
];

describe("MediaPicker", () => {
  it("shows each image as a button labeled by its alt text and reports the chosen one", async () => {
    const onSelect = vi.fn();
    render(<MediaPicker media={media} onSelect={onSelect} onClose={() => undefined} />);

    expect(screen.getByRole("dialog", { name: "Pilih gambar" })).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Laptop di meja" }));

    expect(onSelect).toHaveBeenCalledWith(media[1]);
  });

  it("closes on Escape and with the close button", async () => {
    const onClose = vi.fn();
    render(<MediaPicker media={media} onSelect={() => undefined} onClose={onClose} />);

    await userEvent.keyboard("{Escape}");
    await userEvent.click(screen.getByRole("button", { name: "Tutup" }));

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("says so when the library is empty", () => {
    render(<MediaPicker media={[]} onSelect={() => undefined} onClose={() => undefined} />);

    expect(screen.getByText("Pustaka media masih kosong.")).toBeTruthy();
  });
});
