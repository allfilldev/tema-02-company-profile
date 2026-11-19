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
});
