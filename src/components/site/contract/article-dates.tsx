import { formatIndonesianDate } from "@/lib/text/format-date";

type ArticleDatesProps = {
  publishedAt: string;
  updatedAt: string;
};

export function ArticleDates({ publishedAt, updatedAt }: ArticleDatesProps) {
  return (
    <p className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-surface-inverse-foreground/85">
      <span>
        Diterbitkan <time dateTime={publishedAt}>{formatIndonesianDate(publishedAt)}</time>
      </span>
      <span>
        Diperbarui <time dateTime={updatedAt}>{formatIndonesianDate(updatedAt)}</time>
      </span>
    </p>
  );
}
