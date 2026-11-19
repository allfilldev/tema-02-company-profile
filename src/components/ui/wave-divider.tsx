import { joinClassNames } from "@/lib/ui/class-names";

type WaveDividerProps = {
  position: "top" | "bottom";
  tone: "surface" | "surface-muted" | "inverse";
  className?: string;
};

const TONE_CLASS_NAMES: Record<WaveDividerProps["tone"], string> = {
  surface: "text-surface",
  "surface-muted": "text-surface-muted",
  inverse: "text-surface-inverse",
};

const POSITION_CLASS_NAMES: Record<WaveDividerProps["position"], string> = {
  top: "top-0 rotate-180",
  bottom: "bottom-0",
};

export function WaveDivider({ position, tone, className }: WaveDividerProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={joinClassNames(
        "pointer-events-none absolute inset-x-0 block h-10 w-full fill-current md:h-16",
        POSITION_CLASS_NAMES[position],
        TONE_CLASS_NAMES[tone],
        className,
      )}
    >
      <path d="M0 80V40C240 0 480 0 720 32C960 64 1200 72 1440 24V80Z" />
    </svg>
  );
}
