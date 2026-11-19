import { Button } from "@/components/ui/button";
import { signOut } from "@/server/actions/admin/auth";

type AdminPlaceholderProps = {
  email: string;
};

export function AdminPlaceholder({ email }: AdminPlaceholderProps) {
  return (
    <main className="min-h-screen bg-surface-muted py-12">
      <div className="mx-auto w-full max-w-3xl px-4">
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Masuk sebagai {email}.</p>
        <form action={signOut} className="mt-6">
          <Button type="submit" variant="secondary">
            Keluar
          </Button>
        </form>
      </div>
    </main>
  );
}
