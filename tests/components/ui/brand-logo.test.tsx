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
