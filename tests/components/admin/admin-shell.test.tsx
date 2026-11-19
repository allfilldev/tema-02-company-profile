import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/layanan/baru",
  useRouter: () => ({ push: () => undefined, replace: () => undefined, prefetch: () => undefined }),
}));
vi.mock("@/server/actions/admin/auth", () => ({ signIn: vi.fn(), signOut: vi.fn() }));

import { AdminShell } from "@/components/admin/layout/admin-shell";
import { buildAdminMenu } from "@/lib/admin/admin-menu";

const menu = buildAdminMenu(["services", "portfolio", "articles", "team"]);

function render(unreadMessages?: number) {
  return renderToStaticMarkup(
    <AdminShell menu={menu} adminEmail="admin@contoh.id" unreadMessages={unreadMessages}>
      <h1>Layanan baru</h1>
    </AdminShell>,
  );
}

describe("AdminShell", () => {
  const markup = render();

  it("renders one labeled admin navigation with every menu entry as a link", () => {
    expect(markup.match(/<nav[^>]*aria-label="Menu admin"/g)).toHaveLength(1);
    for (const item of menu) {
      expect(markup).toContain(`href="${item.href}"`);
      expect(markup).toContain(item.label);
    }
  });

  it("marks the section of the current path and only that one", () => {
    const current = markup.match(/<a[^>]*aria-current="page"[^>]*>/g) ?? [];

    expect(current).toHaveLength(1);
    expect(current[0]).toContain('href="/admin/layanan"');
  });

  it("does not mark the dashboard for deeper paths", () => {
    expect(markup).not.toMatch(/<a[^>]*href="\/admin"[^>]*aria-current/);
  });

  it("shows who is signed in, a sign out button, and the page content in the main area", () => {
    expect(markup).toContain("admin@contoh.id");
    expect(markup).toMatch(/<button[^>]*type="submit"[^>]*>Keluar<\/button>/);
    expect(markup).toMatch(/<a[^>]*href="\/"[^>]*target="_blank"[^>]*>(?:<svg[\s\S]*?<\/svg>)?Lihat situs<\/a>/);
    expect(markup).toMatch(/<main[^>]*>[\s\S]*<h1>Layanan baru<\/h1>/);
    expect(markup.match(/<main/g)).toHaveLength(1);
  });

  it("groups the menu under MENU, KONTEN and SISTEM in that order", () => {
    const positions = ["MENU", "KONTEN", "SISTEM"].map((title) => markup.indexOf(`>${title}<`));

    expect(positions.every((position) => position >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    expect(markup.indexOf(">Pesan masuk<")).toBeGreaterThan(positions[2]);
    expect(markup.indexOf(">Layanan<")).toBeGreaterThan(positions[1]);
    expect(markup.indexOf(">Layanan<")).toBeLessThan(positions[2]);
  });

  it("uses the dark sidebar and the muted canvas", () => {
    expect(markup).toMatch(/<aside[^>]*class="[^"]*bg-sidebar[^"]*text-sidebar-foreground/);
    expect(markup).toMatch(/<div[^>]*class="[^"]*bg-surface-muted/);
  });

  it("offers a menu search, a fullscreen toggle and an account menu in the topbar", () => {
    expect(markup).toMatch(/<input[^>]*type="search"[^>]*aria-label="Cari menu"|<input[^>]*aria-label="Cari menu"[^>]*type="search"/);
    expect(markup).toMatch(/<button[^>]*aria-label="Layar penuh"/);
    expect(markup).toMatch(/<button[^>]*aria-haspopup="menu"[^>]*aria-label="Menu akun"|<button[^>]*aria-label="Menu akun"[^>]*aria-haspopup="menu"/);
  });

  it("shows the unread message count on the bell and caps large numbers", () => {
    const withUnread = render(7);
    const bell = withUnread.match(/<a[^>]*aria-label="[^"]*7[^"]*"[^>]*href="\/admin\/pesan"|<a[^>]*href="\/admin\/pesan"[^>]*aria-label="[^"]*7[^"]*"/);

    expect(bell).not.toBeNull();
    expect(render(150)).toContain(">99+<");
  });

  it("shows no count badge when there are no unread messages", () => {
    expect(markup).toMatch(/<a[^>]*aria-label="Pesan masuk"/);
    expect(markup).not.toContain("data-unread-badge");
    expect(render(3)).toContain("data-unread-badge");
  });
});
