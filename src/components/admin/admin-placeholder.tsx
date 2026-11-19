import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { signOut } from "@/server/actions/admin/auth";

type AdminPlaceholderProps = {
  email: string;
};

export function AdminPlaceholder({ email }: AdminPlaceholderProps) {
  return (
    <main className="min-h-screen bg-surface-muted py-12">
      <Container className="max-w-3xl">
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Masuk sebagai {email}.</p>
        <form action={signOut} className="mt-6">
          <Button type="submit" variant="secondary">
            Keluar
          </Button>
        </form>
      </Container>
    </main>
  );
}
