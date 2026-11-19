"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AdminNav } from "@/components/admin/layout/admin-nav";
import type { AdminMenuItem } from "@/lib/admin/admin-menu";

type AdminMobileMenuProps = {
  menu: AdminMenuItem[];
};

const PANEL_ID = "admin-mobile-menu";

export function AdminMobileMenu({ menu }: AdminMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className="lg:hidden">
      <Button
        ref={buttonRef}
        type="button"
        variant="secondary"
        aria-expanded={open}
        aria-controls={PANEL_ID}
        onClick={() => setOpen((current) => !current)}
      >
        Menu
      </Button>
      {open ? (
        <div id={PANEL_ID} className="absolute inset-x-0 top-full z-20 border-b border-border bg-background p-4 shadow-md">
          <AdminNav menu={menu} onNavigate={() => setOpen(false)} />
        </div>
      ) : null}
    </div>
  );
}
