import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";

describe("ConfirmDelete", () => {
  it("asks first with the exact confirmation text and deletes only after the second Hapus", async () => {
    const action = vi.fn(async () => ({ ok: true as const }));
    render(<ConfirmDelete itemName="Penyusunan SOP" action={action} />);

    await userEvent.click(screen.getByRole("button", { name: "Hapus" }));
    const dialog = screen.getByRole("alertdialog");
    expect(dialog.textContent).toContain("Hapus Penyusunan SOP? Tindakan ini tidak bisa dibatalkan.");
    expect(action).not.toHaveBeenCalled();

    await userEvent.click(within(dialog).getByRole("button", { name: "Hapus" }));
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("closes on Batal and on Escape without deleting", async () => {
    const action = vi.fn(async () => ({ ok: true as const }));
    render(<ConfirmDelete itemName="SOP" action={action} />);

    await userEvent.click(screen.getByRole("button", { name: "Hapus" }));
    await userEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(screen.queryByRole("alertdialog")).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: "Hapus" }));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(action).not.toHaveBeenCalled();
  });

  it("keeps the dialog open and shows the reason when the action refuses", async () => {
    const action = vi.fn(async () => ({ ok: false as const, message: "Gambar ini masih dipakai di: Layanan: A." }));
    render(<ConfirmDelete itemName="Gambar" action={action} />);

    await userEvent.click(screen.getByRole("button", { name: "Hapus" }));
    await userEvent.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Hapus" }));

    expect(await screen.findByText("Gambar ini masih dipakai di: Layanan: A.")).toBeTruthy();
    expect(screen.getByRole("alertdialog")).toBeTruthy();
  });
});
