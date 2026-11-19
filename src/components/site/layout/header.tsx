"use client";

import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import { joinClassNames } from "@/lib/ui/class-names";
import type { NavigationItem } from "@/server/site/navigation";
import { MobileMenu } from "./mobile-menu";

type HeaderProps = {
  siteName: string;
  logo: MediaAsset | null;
  navigation: NavigationItem[];
  phone?: string;
};

const SCROLL_THRESHOLD_PX = 8;
const CONTACT_LABEL = "Hubungi kami";

const HEADER_BASE_CLASS_NAME = "fixed inset-x-0 top-0 z-30 transition-colors duration-300";
const HEADER_DARK_CLASS_NAME = "bg-transparent text-surface-inverse-foreground";
const HEADER_OPEN_CLASS_NAME = "bg-surface-inverse text-surface-inverse-foreground";
const HEADER_SCROLLED_CLASS_NAME = "bg-surface/95 text-foreground shadow-soft backdrop-blur";

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function Header({ siteName, logo, navigation, phone }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const light = scrolled && !menuOpen;

  useEffect(() => {
    function updateScrolled() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    }
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  const stateClassName = light ? HEADER_SCROLLED_CLASS_NAME : menuOpen ? HEADER_OPEN_CLASS_NAME : HEADER_DARK_CLASS_NAME;

  return (
    <header className={joinClassNames(HEADER_BASE_CLASS_NAME, stateClassName)}>
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-3 focus:font-semibold focus:text-primary-foreground"
      >
        Lewati ke konten utama
      </a>
      <Container className="flex min-h-16 items-center justify-between gap-4 md:min-h-20 md:gap-6">
        <BrandLogo tone={light ? "on-light" : "on-dark"} name={siteName} logo={logo} href="/" className="shrink-0" />
        <nav aria-label="Navigasi utama" className="md:flex md:flex-1 md:justify-center">
          <MobileMenu navigation={navigation} onOpenChange={setMenuOpen} phone={phone} />
        </nav>
        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          {phone ? (
            <a href={phoneHref(phone)} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:text-highlight">
              <Phone aria-hidden="true" className="size-4 shrink-0 text-highlight" />
              {phone}
            </a>
          ) : null}
          <ButtonLink href="/kontak" variant="highlight">
            {CONTACT_LABEL}
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}
