export type RevealVariant = "up" | "fade" | "scale" | "left" | "right" | "zoom";

export const MAX_STAGGER_STEPS = 6;

const DEFAULT_STAGGER_STEP_MS = 80;

export function staggerDelayMs(index: number, stepMs: number = DEFAULT_STAGGER_STEP_MS): number {
  const steps = Number.isFinite(index) ? Math.max(0, Math.floor(index)) : 0;
  return Math.min(steps, MAX_STAGGER_STEPS) * stepMs;
}
