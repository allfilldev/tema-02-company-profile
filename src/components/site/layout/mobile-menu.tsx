"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { NavigationItem } from "@/server/site/navigation";

type MobileMenuProps = {
  navigation: NavigationItem[];
};

const MENU_ID = "menu-mobile";

const LIST_CLASS_NAME_CLOSED = "hidden md:flex md:items-center md:gap-1";

const LIST_CLASS_NAME_OPEN =
  "menu-enter absolute inset-x-0 top-full flex flex-col rounded-b-2xl bg-surface-inverse px-4 py-3 text-surface-inverse-foreground shadow-soft md:static md:flex-row md:items-center md:gap-1 md:rounded-none md:bg-transparent md:p-0 md:text-inherit md:shadow-none";

const LINK_CLASS_NAME =
  "inline-flex min-h-11 w-full items-center rounded-full px-4 font-medium transition-colors hover:bg-current/10 md:w-auto";

const TOGGLE_CLASS_NAME =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full transition-colors hover:bg-current/10 md:hidden";

export function MobileMenu({ navigation }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

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
            <Link href={item.href} className={LINK_CLASS_NAME} onClick={closeMenu}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
