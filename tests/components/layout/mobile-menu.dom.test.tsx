import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

import { MobileMenu } from "@/components/site/layout/mobile-menu";

const navigation = [
  { href: "/layanan", label: "Layanan" },
  { href: "/artikel", label: "Artikel" },
];

function renderPage() {
  return render(
    <>
      <header>
        <MobileMenu navigation={navigation} phone="0812 3456 789" />
      </header>
      <main id="konten">
        <a href="/di-halaman">Tautan halaman</a>
      </main>
      <footer>Footer</footer>
    </>,
  );
}

describe("MobileMenu focus management", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener: () => undefined, removeEventListener: () => undefined }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("moves focus to the first menu item and makes the page content inert while open", async () => {
    renderPage();
    await userEvent.click(screen.getByRole("button", { name: "Buka menu" }));

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Layanan" }));
    expect(document.querySelector("main")?.hasAttribute("inert")).toBe(true);
    expect(document.querySelector("footer")?.hasAttribute("inert")).toBe(true);
  });

  it("keeps Tab and Shift+Tab inside the toggle and the menu", async () => {
    renderPage();
    await userEvent.click(screen.getByRole("button", { name: "Buka menu" }));
    const toggle = screen.getByRole("button", { name: "Tutup menu" });
    const cta = screen.getByRole("link", { name: "Hubungi kami" });

    cta.focus();
    await userEvent.tab();
    expect(document.activeElement).toBe(toggle);

    await userEvent.tab({ shift: true });
    expect(document.activeElement).toBe(cta);
  });

  it("closes with Escape, restores the page, and returns focus to the toggle", async () => {
    renderPage();
    await userEvent.click(screen.getByRole("button", { name: "Buka menu" }));
    await userEvent.keyboard("{Escape}");

    const toggle = screen.getByRole("button", { name: "Buka menu" });
    expect(document.activeElement).toBe(toggle);
    expect(document.querySelector("main")?.hasAttribute("inert")).toBe(false);
    expect(document.querySelector("footer")?.hasAttribute("inert")).toBe(false);
  });
});
