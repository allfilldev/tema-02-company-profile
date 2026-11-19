import { Container } from "@/components/ui/container";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { Stat } from "@/core/domain/stat/stat";
import { joinClassNames } from "@/lib/ui/class-names";
import { WaveEdge } from "./wave-edge";

type StatsSectionProps = {
  stats: Stat[];
  intro?: SectionIntro;
  id?: string;
  /** Draw the wavy top edge (omit when the previous section is also dark). */
  edgeTop?: boolean;
  /** The next block overlaps the bottom of this section, so no bottom wave and extra padding. */
  overlapped?: boolean;
};

const NUMBER_FORMAT = new Intl.NumberFormat("id-ID");
const NUMERAL_COLOR_CLASS_NAMES = ["text-primary", "text-highlight", "text-success"];

function formatStatValue(stat: Stat): string {
  return `${NUMBER_FORMAT.format(stat.value)}${stat.suffix ?? ""}`;
}

function ColoredNumeral({ text, offset }: { text: string; offset: number }) {
  return (
    <>
      {Array.from(text).map((char, index) => (
        <span key={`${index}-${char}`} className={NUMERAL_COLOR_CLASS_NAMES[(offset + index) % NUMERAL_COLOR_CLASS_NAMES.length]}>
          {char}
        </span>
      ))}
    </>
  );
}

export function StatsSection({ stats, intro, id = "statistik", edgeTop = true, overlapped = false }: StatsSectionProps) {
  if (stats.length === 0 || !intro) {
    return null;
  }

  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={joinClassNames(
        "relative z-10 bg-surface-inverse pt-20 text-surface-inverse-foreground md:pt-28",
        overlapped ? "pb-32 md:pb-44" : "pb-20 md:pb-28",
      )}
    >
      {edgeTop ? <WaveEdge edge="top" tone="inverse" /> : null}
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 text-center lg:col-span-7">
            {stats.map((stat, index) => (
              <div key={stat.key} className="flex min-w-0 flex-col-reverse gap-1">
                <dt className="text-sm font-medium text-surface-inverse-foreground/80 md:text-base">{stat.label}</dt>
                <dd className="font-heading text-5xl font-extrabold leading-none sm:text-6xl tracking-tighter md:text-7xl xl:text-8xl">
                  <ColoredNumeral text={formatStatValue(stat)} offset={index} />
                </dd>
              </div>
            ))}
          </dl>
          <header className="min-w-0 lg:col-span-5">
            {intro.eyebrow ? (
              <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-surface-inverse-foreground/80">
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-highlight" />
                {intro.eyebrow}
              </p>
            ) : null}
            <h2 id={titleId} className="mt-3 text-3xl font-extrabold tracking-tighter text-surface-inverse-foreground md:text-4xl">
              {intro.title}
            </h2>
            {intro.description ? <p className="mt-4 text-base text-surface-inverse-foreground/80 md:text-lg">{intro.description}</p> : null}
          </header>
        </div>
      </Container>
      {overlapped ? null : <WaveEdge edge="bottom" tone="inverse" />}
    </section>
  );
}
