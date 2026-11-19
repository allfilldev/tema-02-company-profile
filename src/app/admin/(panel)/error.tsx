"use client";

import { Button } from "@/components/ui/button";

type AdminErrorProps = {
  error: Error;
  reset: () => void;
};

export default function AdminError({ reset }: AdminErrorProps) {
  return (
    <section role="alert" className="flex flex-col items-start gap-4 rounded-lg border border-danger p-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Terjadi kesalahan</h1>
      <p className="text-foreground">Halaman ini tidak bisa dimuat. Coba lagi, atau kembali ke dashboard bila masalahnya berlanjut.</p>
      <Button type="button" onClick={reset}>
        Coba lagi
      </Button>
    </section>
  );
}
