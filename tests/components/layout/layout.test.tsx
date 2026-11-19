import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it } from "vitest";
import { Footer } from "@/components/site/layout/footer";
import { Header } from "@/components/site/layout/header";
import { SiteShell } from "@/components/site/layout/site-shell";
import { WhatsAppButton } from "@/components/site/layout/whatsapp-button";
import type { SiteContext } from "@/server/site/site-context";
import { buildTestContext } from "../../fixtures/site";

let context: SiteContext;

beforeAll(async () => {
  context = await buildTestContext();
});

function countOccurrences(text: string, part: string): number {
  return text.split(part).length - 1;
}

function renderHeader(): string {
  return renderToStaticMarkup(
    <Header siteName={context.settings.siteName} logo={context.settings.logo} navigation={context.navigation} />,
  );
}

function renderFooter(settings = context.settings): string {
  return renderToStaticMarkup(<Footer settings={settings} navigation={context.navigation} />);
}

describe("Header", () => {
  it("renders the main navigation landmark with every item including Kontak", () => {
    const markup = renderHeader();

    expect(markup).toContain('<nav aria-label="Navigasi utama"');
    for (const item of context.navigation) {
      expect(markup).toContain(`href="${item.href}"`);
      expect(markup).toContain(item.label);
    }
    expect(markup).toMatch(/<a[^>]*href="\/kontak"[^>]*>[^<]*Kontak/);
  });

  it("links the logo to the home page with a visually hidden site name", () => {
    const markup = renderHeader();

    expect(markup).toMatch(/<a[^>]*href="\/"[^>]*>(?:(?!<\/a>).)*<img(?:(?!<\/a>).)*<span class="sr-only">Nusa Karya<\/span><\/a>/s);
    expect(markup).toContain("<img");
  });

  it("falls back to the site name text when there is no logo", () => {
    const markup = renderToStaticMarkup(
      <Header siteName="Nusa Karya" logo={null} navigation={context.navigation} />,
    );

    expect(markup).not.toContain("<img");
    expect(markup).toContain("Nusa Karya");
  });

  it("starts with a skip link to the main content", () => {
    const markup = renderHeader();

    expect(markup).toMatch(/<a[^>]*href="#konten"[^>]*>Lewati ke konten utama<\/a>/);
    expect(markup.indexOf("Lewati ke konten utama")).toBeLessThan(markup.indexOf("<nav"));
  });

  it("renders a mobile menu button that controls the mobile navigation", () => {
    const markup = renderHeader();

    expect(markup).toMatch(/<button[^>]*aria-expanded="false"[^>]*>/);
    expect(markup).toMatch(/<button[^>]*aria-controls="menu-mobile"[^>]*>/);
    expect(markup).toMatch(/<button[^>]*class="[^"]*min-h-11[^"]*min-w-11/);
  });

  it("renders no h1", () => {
    expect(renderHeader()).not.toContain("<h1");
  });
});

describe("Footer", () => {
  it("is marked data-nosnippet", () => {
    expect(renderFooter()).toMatch(/^<footer[^>]*data-nosnippet/);
  });

  it("shows the NAP exactly as the organization json-ld does", () => {
    const markup = renderFooter();
    const { contactPoint, address } = context.organizationJsonLd as {
      contactPoint: { telephone: string; email: string };
      address: { streetAddress: string; addressLocality: string; addressRegion: string; postalCode: string; addressCountry: string };
    };

    expect(markup).toContain(context.organizationJsonLd.name as string);
    expect(markup).toContain(address.streetAddress);
    expect(markup).toContain(address.addressLocality);
    expect(markup).toContain(address.addressRegion);
    expect(markup).toContain(address.postalCode);
    expect(markup).toContain(address.addressCountry);
    expect(markup).toContain(contactPoint.telephone);
    expect(markup).toContain(contactPoint.email);
    expect(markup).toContain(`href="mailto:${context.settings.email}"`);
    expect(markup).toContain(`href="tel:${context.settings.phone.replace(/\s+/g, "")}"`);
  });

  it("links to Tentang and Kontak and renders the legal navigation", () => {
    const markup = renderFooter();

    expect(markup).toContain('href="/tentang"');
    expect(markup).toContain('href="/kontak"');
    expect(markup).toContain('aria-label="Informasi hukum"');
    expect(markup).toContain('href="/privasi"');
    expect(markup).toContain('href="/syarat-ketentuan"');
    expect(markup).toContain('href="/kebijakan-editorial"');
  });

  it("renders social links as safe external links", () => {
    const markup = renderFooter();

    for (const link of context.settings.socialLinks) {
      expect(markup).toMatch(new RegExp(`<a[^>]*href="${link.url}"[^>]*>`));
      expect(markup).toContain(link.platform);
    }
    expect(countOccurrences(markup, 'rel="noopener noreferrer"')).toBe(context.settings.socialLinks.length);
    expect(countOccurrences(markup, 'target="_blank"')).toBe(context.settings.socialLinks.length);
  });

  it("omits the social block when there are no social links", () => {
    const markup = renderFooter({ ...context.settings, socialLinks: [] });

    expect(markup).not.toContain("Media sosial");
    expect(markup).not.toContain("noopener");
  });

  it("renders no demo notice", () => {
    expect(renderFooter()).not.toContain("Situs demo");
  });

  it("renders no h1", () => {
    expect(renderFooter()).not.toContain("<h1");
  });
});

describe("WhatsAppButton", () => {
  const href = "https://wa.me/62895326422692?text=Halo%2C%20saya%20ingin%20konsultasi";

  it("is an external link to the given href with the exact text", () => {
    const markup = renderToStaticMarkup(<WhatsAppButton href={href} />);

    expect(markup).toContain(`href="${href}"`);
    expect(markup).toContain("Chat WhatsApp Sekarang");
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain('target="_blank"');
  });

  it("is fixed and centered at the bottom", () => {
    const markup = renderToStaticMarkup(<WhatsAppButton href={href} />);
    const classNames = markup.match(/class="([^"]*)"/)?.[1].split(" ") ?? [];

    expect(classNames).toContain("fixed");
    expect(classNames).toContain("left-1/2");
    expect(classNames).toContain("-translate-x-1/2");
    expect(classNames.some((name) => name.startsWith("bottom-"))).toBe(true);
  });
});

