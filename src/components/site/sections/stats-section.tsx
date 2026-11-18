import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { Stat } from "@/core/domain/stat/stat";

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

  return (
    <Section id={id} eyebrow={intro.eyebrow} title={intro.title} description={intro.description}>
      <dl className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.key} className="flex flex-col-reverse gap-1">
            <dt className="text-base text-muted-foreground">{stat.label}</dt>
            <dd className="text-4xl font-bold tracking-tight text-primary">{formatStatValue(stat)}</dd>
          </Card>
        ))}
      </dl>
    </Section>
  );
}
