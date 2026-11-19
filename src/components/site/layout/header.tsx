import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteImage } from "@/components/ui/site-image";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import type { NavigationItem } from "@/server/site/navigation";
import { MobileMenu } from "./mobile-menu";

type HeaderProps = {
  siteName: string;
  logo: MediaAsset | null;
  navigation: NavigationItem[];
};

export function Header({ siteName, logo, navigation }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-3 focus:font-semibold focus:text-primary-foreground"
      >
        Lewati ke konten utama
      </a>
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2">
          {logo ? (
            <>
              <SiteImage media={logo} eager className="max-h-14 w-auto" />
              <span className="sr-only">{siteName}</span>
            </>
          ) : (
            <span className="font-heading text-lg font-bold text-foreground">{siteName}</span>
          )}
        </Link>
        <nav aria-label="Navigasi utama">
          <MobileMenu navigation={navigation} />
        </nav>
      </Container>
    </header>
  );
}
