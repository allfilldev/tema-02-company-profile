"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type KeyboardEvent } from "react";
import type { AdminMenuItem } from "@/lib/admin/admin-menu";
import { filterAdminMenu } from "@/lib/admin/admin-menu-groups";

type AdminSearchProps = {
  menu: AdminMenuItem[];
};

export function AdminSearch({ menu }: AdminSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const searching = query.trim() !== "";
  const results = searching ? filterAdminMenu(menu, query) : [];

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setQuery("");
    }
    if (event.key === "Enter" && results.length > 0) {
      event.preventDefault();
      router.push(results[0].href);
      setQuery("");
    }
  }

  return (
    <div className="relative min-w-0 flex-1 md:max-w-sm">
      <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        aria-label="Cari menu"
        placeholder="Cari menu..."
        autoComplete="off"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-11 w-full rounded-full border border-transparent bg-surface pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary"
      />
      {searching ? (
        <div className="absolute inset-x-0 top-full z-30 mt-2 rounded-2xl border border-border bg-surface p-2 shadow-soft">
          {results.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {results.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setQuery("")}
                    className="flex min-h-11 items-center rounded-xl px-3 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <span className="min-w-0 truncate">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-3 text-sm text-muted-foreground">Menu tidak ditemukan</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
