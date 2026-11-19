import Link from "next/link";

type AuthorBylineProps = {
  authorName: string;
};

export function AuthorByline({ authorName }: AuthorBylineProps) {
  return (
    <p className="text-base text-surface-inverse-foreground/85">
      Oleh{" "}
      <Link href="/tentang" rel="author" className="font-medium text-highlight underline underline-offset-4 hover:text-highlight-hover">
        {authorName}
      </Link>
    </p>
  );
}
