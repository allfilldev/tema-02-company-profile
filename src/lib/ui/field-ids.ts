export function fieldErrorId(controlId: string): string {
  return `${controlId}-error`;
}

export function invalidControlProps(
  controlId: string | undefined,
  invalid: boolean | undefined,
): { "aria-invalid"?: true; "aria-describedby"?: string } {
  if (!invalid) return {};
  return controlId ? { "aria-invalid": true, "aria-describedby": fieldErrorId(controlId) } : { "aria-invalid": true };
}
