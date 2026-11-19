import Link from "next/link";
import { LegalFooterNav } from "@/components/site/contract/legal-footer-nav";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { SiteSettings } from "@/core/domain/settings/site-settings";
import type { NavigationItem } from "@/server/site/navigation";

type FooterProps = {
  settings: SiteSettings;
  navigation: NavigationItem[];
};

const CONTACT_LINK_CLASS_NAME = "inline-flex min-h-11 items-center underline underline-offset-4 hover:text-primary";

const NAV_LINK_CLASS_NAME = "inline-flex min-h-11 items-center text-muted-foreground hover:text-primary";

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function Footer({ settings, navigation }: FooterProps) {
  const { address } = settings;

  return (
    <footer data-nosnippet className="border-t border-border bg-surface-muted">
      <Container className="grid gap-10 pb-28 pt-12 md:grid-cols-3">
        <div>
          <p className="font-heading text-lg font-bold text-foreground">{settings.siteName}</p>
          <address className="mt-3 text-sm not-italic text-muted-foreground">
            <p>{address.street}</p>
            <p>
              {address.city}, {address.region} {address.postalCode}
            </p>
            <p>{address.country}</p>
            <p>
              <a href={phoneHref(settings.phone)} className={CONTACT_LINK_CLASS_NAME}>
                {settings.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${settings.email}`} className={CONTACT_LINK_CLASS_NAME}>
                {settings.email}
              </a>
            </p>
          </address>
        </div>
        <nav aria-label="Navigasi footer">
          <p className="font-semibold text-foreground">Halaman</p>
          <ul className="mt-2">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={NAV_LINK_CLASS_NAME}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {settings.socialLinks.length > 0 ? (
          <div>
            <p className="font-semibold text-foreground">Media sosial</p>
            <ul className="mt-2">
              {settings.socialLinks.map((link) => (
                <li key={link.url}>
                  <ButtonLink href={link.url} external variant="ghost" className="-ml-5">
                    {link.platform}
                  </ButtonLink>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="flex flex-col gap-3 border-t border-border pt-6 md:col-span-3">
          <LegalFooterNav />
          <p className="text-sm text-muted-foreground">&copy; {settings.siteName}. Seluruh hak cipta dilindungi.</p>
        </div>
      </Container>
    </footer>
  );
}
