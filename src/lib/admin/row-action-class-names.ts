const ROW_ACTION_BASE =
  "motion-press inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-60";

export const ROW_ACTION_CLASS_NAME = `${ROW_ACTION_BASE} border-border bg-surface text-foreground hover:bg-accent hover:text-accent-foreground`;

export const ROW_ACTION_DANGER_CLASS_NAME = `${ROW_ACTION_BASE} border-danger text-danger hover:bg-danger/10`;
