export type RevealState = "visible" | "hidden";

export type RevealStateInput = {
  reducedMotion: boolean;
  intersecting: boolean;
  initiallyInViewport: boolean;
};

export function resolveRevealState({ reducedMotion, intersecting, initiallyInViewport }: RevealStateInput): RevealState {
  if (reducedMotion || initiallyInViewport || intersecting) {
    return "visible";
  }
  return "hidden";
}