describe("SiteShell", () => {
  function renderShell(): string {
    return renderToStaticMarkup(
      <SiteShell context={context}>
        <h1>Judul halaman</h1>
        <p>Isi halaman uji</p>
      </SiteShell>,
    );
  }

  it("renders exactly one main with id konten and a bottom padding class", () => {
    const markup = renderShell();
    const mainTag = markup.match(/<main[^>]*>/)?.[0] ?? "";

    expect(countOccurrences(markup, "<main")).toBe(1);
    expect(mainTag).toContain('id="konten"');
    expect(mainTag).toMatch(/class="[^"]*\bpb-\S+/);
  });

  it("renders every child inside the main", () => {
    const markup = renderShell();
    const inner = markup.slice(markup.indexOf("<main"), markup.indexOf("</main>"));

    expect(inner).toContain("<h1>Judul halaman</h1>");
    expect(inner).toContain("<p>Isi halaman uji</p>");
  });

  it("composes header, main, footer, and the whatsapp button in order", () => {
    const markup = renderShell();

    expect(markup.indexOf("<header")).toBeLessThan(markup.indexOf("<main"));
    expect(markup.indexOf("</main>")).toBeLessThan(markup.indexOf("<footer"));
    expect(markup.indexOf("<footer")).toBeLessThan(markup.indexOf("Chat WhatsApp Sekarang"));
    expect(markup).toContain(`href="${context.whatsappUrl}"`);
  });

  it("renders no demo notice in demo mode either", () => {
    expect(renderShell()).not.toContain("Situs demo");
  });
});
