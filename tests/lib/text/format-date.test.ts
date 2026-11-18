import { describe, expect, it } from "vitest";
import { formatIndonesianDate } from "@/lib/text/format-date";

describe("formatIndonesianDate", () => {
  it("formats an ISO timestamp as a long Indonesian date", () => {
    expect(formatIndonesianDate("2026-11-05T08:00:00.000Z")).toBe("5 November 2026");
  });

  it("uses the Asia/Jakarta calendar day", () => {
    expect(formatIndonesianDate("2026-11-05T18:00:00.000Z")).toBe("6 November 2026");
  });

  it("returns the input unchanged when the date is invalid", () => {
    expect(formatIndonesianDate("bukan tanggal")).toBe("bukan tanggal");
  });
});
