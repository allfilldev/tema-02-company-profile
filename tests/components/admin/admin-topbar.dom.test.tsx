import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin",
  useRouter: () => ({ push, replace: () => undefined, prefetch: () => undefined }),
}));

import { AdminAccountMenu } from "@/components/admin/layout/admin-account-menu";
import { AdminFullscreenToggle } from "@/components/admin/layout/admin-fullscreen-toggle";
import { AdminSearch } from "@/components/admin/layout/admin-search";
import { buildAdminMenu } from "@/lib/admin/admin-menu";

const menu = buildAdminMenu(["services", "portfolio", "articles"]);

describe("AdminSearch", () => {
  beforeEach(() => push.mockClear());

  it("shows no results until something is typed", () => {
    render(<AdminSearch menu={menu} />);

    expect(screen.queryByRole("list")).toBeNull();
  });

  it("filters the menu entries by label, ignoring case", async () => {
    render(<AdminSearch menu={menu} />);

    await userEvent.type(screen.getByRole("searchbox", { name: "Cari menu" }), "pOrto");

    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual(["Portofolio"]);
    expect(links[0].getAttribute("href")).toBe("/admin/portofolio");
  });

  it("says so when nothing matches", async () => {
    render(<AdminSearch menu={menu} />);

    await userEvent.type(screen.getByRole("searchbox", { name: "Cari menu" }), "zzz");

    expect(screen.getByText("Menu tidak ditemukan")).toBeTruthy();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("opens the first match on Enter and clears on Escape", async () => {
    render(<AdminSearch menu={menu} />);
    const input = screen.getByRole("searchbox", { name: "Cari menu" });

    await userEvent.type(input, "art{Enter}");
    expect(push).toHaveBeenCalledWith("/admin/artikel");

    await userEvent.clear(input);
    await userEvent.type(input, "lay{Escape}");
    expect((input as HTMLInputElement).value).toBe("");
  });
});

describe("AdminFullscreenToggle", () => {
  it("requests fullscreen and exits it again", async () => {
    const requestFullscreen = vi.fn().mockResolvedValue(undefined);
    const exitFullscreen = vi.fn().mockResolvedValue(undefined);
    document.documentElement.requestFullscreen = requestFullscreen;
    document.exitFullscreen = exitFullscreen;
    render(<AdminFullscreenToggle />);
    const button = screen.getByRole("button", { name: "Layar penuh" });

    await userEvent.click(button);
    expect(requestFullscreen).toHaveBeenCalledTimes(1);

    Object.defineProperty(document, "fullscreenElement", { configurable: true, value: document.documentElement });
    document.dispatchEvent(new Event("fullscreenchange"));
    await userEvent.click(await screen.findByRole("button", { name: "Keluar dari layar penuh" }));
    expect(exitFullscreen).toHaveBeenCalledTimes(1);

    Object.defineProperty(document, "fullscreenElement", { configurable: true, value: null });
  });
});

describe("AdminAccountMenu", () => {
  it("toggles the panel with the account button and closes on Escape", async () => {
    render(
      <AdminAccountMenu email="admin@contoh.id">
        <button type="button">Keluar</button>
      </AdminAccountMenu>,
    );
    const trigger = screen.getByRole("button", { name: "Menu akun" });

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    await userEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("button", { name: "Keluar" })).toBeTruthy();

    await userEvent.keyboard("{Escape}");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  });
});
