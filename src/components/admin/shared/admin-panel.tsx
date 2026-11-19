import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { joinClassNames } from "@/lib/ui/class-names";

type AdminPanelProps = {
  icon: LucideIcon;
  title: string;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
};

export function AdminPanel({ icon: Icon, title, action, className, bodyClassName = "p-5", children }: AdminPanelProps) {
  return (
    <section className={joinClassNames("flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface", className)}>
      <header className="flex items-center gap-3 border-b border-secondary px-5 py-3">
        <span aria-hidden="true" className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground">
          <Icon className="size-4" />
        </span>
        <h2 className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{title}</h2>
        {action}
      </header>
      <div className={joinClassNames("min-w-0 flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}
