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

function render() {
  return renderToStaticMarkup(
    <AdminShell menu={menu} adminEmail="admin@contoh.id">
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
    expect(markup).toMatch(/<main[^>]*>[\s\S]*<h1>Layanan baru<\/h1>/);
    expect(markup.match(/<main/g)).toHaveLength(1);
  });
});
