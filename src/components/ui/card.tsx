import type { ComponentProps } from "react";
import { joinClassNames } from "@/lib/ui/class-names";

const BASE_CLASS_NAME = "motion-zoom rounded-2xl border border-border bg-surface p-6";
const INTERACTIVE_CLASS_NAME = "transition duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover focus-within:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0";

type CardProps = ComponentProps<"div"> & {
  /** Shows the card shadow only on hover or keyboard focus. Use for cards that link somewhere. */
  interactive?: boolean;
};

export function Card({ className, interactive = false, ...props }: CardProps) {
  return <div className={joinClassNames(BASE_CLASS_NAME, interactive ? INTERACTIVE_CLASS_NAME : "", className)} {...props} />;
}
