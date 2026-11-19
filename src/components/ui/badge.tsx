import type { ComponentProps } from "react";
import { joinClassNames } from "@/lib/ui/class-names";

export function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={joinClassNames(
        "inline-flex items-center rounded-full bg-accent px-3.5 py-1 text-sm font-semibold text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}
