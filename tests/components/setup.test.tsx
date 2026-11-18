import Image from "next/image";
import Link from "next/link";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

describe("tsx test tooling", () => {
  it("renders next/link as a plain anchor", () => {
    const markup = renderToStaticMarkup(<Link href="/kontak">Hubungi kami</Link>);

    expect(markup).toBe('<a href="/kontak">Hubungi kami</a>');
  });

  it("renders next/image as a plain img without non-dom props", () => {
    const markup = renderToStaticMarkup(
      <Image src="/demo/general/hero.webp" alt="Tim sedang berdiskusi" width={1200} height={800} priority />,
    );

    expect(markup).toContain("<img");
    expect(markup).toContain('src="/demo/general/hero.webp"');
    expect(markup).toContain('alt="Tim sedang berdiskusi"');
    expect(markup).toContain('width="1200"');
    expect(markup).not.toContain("priority");
  });
});
