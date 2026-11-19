import { joinClassNames } from "@/lib/ui/class-names";

type MiniBarsProps = {
  values: number[];
  label: string;
  className?: string;
};

const WIDTH = 120;
const HEIGHT = 36;
const MINIMUM_BAR_HEIGHT = 2;
const BAR_RATIO = 0.55;

export function MiniBars({ values, label, className }: MiniBarsProps) {
  const safeValues = values.length === 0 ? [0] : values;
  const maximum = Math.max(1, ...safeValues);
  const slot = WIDTH / safeValues.length;
  const barWidth = slot * BAR_RATIO;

  return (
    <svg role="img" aria-label={label} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" className={joinClassNames("h-12 w-full text-primary", className)}>
      {safeValues.map((value, index) => {
        const barHeight = Math.max(MINIMUM_BAR_HEIGHT, (value / maximum) * HEIGHT);
        return <rect key={index} x={index * slot + (slot - barWidth) / 2} y={HEIGHT - barHeight} width={barWidth} height={barHeight} rx={1} fill="currentColor" className={value === 0 ? "opacity-30" : undefined} />;
      })}
    </svg>
  );
}
