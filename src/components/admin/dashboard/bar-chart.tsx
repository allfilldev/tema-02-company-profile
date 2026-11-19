type BarChartProps = {
  data: { label: string; value: number }[];
  label: string;
};

const WIDTH = 560;
const HEIGHT = 200;
const BASELINE = 170;
const TOP = 12;
const BAR_RATIO = 0.62;
const MINIMUM_BAR_HEIGHT = 3;

export function BarChart({ data, label }: BarChartProps) {
  const maximum = Math.max(1, ...data.map((entry) => entry.value));
  const slot = data.length === 0 ? WIDTH : WIDTH / data.length;
  const barWidth = slot * BAR_RATIO;
  const lastIndex = data.length - 1;

  return (
    <svg role="img" aria-label={label} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full text-primary">
      <line x1={0} y1={BASELINE} x2={WIDTH} y2={BASELINE} stroke="currentColor" strokeWidth={1} className="text-border" />
      {data.map((entry, index) => {
        const barHeight = entry.value === 0 ? MINIMUM_BAR_HEIGHT : Math.max(MINIMUM_BAR_HEIGHT, (entry.value / maximum) * (BASELINE - TOP));
        const x = index * slot + (slot - barWidth) / 2;
        const showLabel = index === 0 || index === lastIndex || index === Math.floor(lastIndex / 2);

        return (
          <g key={`${entry.label}-${index}`}>
            <rect x={x} y={BASELINE - barHeight} width={barWidth} height={barHeight} rx={4} fill="currentColor" className={entry.value === 0 ? "opacity-20" : undefined}>
              <title>{`${entry.label}: ${entry.value}`}</title>
            </rect>
            {showLabel ? (
              <text x={x + barWidth / 2} y={HEIGHT - 8} textAnchor={index === 0 ? "start" : index === lastIndex ? "end" : "middle"} fontSize={12} fill="currentColor" className="text-muted-foreground">
                {entry.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
