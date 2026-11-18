import { describe, expect, it } from "vitest";
import { newestIsoDate } from "@/lib/seo/dates";

const FALLBACK = "2026-01-01T00:00:00.000Z";

describe("newestIsoDate", () => {
  it("picks the newest of several dates", () => {
    const newest = newestIsoDate(
      ["2026-10-01T08:00:00.000Z", "2026-11-05T08:00:00.000Z", "2026-09-20T08:00:00.000Z"],
      FALLBACK,
    );

    expect(newest).toBe("2026-11-05T08:00:00.000Z");
  });

  it("returns the fallback for an empty list", () => {
    expect(newestIsoDate([], FALLBACK)).toBe(FALLBACK);
  });

  it("ignores an invalid date string", () => {
    expect(newestIsoDate(["not-a-date", "2026-10-01T08:00:00.000Z"], FALLBACK)).toBe("2026-10-01T08:00:00.000Z");
  });

  it("returns the fallback when no date is valid", () => {
    expect(newestIsoDate(["not-a-date"], FALLBACK)).toBe(FALLBACK);
  });

  it("returns an ISO string", () => {
    const result = newestIsoDate(["2026-11-05T15:00:00+07:00"], FALLBACK);

    expect(result).toBe("2026-11-05T08:00:00.000Z");
    expect(new Date(result).toISOString()).toBe(result);
  });
});
