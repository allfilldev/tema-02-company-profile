import type { ComponentProps } from "react";
import { joinClassNames } from "@/lib/ui/class-names";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={joinClassNames("motion-zoom rounded-lg border border-border bg-surface p-6 shadow-card transition duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0", className)} {...props} />
  );
}
