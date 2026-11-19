"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

type AdminAccountMenuProps = {
  email: string;
  children: ReactNode;
};

const PANEL_ID = "admin-account-panel";

export function AdminAccountMenu({ email, children }: AdminAccountMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const initial = email.trim().charAt(0).toUpperCase();

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
    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label="Menu akun"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={PANEL_ID}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex min-h-11 items-center gap-2 rounded-full pl-1 pr-2 text-foreground transition-colors hover:bg-secondary"
      >
        <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {initial}
        </span>
        <ChevronDown aria-hidden="true" className="hidden size-4 sm:block" />
      </button>
      <div
        id={PANEL_ID}
        hidden={!open}
        className="absolute right-0 top-full z-30 mt-2 flex w-64 flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft"
      >
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground">MASUK SEBAGAI</p>
          <p className="truncate text-sm font-medium text-foreground" title={email}>
            {email}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
