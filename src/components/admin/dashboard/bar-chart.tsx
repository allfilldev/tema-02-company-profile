type BarChartProps = {
  data: { label: string; value: number }[];
  label: string;
  axisTitle?: string;
};

const WIDTH = 640;
const HEIGHT = 300;
const LEFT = 52;
const RIGHT = 8;
const TOP = 12;
const BASELINE = 262;
const BAR_RATIO = 0.6;
const MINIMUM_BAR_HEIGHT = 3;
const TICK_INTERVALS = 4;

function niceStep(maximum: number): number {
  const rawStep = Math.max(1, maximum) / TICK_INTERVALS;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const candidate = [1, 2, 5, 10].find((multiplier) => multiplier * magnitude >= rawStep) ?? 10;
  return Math.max(1, candidate * magnitude);
}

export function BarChart({ data, label, axisTitle }: BarChartProps) {
  const maximum = Math.max(0, ...data.map((entry) => entry.value));
  const step = niceStep(maximum);
  const ceiling = step * TICK_INTERVALS;
  const plotWidth = WIDTH - LEFT - RIGHT;
  const slot = data.length === 0 ? plotWidth : plotWidth / data.length;
  const barWidth = slot * BAR_RATIO;
  const lastIndex = data.length - 1;
  const ticks = Array.from({ length: TICK_INTERVALS + 1 }, (_, index) => index * step);
  const yFor = (value: number) => BASELINE - (value / ceiling) * (BASELINE - TOP);

  return (
    <svg role="img" aria-label={label} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full text-primary">
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={LEFT} y1={yFor(tick)} x2={WIDTH - RIGHT} y2={yFor(tick)} stroke="currentColor" strokeWidth={1} strokeDasharray={tick === 0 ? undefined : "3 4"} className="text-secondary" />
          <text x={LEFT - 8} y={yFor(tick) + 4} textAnchor="end" fontSize={11} fill="currentColor" className="text-muted-foreground">
            {tick}
          </text>
        </g>
      ))}
      {axisTitle ? (
        <text transform={`translate(12 ${(TOP + BASELINE) / 2}) rotate(-90)`} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor" className="text-foreground">
          {axisTitle}
        </text>
      ) : null}
      {data.map((entry, index) => {
        const barHeight = entry.value === 0 ? MINIMUM_BAR_HEIGHT : Math.max(MINIMUM_BAR_HEIGHT, BASELINE - yFor(entry.value));
        const x = LEFT + index * slot + (slot - barWidth) / 2;
        const showLabel = (lastIndex - index) % 2 === 0;

        return (
          <g key={`${entry.label}-${index}`}>
            <rect x={x} y={BASELINE - barHeight} width={barWidth} height={barHeight} rx={3} fill="currentColor" className={entry.value === 0 ? "opacity-20" : undefined}>
              <title>{`${entry.label}: ${entry.value}`}</title>
            </rect>
            {showLabel ? (
              <text x={x + barWidth / 2} y={BASELINE + 20} textAnchor="middle" fontSize={11} fill="currentColor" className="text-muted-foreground">
                {entry.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
