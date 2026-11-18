const INDONESIAN_DATE_FORMAT = new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "Asia/Jakarta" });

export function formatIndonesianDate(isoDate: string): string {
  const timestamp = Date.parse(isoDate);
  if (Number.isNaN(timestamp)) {
    return isoDate;
  }
  return INDONESIAN_DATE_FORMAT.format(timestamp);
}
