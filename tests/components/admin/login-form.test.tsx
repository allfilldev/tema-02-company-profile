import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/server/actions/admin/auth", () => ({ signIn: vi.fn(), signOut: vi.fn() }));

import { LoginForm } from "@/components/admin/login-form";
import { headingsOf } from "../../fixtures/markup";

describe("LoginForm", () => {
  const markup = renderToStaticMarkup(<LoginForm />);

  it("renders one h1", () => {
    expect(headingsOf(markup).filter(({ level }) => level === 1).map(({ text }) => text)).toEqual(["Masuk admin"]);
  });

  it("connects labels to the inputs with the right types and autocomplete", () => {
    expect(markup).toMatch(/<label[^>]*for="login-email"[^>]*>Email/);
    expect(markup).toMatch(/<input[^>]*id="login-email"[^>]*type="email"/);
    expect(markup).toContain('autoComplete="email"');
    expect(markup).toMatch(/<label[^>]*for="login-password"[^>]*>Password/);
    expect(markup).toMatch(/<input[^>]*id="login-password"[^>]*type="password"/);
    expect(markup).toContain('autoComplete="current-password"');
  });

  it("has a submit button and no error before submitting", () => {
    expect(markup).toMatch(/<button[^>]*type="submit"[^>]*>Masuk<\/button>/);
    expect(markup).not.toContain('role="alert"');
  });

  it("uses the large rounded card on the muted canvas and a full-size submit button", () => {
    expect(markup).toMatch(/<main[^>]*class="[^"]*bg-surface-muted/);
    expect(markup).toMatch(/<div[^>]*class="[^"]*rounded-2xl[^"]*border-border/);
    expect(markup).toMatch(/<button[^>]*class="[^"]*w-full[^"]*"[^>]*type="submit"|<button[^>]*type="submit"[^>]*class="[^"]*w-full/);
  });
});

describe("LoginForm brand", () => {
  it("shows the given site name", () => {
    const markup = renderToStaticMarkup(<LoginForm siteName="All Fill Dev" />);

    expect(markup).toContain("All Fill Dev");
  });

  it("shows the site logo when provided", () => {
    const logo = { id: "logo", url: "/demo/logo.webp", alt: "Logo All Fill Dev", width: 240, height: 64 };
    const markup = renderToStaticMarkup(<LoginForm siteName="All Fill Dev" siteLogo={logo} />);

    expect(markup).toContain("logo.webp");
    expect(markup).not.toContain("brightness-0");
    expect(markup).toMatch(/<span class="sr-only">All Fill Dev<\/span>/);
  });
});
