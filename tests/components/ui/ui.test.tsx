import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/ui/section";
import { SiteImage } from "@/components/ui/site-image";
import { Textarea } from "@/components/ui/textarea";
import { generalPack } from "@/content/packs/general";
import { generalMedia } from "@/content/packs/general/media";
import { isKnownIconName } from "@/lib/icons/icon-names";

describe("Button and ButtonLink", () => {
  it("forwards disabled and type to the button element", () => {
    const markup = renderToStaticMarkup(
      <Button type="submit" disabled>
        Kirim
      </Button>,
    );

    expect(markup).toContain("<button");
    expect(markup).toContain('type="submit"');
    expect(markup).toContain('disabled=""');
    expect(markup).toContain("Kirim");
  });

  it("defaults the button type to button", () => {
    expect(renderToStaticMarkup(<Button>Klik</Button>)).toContain('type="button"');
  });

  it("does not render the disabled attribute unless requested", () => {
    expect(renderToStaticMarkup(<Button>Klik</Button>)).not.toContain('disabled=""');
  });

  it("opens external links safely in a new tab", () => {
    const markup = renderToStaticMarkup(
      <ButtonLink href="https://wa.me/62895326422692" external>
        Chat WhatsApp
      </ButtonLink>,
    );

    expect(markup).toContain('href="https://wa.me/62895326422692"');
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain('target="_blank"');
  });

  it("never lets a caller drop the safe rel and target of an external link", () => {
    const markup = renderToStaticMarkup(
      <ButtonLink href="https://example.com" external rel="nofollow" target="_self">
        Keluar
      </ButtonLink>,
    );

    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).not.toContain("nofollow");
    expect(markup).toContain('target="_blank"');
    expect(markup).not.toContain('target="_self"');
  });

  it("keeps internal links in the same tab without rel", () => {
    const markup = renderToStaticMarkup(<ButtonLink href="/kontak">Hubungi kami</ButtonLink>);

    expect(markup).toContain('href="/kontak"');
    expect(markup).not.toContain("target=");
    expect(markup).not.toContain("rel=");
  });

  it("applies a different class for every variant and size", () => {
    const variants = (["primary", "secondary", "ghost"] as const).map((variant) =>
      renderToStaticMarkup(<Button variant={variant}>A</Button>),
    );
    const sizes = (["md", "lg"] as const).map((size) => renderToStaticMarkup(<Button size={size}>A</Button>));

    expect(new Set(variants).size).toBe(3);
    expect(new Set(sizes).size).toBe(2);
  });
});

describe("Card, Badge, and Container", () => {
  it("renders children inside a card", () => {
    expect(renderToStaticMarkup(<Card>Isi kartu</Card>)).toContain("Isi kartu");
  });

  it("renders a badge as an inline element", () => {
    expect(renderToStaticMarkup(<Badge>Baru</Badge>)).toMatch(/^<span[^>]*>Baru<\/span>$/);
  });

  it("renders the requested container element and defaults to div", () => {
    expect(renderToStaticMarkup(<Container>a</Container>)).toMatch(/^<div/);
    expect(renderToStaticMarkup(<Container as="main">a</Container>)).toMatch(/^<main/);
    expect(renderToStaticMarkup(<Container as="section">a</Container>)).toMatch(/^<section/);
  });
});

describe("Section", () => {
  it("renders the title as h2 and never as h1", () => {
    const markup = renderToStaticMarkup(
      <Section id="layanan" eyebrow="Layanan" title="Layanan kami" description="Ringkasan layanan">
        <p>Isi</p>
      </Section>,
    );

    expect(markup).toContain("<h2");
    expect(markup).toContain("Layanan kami");
    expect(markup).not.toContain("<h1");
    expect(markup).toContain('id="layanan"');
    expect(markup).toContain("Layanan</p>");
    expect(markup).toContain("Ringkasan layanan");
    expect(markup).toContain("<p>Isi</p>");
  });

  it("labels the section by its title when an id is given", () => {
    const markup = renderToStaticMarkup(
      <Section id="tim" title="Tim kami">
        x
      </Section>,
    );

    expect(markup).toContain('aria-labelledby="tim-title"');
    expect(markup).toContain('id="tim-title"');
  });

  it("renders no heading when there is no title", () => {
    expect(renderToStaticMarkup(<Section>Isi saja</Section>)).not.toContain("<h2");
  });
});

