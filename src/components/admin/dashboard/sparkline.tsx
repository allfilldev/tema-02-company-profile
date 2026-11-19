import { joinClassNames } from "@/lib/ui/class-names";

type SparklineProps = {
  values: number[];
  label: string;
  className?: string;
};

const WIDTH = 120;
const HEIGHT = 36;
const PADDING = 3;

function toPoints(values: number[]): { x: number; y: number }[] {
  const safeValues = values.length === 0 ? [0, 0] : values.length === 1 ? [values[0], values[0]] : values;
  const minimum = Math.min(...safeValues);
  const maximum = Math.max(...safeValues);
  const range = maximum - minimum;
  const usableHeight = HEIGHT - PADDING * 2;
  const step = (WIDTH - PADDING * 2) / (safeValues.length - 1);

  return safeValues.map((value, index) => ({
    x: PADDING + index * step,
    y: range === 0 ? HEIGHT / 2 : PADDING + usableHeight - ((value - minimum) / range) * usableHeight,
  }));
}

export function Sparkline({ values, label, className }: SparklineProps) {
  const points = toPoints(values);
  const line = points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");
  const area = `${PADDING},${HEIGHT} ${line} ${WIDTH - PADDING},${HEIGHT}`;

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      className={joinClassNames("h-12 w-full", className ?? "text-primary")}
    >
      <polygon points={area} fill="currentColor" className="opacity-10" />
      <polyline points={line} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
