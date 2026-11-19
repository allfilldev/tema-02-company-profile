"use client";

import { PanelLeft } from "lucide-react";
import { useState, type ReactNode } from "react";
import { joinClassNames } from "@/lib/ui/class-names";

type AdminFrameProps = {
  sidebar: ReactNode;
  mobileMenu: ReactNode;
  search: ReactNode;
  actions: ReactNode;
  children: ReactNode;
};

const SIDEBAR_ID = "admin-sidebar";

export function AdminFrame({ sidebar, mobileMenu, search, actions, children }: AdminFrameProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-surface-muted lg:flex">
      <aside
        id={SIDEBAR_ID}
        className={joinClassNames(
          "hidden bg-sidebar text-sidebar-foreground lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col lg:overflow-y-auto",
          collapsed ? "" : "lg:flex",
        )}
      >
        {sidebar}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-2 bg-surface-muted px-4 py-2 md:gap-3 md:px-6">
          {mobileMenu}
          <button
            type="button"
            aria-label={collapsed ? "Bentangkan menu samping" : "Ciutkan menu samping"}
            aria-expanded={!collapsed}
            aria-controls={SIDEBAR_ID}
            onClick={() => setCollapsed((current) => !current)}
            className="hidden min-h-11 min-w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary lg:inline-flex"
          >
            <PanelLeft aria-hidden="true" className="size-5" />
          </button>
          {search}
          <div className="ml-auto flex shrink-0 items-center gap-1">{actions}</div>
        </header>
        <main id="konten-admin" className="min-w-0 flex-1 px-4 pb-8 pt-2 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
