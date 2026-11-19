import { Container } from "@/components/ui/container";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { Stat } from "@/core/domain/stat/stat";
import { WaveEdge } from "./wave-edge";

type StatsSectionProps = {
  stats: Stat[];
  intro?: SectionIntro;
  id?: string;
};

const NUMBER_FORMAT = new Intl.NumberFormat("id-ID");

function formatStatValue(stat: Stat): string {
  return `${NUMBER_FORMAT.format(stat.value)}${stat.suffix ?? ""}`;
}

export function StatsSection({ stats, intro, id = "statistik" }: StatsSectionProps) {
  if (stats.length === 0 || !intro) {
    return null;
  }

  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="relative z-10 bg-surface-inverse py-20 text-surface-inverse-foreground md:py-28"
    >
      <WaveEdge edge="top" tone="inverse" />
      <Container>
        <header className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          {intro.eyebrow ? <p className="text-sm font-bold uppercase tracking-widest text-accent">{intro.eyebrow}</p> : null}
          <h2 id={titleId} className="mt-3 text-3xl font-extrabold tracking-tighter text-surface-inverse-foreground md:text-5xl">
            {intro.title}
          </h2>
          {intro.description ? <p className="mt-4 text-lg text-surface-inverse-foreground/80">{intro.description}</p> : null}
        </header>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 text-center lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.key} className="flex min-w-0 flex-col-reverse gap-2">
              <dt className="text-base font-medium text-surface-inverse-foreground/80 md:text-lg">{stat.label}</dt>
              <dd className="text-5xl font-extrabold tracking-tighter text-surface-inverse-foreground md:text-6xl xl:text-7xl">
                {formatStatValue(stat)}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
      <WaveEdge edge="bottom" tone="inverse" />
    </section>
  );
}
