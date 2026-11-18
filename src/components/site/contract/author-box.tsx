import Link from "next/link";
import { SiteImage } from "@/components/ui/site-image";
import type { TeamMember } from "@/core/domain/team/team-member";
import type { AuthorFacts } from "@/server/site/models/articles";

type AuthorBoxProps = {
  author: TeamMember;
  facts: AuthorFacts;
};

const HEADING_ID = "author-bio-heading";
const LINK_CLASS_NAME = "inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4 hover:text-primary-hover";

export function AuthorBox({ author, facts }: AuthorBoxProps) {
  return (
    <aside id="author-bio" aria-labelledby={HEADING_ID} className="rounded-lg border border-border bg-surface p-6 shadow-card">
      <h2 id={HEADING_ID} className="text-xl font-bold text-foreground">
        Tentang penulis
      </h2>
      <div className="mt-4 flex items-start gap-4">
        {author.photo ? (
          <div className="w-24 shrink-0 overflow-hidden rounded-lg">
            <SiteImage media={author.photo} sizes="96px" className="w-full" />
          </div>
        ) : null}
        <div>
          <p className="text-lg font-semibold text-foreground">{author.name}</p>
          <p className="text-sm text-muted-foreground">{author.jobTitle}</p>
        </div>
      </div>
      <p className="mt-4 text-base text-foreground">{author.bio}</p>
      {author.yearsExperience !== null || facts.completedProjects !== null ? (
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          {author.yearsExperience !== null ? (
            <div>
              <dt className="text-muted-foreground">Pengalaman</dt>
              <dd className="font-semibold text-foreground">{author.yearsExperience} tahun</dd>
            </div>
          ) : null}
          {facts.completedProjects !== null ? (
            <div>
              <dt className="text-muted-foreground">Proyek selesai</dt>
              <dd className="font-semibold text-foreground">{facts.completedProjects}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
        <li>
          <Link href="/tentang" className={LINK_CLASS_NAME}>
            Kenali tim kami
          </Link>
        </li>
        <li>
          <Link href="/kontak" className={LINK_CLASS_NAME}>
            Hubungi kami
          </Link>
        </li>
        <li>
          <Link href="/kebijakan-editorial" className={LINK_CLASS_NAME}>
            Kebijakan editorial
          </Link>
        </li>
      </ul>
    </aside>
  );
}
