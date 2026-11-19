import type { ComponentProps } from "react";
import { joinClassNames } from "@/lib/ui/class-names";

type IconButtonTone = "primary" | "highlight" | "inverse";
type IconButtonSize = "md" | "lg";

const BASE_CLASS_NAME =
  "motion-press inline-flex shrink-0 items-center justify-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-60";

const TONE_CLASS_NAMES: Record<IconButtonTone, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  highlight: "bg-highlight text-highlight-foreground hover:bg-highlight-hover",
  inverse: "bg-surface text-surface-inverse hover:bg-accent hover:text-accent-foreground",
};

const SIZE_CLASS_NAMES: Record<IconButtonSize, string> = {
  md: "min-h-11 min-w-11",
  lg: "min-h-12 min-w-12",
};

export type IconButtonProps = Omit<ComponentProps<"button">, "aria-label"> & {
  tone: IconButtonTone;
  label: string;
  size?: IconButtonSize;
  className?: string;
};

export function IconButton({ tone, label, size = "md", type = "button", className, ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={joinClassNames(BASE_CLASS_NAME, TONE_CLASS_NAMES[tone], SIZE_CLASS_NAMES[size], className)}
      {...props}
    />
  );
}
