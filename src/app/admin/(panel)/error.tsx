"use client";

import { TriangleAlert } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { ADMIN_ROUTES } from "@/lib/site/routes";

type AdminErrorProps = {
  error: Error;
  reset: () => void;
};

export default function AdminError({ reset }: AdminErrorProps) {
  return (
    <section role="alert" className="flex flex-col items-start gap-4 rounded-2xl border border-danger bg-surface p-6 shadow-soft md:p-8">
      <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-danger text-surface">
        <TriangleAlert className="size-6" />
      </span>
      <h1 className="font-heading text-2xl font-bold text-foreground">Terjadi kesalahan</h1>
      <p className="text-foreground">Halaman ini tidak bisa dimuat. Coba lagi, atau kembali ke dashboard bila masalahnya berlanjut.</p>
      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={reset}>
          Coba lagi
        </Button>
        <ButtonLink href={ADMIN_ROUTES.root} variant="secondary">
          Ke dashboard
        </ButtonLink>
      </div>
    </section>
  );
}
