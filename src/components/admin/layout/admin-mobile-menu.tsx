"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { AdminNav } from "@/components/admin/layout/admin-nav";
import type { AdminMenuItem } from "@/lib/admin/admin-menu";

type AdminMobileMenuProps = {
  menu: AdminMenuItem[];
};

const PANEL_ID = "admin-mobile-menu";
const FOCUSABLE_SELECTOR = "a[href], button:not([disabled])";
const TRIGGER_CLASS_NAME =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary";

export function AdminMobileMenu({ menu }: AdminMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  useEffect(() => {
    if (!open) {
      return;
    }
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function trapFocus(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !panelRef.current) {
      return;
    }
    const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        aria-controls={PANEL_ID}
        onClick={() => setOpen((current) => !current)}
        className={TRIGGER_CLASS_NAME}
      >
        <Menu aria-hidden="true" className="size-6" />
      </button>
      {open ? (
        <div className="fixed inset-0 z-40">
          <div aria-hidden="true" onClick={close} className="absolute inset-0 bg-surface-inverse/60" />
          <div
            id={PANEL_ID}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu admin"
            onKeyDown={trapFocus}
            className="relative flex h-full w-72 max-w-full flex-col gap-6 overflow-y-auto bg-sidebar p-4 text-sidebar-foreground shadow-soft"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="px-3 font-heading text-lg font-bold text-surface-inverse-foreground">Admin</p>
              <button
                type="button"
                aria-label="Tutup menu"
                onClick={close}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-sidebar-foreground transition-colors hover:bg-sidebar-active/40"
              >
                <X aria-hidden="true" className="size-6" />
              </button>
            </div>
            <AdminNav menu={menu} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
