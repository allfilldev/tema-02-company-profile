import Link from "next/link";

type AuthorBylineProps = {
  authorName: string;
};

export function AuthorByline({ authorName }: AuthorBylineProps) {
  return (
    <p className="text-base text-muted-foreground">
      Oleh{" "}
      <Link href="/tentang" rel="author" className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover">
        {authorName}
      </Link>
    </p>
  );
}
