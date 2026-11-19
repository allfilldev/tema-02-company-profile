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
