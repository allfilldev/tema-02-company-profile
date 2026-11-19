"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { joinClassNames } from "@/lib/ui/class-names";
import type { NavigationItem } from "@/server/site/navigation";

type MobileMenuProps = {
  navigation: NavigationItem[];
  onOpenChange?: (open: boolean) => void;
  phone?: string;
};

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) {
    return false;
  }
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

const MENU_ID = "menu-mobile";

const LIST_CLASS_NAME_CLOSED = "hidden md:flex md:items-center md:gap-1";

const LIST_CLASS_NAME_OPEN =
  "menu-enter absolute inset-x-0 top-full flex flex-col rounded-b-2xl bg-surface-inverse px-4 pb-5 pt-2 text-surface-inverse-foreground shadow-soft md:static md:flex-row md:items-center md:gap-1 md:rounded-none md:bg-transparent md:p-0 md:text-inherit md:shadow-none";

const LINK_CLASS_NAME =
  "inline-flex min-h-11 w-full items-center rounded-full px-4 font-medium transition-colors hover:bg-current/10 md:w-auto md:px-3 md:text-sm lg:px-4"
const ACTIVE_LINK_CLASS_NAME = "underline decoration-highlight decoration-2 underline-offset-8";

const TOGGLE_CLASS_NAME =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full transition-colors hover:bg-current/10 md:hidden";

export function MobileMenu({ navigation, onOpenChange, phone }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open, closeMenu]);

  const ToggleIcon = open ? X : Menu;

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className={TOGGLE_CLASS_NAME}
        aria-expanded={open}
        aria-controls={MENU_ID}
        aria-label={open ? "Tutup menu" : "Buka menu"}
        onClick={() => setOpen((current) => !current)}
      >
        <ToggleIcon aria-hidden="true" className="size-6" />
      </button>
      <ul id={MENU_ID} className={open ? LIST_CLASS_NAME_OPEN : LIST_CLASS_NAME_CLOSED}>
        {navigation.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={joinClassNames(LINK_CLASS_NAME, isActive(pathname, item.href) && ACTIVE_LINK_CLASS_NAME)}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          </li>
        ))}
        {open ? (
          <li className="mt-2 flex flex-col gap-2 border-t border-surface-inverse-foreground/15 pt-4 md:hidden">
            {phone ? (
              <a href={`tel:${phone.replace(/\s+/g, "")}`} className="inline-flex min-h-11 items-center px-4 text-sm font-medium">
                {phone}
              </a>
            ) : null}
            <ButtonLink href="/kontak" variant="highlight" onClick={closeMenu}>
              Hubungi kami
            </ButtonLink>
          </li>
        ) : null}
      </ul>
    </>
  );
}
