import Link from "next/link";
import { WaveEdge } from "@/components/site/sections/wave-edge";
import { LegalFooterNav } from "@/components/site/contract/legal-footer-nav";
import { BrandLogo } from "@/components/ui/brand-logo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import type { SiteSettings } from "@/core/domain/settings/site-settings";
import { formatAddressRegionLine } from "@/lib/site/postal-code";
import type { NavigationItem } from "@/server/site/navigation";

type FooterProps = {
  settings: SiteSettings;
  navigation: NavigationItem[];
};

const CONTACT_LINK_CLASS_NAME =
  "inline-flex min-h-11 min-w-11 w-fit items-center break-all text-surface-inverse-foreground hover:text-highlight";

const NAV_LINK_CLASS_NAME =
  "inline-flex min-h-11 min-w-11 items-center text-sm text-surface-inverse-foreground/80 hover:text-highlight";

const COLUMN_TITLE_CLASS_NAME = "font-heading text-lg font-bold text-surface-inverse-foreground";

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function Footer({ settings, navigation }: FooterProps) {
  const { address } = settings;
  const hasSocialLinks = settings.socialLinks.length > 0;

  return (
    <footer data-nosnippet className="relative bg-surface-inverse text-surface-inverse-foreground">
      <WaveEdge edge="top" tone="inverse" />
      <Container className="grid gap-10 pb-32 pt-12 md:grid-cols-2 md:gap-x-12 lg:grid-cols-12 lg:gap-x-10">
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-surface-inverse-foreground/15 bg-surface-inverse-foreground/5 p-6 md:col-span-2 md:flex-row md:items-center md:justify-between md:p-8 lg:col-span-12">
          <p className="font-heading text-2xl font-bold tracking-tight text-surface-inverse-foreground">
            Siap memulai bersama kami?
          </p>
          <ButtonLink href="/kontak" variant="highlight" size="lg">
            Hubungi kami
          </ButtonLink>
        </div>
        <div className="min-w-0 lg:col-span-4">
          <BrandLogo tone="on-dark" name={settings.siteName} href="/" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-surface-inverse-foreground/80">{settings.tagline}</p>
        </div>
        <nav aria-label="Navigasi footer" className={hasSocialLinks ? "lg:col-span-3" : "lg:col-span-4"}>
          <p className={COLUMN_TITLE_CLASS_NAME}>Halaman</p>
          <ul className="mt-2 grid grid-cols-2 gap-x-6">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={NAV_LINK_CLASS_NAME}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {hasSocialLinks ? (
          <div className="lg:col-span-2">
            <p className={COLUMN_TITLE_CLASS_NAME}>Media sosial</p>
            <ul className="mt-2">
              {settings.socialLinks.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className={NAV_LINK_CLASS_NAME}>
                    {link.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className={`min-w-0 ${hasSocialLinks ? "lg:col-span-3" : "lg:col-span-4"}`}>
          <p className={COLUMN_TITLE_CLASS_NAME}>Kontak</p>
          <address className="mt-3 flex flex-col gap-4 text-sm not-italic text-surface-inverse-foreground/80">
            <div className="flex items-start gap-3">
              <Icon name="map-pin" className="mt-0.5 size-5 shrink-0 text-highlight" />
              <div>
                <p>{address.street}</p>
                <p>
                  {formatAddressRegionLine(address)}, {address.country}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="phone" className="size-5 shrink-0 text-highlight" />
              <a href={phoneHref(settings.phone)} className={CONTACT_LINK_CLASS_NAME}>
                {settings.phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="mail" className="size-5 shrink-0 text-highlight" />
              <a href={`mailto:${settings.email}`} className={CONTACT_LINK_CLASS_NAME}>
                {settings.email}
              </a>
            </div>
            {settings.openingHours ? (
              <div className="flex items-start gap-3">
                <Icon name="clock" className="mt-0.5 size-5 shrink-0 text-highlight" />
                <p>{settings.openingHours}</p>
              </div>
            ) : null}
          </address>
        </div>
        <div className="flex flex-col gap-3 border-t border-surface-inverse-foreground/20 pt-6 md:col-span-2 lg:col-span-12">
          <LegalFooterNav />
          <p className="text-sm text-surface-inverse-foreground/80">
            &copy; {new Date().getFullYear()}. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </Container>
    </footer>
  );
}
