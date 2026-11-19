const UNIQUE_VIOLATION_PATTERN = /duplicate key value violates unique constraint "([^"]+)"/;

export function duplicateFieldFrom(error: unknown): "slug" | "key" | null {
  if (!(error instanceof Error)) {
    return null;
  }
  const constraint = UNIQUE_VIOLATION_PATTERN.exec(error.message)?.[1];
  if (!constraint) {
    return null;
  }
  return constraint.endsWith("_slug_key") ? "slug" : constraint.endsWith("_key_key") ? "key" : null;
}
