import type { ComponentPropsWithoutRef } from "react";
import { joinClassNames } from "@/lib/ui/class-names";

export function AdminCard({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={joinClassNames("min-w-0 rounded-2xl border border-border bg-surface p-5 sm:p-6", className)} {...props} />;
}
