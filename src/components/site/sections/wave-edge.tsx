import { WaveDivider } from "@/components/ui/wave-divider";
import { joinClassNames } from "@/lib/ui/class-names";

type WaveEdgeProps = {
  edge: "top" | "bottom";
  tone: "surface-muted" | "inverse";
};

const EDGE_CLASS_NAMES: Record<WaveEdgeProps["edge"], string> = {
  top: "bottom-full",
  bottom: "top-full",
};

export function WaveEdge({ edge, tone }: WaveEdgeProps) {
  return (
    <div aria-hidden="true" className={joinClassNames("pointer-events-none absolute inset-x-0 h-10 md:h-16", EDGE_CLASS_NAMES[edge])}>
      <WaveDivider position={edge === "top" ? "bottom" : "top"} tone={tone} />
    </div>
  );
}
