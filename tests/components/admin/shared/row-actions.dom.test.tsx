import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MoveButtons } from "@/components/admin/shared/move-buttons";
import { PublishToggle } from "@/components/admin/shared/publish-toggle";

describe("MoveButtons", () => {
  it("calls the action with the id and direction, and disables the buttons at the ends", async () => {
    const action = vi.fn(async () => ({ ok: true as const }));
    const { rerender } = render(<MoveButtons id="s1" isFirst={false} isLast={false} action={action} />);

    await userEvent.click(screen.getByRole("button", { name: "Naik" }));
    await userEvent.click(screen.getByRole("button", { name: "Turun" }));
    expect(action).toHaveBeenNthCalledWith(1, "s1", "up");
    expect(action).toHaveBeenNthCalledWith(2, "s1", "down");

    rerender(<MoveButtons id="s1" isFirst isLast={false} action={action} />);
    expect((screen.getByRole("button", { name: "Naik" }) as HTMLButtonElement).disabled).toBe(true);
    rerender(<MoveButtons id="s1" isFirst={false} isLast action={action} />);
    expect((screen.getByRole("button", { name: "Turun" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("shows the reason when the action refuses", async () => {
    const action = vi.fn(async () => ({ ok: false as const, message: "Tidak bisa dipindah." }));
    render(<MoveButtons id="s1" isFirst={false} isLast={false} action={action} />);

    await userEvent.click(screen.getByRole("button", { name: "Naik" }));

    expect((await screen.findByRole("alert")).textContent).toBe("Tidak bisa dipindah.");
  });
});

describe("PublishToggle", () => {
  it("offers Terbitkan for a draft and Tarik for a published item, and passes the new state", async () => {
    const action = vi.fn(async () => ({ ok: true as const }));
    const { rerender } = render(<PublishToggle id="s1" isPublished={false} action={action} />);

    await userEvent.click(screen.getByRole("button", { name: "Terbitkan" }));
    expect(action).toHaveBeenCalledWith("s1", true);

    rerender(<PublishToggle id="s1" isPublished action={action} />);
    await userEvent.click(screen.getByRole("button", { name: "Tarik" }));
    expect(action).toHaveBeenLastCalledWith("s1", false);
  });

  it("shows why publishing was refused", async () => {
    const action = vi.fn(async () => ({ ok: false as const, message: "Belum bisa diterbitkan." }));
    render(<PublishToggle id="s1" isPublished={false} action={action} />);

    await userEvent.click(screen.getByRole("button", { name: "Terbitkan" }));

    expect((await screen.findByRole("alert")).textContent).toBe("Belum bisa diterbitkan.");
  });
});
