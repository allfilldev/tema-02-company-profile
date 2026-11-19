import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  message: string;
  hint: string;
};

export function EmptyState({ icon: Icon, message, hint }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-surface p-8 text-center shadow-soft">
      <span aria-hidden="true" className="inline-flex size-10 items-center justify-center rounded-full bg-surface-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <p className="font-semibold text-foreground">{message}</p>
      <p className="text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}
