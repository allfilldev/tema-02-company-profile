import type { ComponentProps } from "react";
import { joinClassNames } from "@/lib/ui/class-names";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={joinClassNames("rounded-lg border border-border bg-surface p-6 shadow-card", className)} {...props} />
  );
}
