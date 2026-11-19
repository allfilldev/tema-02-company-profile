import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BrandLogo } from "@/components/ui/brand-logo";

describe("BrandLogo", () => {
  it("renders the light tone with the brand mark and name", () => {
    const markup = renderToStaticMarkup(<BrandLogo tone="on-light" name="Nusa Karya" />);

    expect(markup).toContain("Nusa Karya");
    expect(markup).toContain("font-heading");
    expect(markup).toContain("font-bold");
    expect(markup).toContain("text-brand");
    expect(markup).toContain("bg-brand");
    expect(markup).toContain("text-brand-foreground");
    expect(markup).toContain(">N<");
  });

  it("renders the dark tone with inverse foreground colors", () => {
    const markup = renderToStaticMarkup(<BrandLogo tone="on-dark" name="Nusa Karya" className="extra" />);

    expect(markup).toContain("Nusa Karya");
    expect(markup).toContain("text-surface-inverse-foreground");
    expect(markup).toContain("bg-surface-inverse-foreground");
    expect(markup).toContain("text-surface-inverse");
    expect(markup).toContain("extra");
    expect(markup).not.toContain("<a");
  });

  it("renders a link when href is given", () => {
    const markup = renderToStaticMarkup(<BrandLogo tone="on-light" name="Nusa Karya" href="/" />);

    expect(markup).toContain('href="/"');
  });
});

describe("BrandLogo with a configured logo image", () => {
  const logo = { id: "logo", url: "/demo/logo.webp", alt: "Logo Nusa Karya", width: 240, height: 64 };

  it("renders the image white on dark and keeps the name for screen readers", () => {
    const markup = renderToStaticMarkup(<BrandLogo tone="on-dark" name="Nusa Karya" logo={logo} href="/" />);

    expect(markup).toContain("<img");
    expect(markup).toContain("brightness-0");
    expect(markup).toContain("invert");
    expect(markup).toContain('<span class="sr-only">Nusa Karya</span>');
    expect(markup).not.toContain(">N<");
  });

  it("renders the image unchanged on light", () => {
    const markup = renderToStaticMarkup(<BrandLogo tone="on-light" name="Nusa Karya" logo={logo} />);

    expect(markup).toContain("<img");
    expect(markup).not.toContain("brightness-0");
  });

  it("falls back to the letter mark when the logo is null", () => {
    const markup = renderToStaticMarkup(<BrandLogo tone="on-light" name="Nusa Karya" logo={null} />);

    expect(markup).not.toContain("<img");
    expect(markup).toContain(">N<");
  });
});
