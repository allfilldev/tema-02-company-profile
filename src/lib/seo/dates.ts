export function newestIsoDate(isoDates: readonly string[], fallback: string): string {
  const timestamps = isoDates.map((isoDate) => Date.parse(isoDate)).filter((timestamp) => !Number.isNaN(timestamp));
  return new Date(timestamps.length > 0 ? Math.max(...timestamps) : Date.parse(fallback)).toISOString();
}
