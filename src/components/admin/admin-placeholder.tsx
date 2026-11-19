type AdminPlaceholderProps = {
  email: string;
};

export function AdminPlaceholder({ email }: AdminPlaceholderProps) {
  return (
    <section>
      <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Masuk sebagai {email}.</p>
    </section>
  );
}