describe("Field, Input, and Textarea", () => {
  it("associates the label with the control through for and id", () => {
    const markup = renderToStaticMarkup(
      <Field label="Nama lengkap" htmlFor="name">
        <Input id="name" name="name" />
      </Field>,
    );

    expect(markup).toContain("<label");
    expect(markup).toContain('for="name"');
    expect(markup).toContain('id="name"');
    expect(markup).toContain("Nama lengkap");
  });

  it("shows the error message and links it to an invalid control", () => {
    const markup = renderToStaticMarkup(
      <Field label="Email" htmlFor="email" error="Email wajib diisi">
        <Input id="email" type="email" invalid />
      </Field>,
    );

    expect(markup).toContain('role="alert"');
    expect(markup).toContain('id="email-error"');
    expect(markup).toContain("Email wajib diisi");
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('aria-describedby="email-error"');
  });

  it("renders no error element and no aria-invalid when valid", () => {
    const markup = renderToStaticMarkup(
      <Field label="Telepon" htmlFor="phone">
        <Input id="phone" />
      </Field>,
    );

    expect(markup).not.toContain(`role="alert"`);
    expect(markup).not.toContain("aria-invalid=");
  });

  it("renders a textarea with its attributes", () => {
    const markup = renderToStaticMarkup(<Textarea id="message" name="message" rows={5} invalid />);

    expect(markup).toContain("<textarea");
    expect(markup).toContain('rows="5"');
    expect(markup).toContain('aria-describedby="message-error"');
  });
});

describe("SiteImage", () => {
  it("takes width, height, and alt from the media asset", () => {
    const media = generalMedia["hero"];
    const markup = renderToStaticMarkup(<SiteImage media={media} sizes="100vw" priority className="rounded-lg" />);

    expect(markup).toContain("<img");
    expect(markup).toContain(`src="${media.url}"`);
    expect(markup).toContain(`width="${media.width}"`);
    expect(markup).toContain(`height="${media.height}"`);
    expect(markup).toContain(`alt="${media.alt}"`);
    expect(markup).toContain('sizes="100vw"');
    expect(markup).toContain("rounded-lg");
  });
});

describe("Icon", () => {
  it("renders an svg for an unknown name without throwing", () => {
    for (const name of ["tidak-dikenal", "", "constructor", "__proto__"]) {
      expect(renderToStaticMarkup(<Icon name={name} />)).toContain("<svg");
    }
  });

  it("renders a different icon for a known name than the fallback", () => {
    expect(renderToStaticMarkup(<Icon name="search" />)).not.toBe(renderToStaticMarkup(<Icon name="tidak-dikenal" />));
  });

  it("hides the icon from assistive technology and accepts a class name", () => {
    const markup = renderToStaticMarkup(<Icon name="users" className="size-8" />);

    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain("size-8");
  });

  it("maps every icon name used by the general content blocks", () => {
    const iconNames = generalPack.contentBlocks
      .flatMap((block) => block.items)
      .map((item) => item.icon)
      .filter((icon): icon is string => icon !== null);

    expect(iconNames.length).toBeGreaterThan(0);
    for (const name of iconNames) {
      expect(isKnownIconName(name), name).toBe(true);
    }
  });

  it("does not treat unknown names as known", () => {
    expect(isKnownIconName("tidak-dikenal")).toBe(false);
    expect(isKnownIconName("constructor")).toBe(false);
  });
});
