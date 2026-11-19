export type ImageFadeState = "pending" | "visible";

export function imageFadeState(complete: boolean): ImageFadeState {
  return complete ? "visible" : "pending";
}
