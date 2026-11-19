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

const NAV_LINK_CLASS_NAME = "inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-primary";

const COLUMN_TITLE_CLASS_NAME = "font-heading text-lg font-bold text-foreground";

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function Footer({ settings, navigation }: FooterProps) {
  const { address } = settings;
  const hasSocialLinks = settings.socialLinks.length > 0;

  return (
    <footer data-nosnippet className="border-t border-border bg-surface-muted">
      <Container className="grid gap-10 pb-28 pt-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className={COLUMN_TITLE_CLASS_NAME}>{settings.siteName}</p>
          <address className="mt-3 text-sm not-italic text-muted-foreground">
            <p>{address.street}</p>
            <p>
              {address.city}, {address.region} {address.postalCode}, {address.country}
            </p>
            <div className="mt-2 flex flex-col">
              <a href={phoneHref(settings.phone)} className={`${CONTACT_LINK_CLASS_NAME} w-fit`}>
                {settings.phone}
              </a>
              <a href={`mailto:${settings.email}`} className={`${CONTACT_LINK_CLASS_NAME} w-fit`}>
                {settings.email}
              </a>
            </div>
          </address>
        </div>
        <nav aria-label="Navigasi footer" className={hasSocialLinks ? undefined : "md:col-span-2"}>
          <p className={COLUMN_TITLE_CLASS_NAME}>Halaman</p>
          <ul className={hasSocialLinks ? "mt-2" : "mt-2 grid sm:grid-cols-2 sm:gap-x-8"}>
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
          <div>
            <p className={COLUMN_TITLE_CLASS_NAME}>Media sosial</p>
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
        <div className="flex flex-col gap-3 border-t border-border pt-6 md:col-span-4">
          <LegalFooterNav />
          <p className="text-sm text-muted-foreground">&copy; {settings.siteName}. Seluruh hak cipta dilindungi.</p>
        </div>
      </Container>
    </footer>
  );
}
