import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";

describe("IconButton", () => {
  it("renders a round labelled button with a minimum touch target", () => {
    const markup = renderToStaticMarkup(
      <IconButton tone="highlight" label="Lanjut">
        <span>icon</span>
      </IconButton>,
    );

    expect(markup).toContain('aria-label="Lanjut"');
    expect(markup).toContain("rounded-full");
    expect(markup).toContain("min-h-11");
    expect(markup).toContain("min-w-11");
    expect(markup).toContain("bg-highlight");
    expect(markup).toContain("icon");
  });

  it("supports the lg size, other tones, and extra class names", () => {
    const markup = renderToStaticMarkup(
      <IconButton tone="inverse" label="Tutup" size="lg" className="extra" />,
    );

    expect(markup).toContain("min-h-12");
    expect(markup).toContain("bg-surface");
    expect(markup).toContain("extra");
    expect(renderToStaticMarkup(<IconButton tone="primary" label="Ok" />)).toContain("bg-primary");
  });
});

describe("Button highlight variant", () => {
  it("uses the highlight tokens", () => {
    const markup = renderToStaticMarkup(<Button variant="highlight">Mulai</Button>);

    expect(markup).toContain("bg-highlight");
    expect(markup).toContain("text-highlight-foreground");
    expect(markup).toContain("hover:bg-highlight-hover");
  });
});
