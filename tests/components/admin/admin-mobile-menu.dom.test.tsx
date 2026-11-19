import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin",
  useRouter: () => ({ push: () => undefined, replace: () => undefined, prefetch: () => undefined }),
}));

import { AdminMobileMenu } from "@/components/admin/layout/admin-mobile-menu";
import { buildAdminMenu } from "@/lib/admin/admin-menu";

const menu = buildAdminMenu(["services"]);

describe("AdminMobileMenu", () => {
  it("is closed at first and opens and closes with the button", async () => {
    render(<AdminMobileMenu menu={menu} />);
    const button = screen.getByRole("button", { name: "Menu" });

    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("navigation", { name: "Menu admin" })).toBeNull();

    await userEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("navigation", { name: "Menu admin" })).toBeTruthy();

    await userEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes on Escape and gives focus back to the button", async () => {
    render(<AdminMobileMenu menu={menu} />);
    const button = screen.getByRole("button", { name: "Menu" });

    await userEvent.click(button);
    await userEvent.keyboard("{Escape}");

    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(button);
  });

  it("closes after choosing an entry", async () => {
    render(<AdminMobileMenu menu={menu} />);
    const button = screen.getByRole("button", { name: "Menu" });

    await userEvent.click(button);
    await userEvent.click(screen.getByRole("link", { name: "Layanan" }));

    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  it("opens as a modal dialog with the navigation inside and a close button", async () => {
    render(<AdminMobileMenu menu={menu} />);

    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    const dialog = screen.getByRole("dialog");

    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.contains(screen.getByRole("navigation", { name: "Menu admin" }))).toBe(true);
    expect(dialog.contains(screen.getByRole("button", { name: "Tutup menu" }))).toBe(true);
  });

  it("moves focus into the drawer and keeps Tab and Shift+Tab inside it", async () => {
    render(<AdminMobileMenu menu={menu} />);

    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    const dialog = screen.getByRole("dialog");
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));

    expect(dialog.contains(document.activeElement)).toBe(true);

    focusable[focusable.length - 1].focus();
    await userEvent.tab();
    expect(document.activeElement).toBe(focusable[0]);

    await userEvent.tab({ shift: true });
    expect(document.activeElement).toBe(focusable[focusable.length - 1]);
  });

  it("closes with the close button and gives focus back to the menu button", async () => {
    render(<AdminMobileMenu menu={menu} />);
    const button = screen.getByRole("button", { name: "Menu" });

    await userEvent.click(button);
    await userEvent.click(screen.getByRole("button", { name: "Tutup menu" }));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(button);
  });

  it("gives every drawer link and the controls a 44px touch target", async () => {
    render(<AdminMobileMenu menu={menu} />);

    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    const targets = [...screen.getByRole("dialog").querySelectorAll("a[href], button")];

    expect(targets.length).toBeGreaterThan(2);
    for (const target of targets) {
      expect(target.className).toMatch(/min-h-11/);
    }
    expect(screen.getByRole("button", { name: "Menu" }).className).toMatch(/min-h-11/);
    expect(screen.getByRole("button", { name: "Menu" }).className).toMatch(/min-w-11/);
  });
});
