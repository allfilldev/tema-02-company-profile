export type DailyActivity = { date: string; count: number };

const DAY_IN_MILLISECONDS = 86_400_000;
const JAKARTA_DAY_FORMAT = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" });

function jakartaDay(timestamp: number): string {
  return JAKARTA_DAY_FORMAT.format(timestamp);
}

export function buildMessageActivity(messages: { createdAt: string }[], today: Date, days = 14): DailyActivity[] {
  const counts = new Map<string, number>();
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    counts.set(jakartaDay(today.getTime() - offset * DAY_IN_MILLISECONDS), 0);
  }

  for (const message of messages) {
    const timestamp = Date.parse(message.createdAt);
    if (Number.isNaN(timestamp)) continue;
    const day = jakartaDay(timestamp);
    const current = counts.get(day);
    if (current !== undefined) counts.set(day, current + 1);
  }

  return [...counts].map(([date, count]) => ({ date, count }));
}

const HEATMAP_DAYS = 7;
const HEATMAP_SLOTS = 8;
const HOURS_PER_SLOT = 3;
const JAKARTA_SLOT_FORMAT = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", weekday: "short", hour: "numeric", hourCycle: "h23" });
const WEEKDAY_ROWS: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

export function buildMessageHeatmap(messages: { createdAt: string }[]): number[][] {
  const grid = Array.from({ length: HEATMAP_DAYS }, () => new Array<number>(HEATMAP_SLOTS).fill(0));

  for (const message of messages) {
    const timestamp = Date.parse(message.createdAt);
    if (Number.isNaN(timestamp)) continue;
    const parts = JAKARTA_SLOT_FORMAT.formatToParts(timestamp);
    const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
    const hour = Number(parts.find((part) => part.type === "hour")?.value);
    const row = WEEKDAY_ROWS[weekday];
    if (row === undefined || Number.isNaN(hour)) continue;
    grid[row][Math.min(HEATMAP_SLOTS - 1, Math.floor(hour / HOURS_PER_SLOT))] += 1;
  }

  return grid;
}

const WEEK_LENGTH = 7;

export function computeTrendPercent(dailyCounts: number[]): number {
  const latest = dailyCounts.slice(-WEEK_LENGTH).reduce((sum, count) => sum + count, 0);
  const previous = dailyCounts.slice(-WEEK_LENGTH * 2, -WEEK_LENGTH).reduce((sum, count) => sum + count, 0);
  if (previous === 0) return latest === 0 ? 0 : 100;
  return Math.round(((latest - previous) / previous) * 100);
}
