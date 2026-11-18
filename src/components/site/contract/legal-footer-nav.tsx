import Link from "next/link";
import { LEGAL_LINKS } from "@/server/site/navigation";

const LINK_CLASS_NAME = "inline-flex min-h-11 items-center text-sm text-muted-foreground underline underline-offset-4 hover:text-primary";

export function LegalFooterNav() {
  return (
    <nav aria-label="Informasi hukum">
      <ul className="flex flex-wrap gap-x-6 gap-y-1">
        {LEGAL_LINKS.map((link) => (
          <li key={link.slug}>
            <Link href={link.href} rel={link.rel ?? undefined} className={LINK_CLASS_NAME}>
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/kontak" className={LINK_CLASS_NAME}>
            Kontak
          </Link>
        </li>
      </ul>
    </nav>
  );
}
