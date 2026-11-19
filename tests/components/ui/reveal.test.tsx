import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Reveal } from "@/components/ui/reveal";

describe("Reveal", () => {
  it("renders its children visible on the server", () => {
    const markup = renderToStaticMarkup(
      <Reveal>
        <p>Isi bagian</p>
      </Reveal>,
    );

    expect(markup).toContain('data-reveal="visible"');
    expect(markup).not.toContain('data-reveal="hidden"');
    expect(markup).toContain("<p>Isi bagian</p>");
  });

  it("renders a div by default and the requested element when asked", () => {
    expect(renderToStaticMarkup(<Reveal>a</Reveal>)).toMatch(/^<div /);
    expect(renderToStaticMarkup(<Reveal as="section">a</Reveal>)).toMatch(/^<section /);
    expect(renderToStaticMarkup(<Reveal as="li">a</Reveal>)).toMatch(/^<li /);
  });

  it("sets the delay variable only when a delay is given", () => {
    expect(renderToStaticMarkup(<Reveal delay={120}>a</Reveal>)).toContain("--reveal-delay:120ms");
    expect(renderToStaticMarkup(<Reveal>a</Reveal>)).not.toContain("--reveal-delay");
  });

  it("passes the class name through", () => {
    expect(renderToStaticMarkup(<Reveal className="mt-4">a</Reveal>)).toContain('class="mt-4"');
  });

  it("renders a variant attribute only for non-default variants", () => {
    expect(renderToStaticMarkup(<Reveal>a</Reveal>)).not.toContain("data-reveal-variant");
    expect(renderToStaticMarkup(<Reveal variant="up">a</Reveal>)).not.toContain("data-reveal-variant");
    expect(renderToStaticMarkup(<Reveal variant="fade">a</Reveal>)).toContain('data-reveal-variant="fade"');
  });

  it("derives the delay from stagger and lets an explicit delay win", () => {
    expect(renderToStaticMarkup(<Reveal stagger={2}>a</Reveal>)).toContain("--reveal-delay:160ms");
    expect(renderToStaticMarkup(<Reveal stagger={2} delay={50}>a</Reveal>)).toContain("--reveal-delay:50ms");
    expect(renderToStaticMarkup(<Reveal stagger={0}>a</Reveal>)).not.toContain("--reveal-delay");
  });
});
