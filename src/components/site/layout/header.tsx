"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { SiteImage } from "@/components/ui/site-image";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import { joinClassNames } from "@/lib/ui/class-names";
import type { NavigationItem } from "@/server/site/navigation";
import { MobileMenu } from "./mobile-menu";

type HeaderProps = {
  siteName: string;
  logo: MediaAsset | null;
  navigation: NavigationItem[];
};

const SCROLL_THRESHOLD_PX = 8;

const HEADER_BASE_CLASS_NAME = "sticky top-0 z-30 transition-colors duration-300";

const HEADER_TOP_CLASS_NAME = "bg-surface-inverse text-surface-inverse-foreground";

const HEADER_SCROLLED_CLASS_NAME = "bg-surface/95 text-foreground shadow-soft backdrop-blur";

export function Header({ siteName, logo, navigation }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function updateScrolled() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    }
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  return (
    <header
      className={joinClassNames(HEADER_BASE_CLASS_NAME, scrolled ? HEADER_SCROLLED_CLASS_NAME : HEADER_TOP_CLASS_NAME)}
    >
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-3 focus:font-semibold focus:text-primary-foreground"
      >
        Lewati ke konten utama
      </a>
      <Container className="flex min-h-16 items-center justify-between gap-4 md:min-h-20">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2">
          {logo ? (
            <>
              <SiteImage media={logo} eager className="max-h-14 w-auto" />
              <span className="sr-only">{siteName}</span>
            </>
          ) : (
            <span className="font-heading text-lg font-bold tracking-tight">{siteName}</span>
          )}
        </Link>
        <nav aria-label="Navigasi utama">
          <MobileMenu navigation={navigation} />
        </nav>
      </Container>
    </header>
  );
}
